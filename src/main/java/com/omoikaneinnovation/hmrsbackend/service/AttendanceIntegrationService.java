package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.dto.AttendanceSummary;
import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.model.TimesheetSummary;
import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceIntegrationService {

    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private TimesheetService timesheetService;

    /**
     * Get monthly attendance summary for an employee
     * Uses Timesheet data instead of raw Attendance records
     * @param employeeId Employee ID
     * @param month Month in format "May-2026"
     * @return AttendanceSummary
     */
    public AttendanceSummary getMonthlyAttendance(String employeeId, String month) {
        try {
            // Use TimesheetService to get aggregated monthly summary
            TimesheetSummary timesheetSummary = timesheetService.getMonthlySummary(employeeId, month);
            
            if (timesheetSummary == null) {
                System.err.println("No timesheet data found for employeeId: " + employeeId + ", month: " + month);
                return createDefaultSummary(employeeId, month);
            }
            
            // Convert TimesheetSummary to AttendanceSummary
            int presentDays = timesheetSummary.getPresent() != null ? timesheetSummary.getPresent() : 0;
            int absentDays = timesheetSummary.getAbsent() != null ? timesheetSummary.getAbsent() : 0;
            int lopDays = timesheetSummary.getLop() != null ? timesheetSummary.getLop() : 0;
            int workingDays = timesheetSummary.getWorkingDays() != null ? timesheetSummary.getWorkingDays() : 30;
            int lateArrivals = timesheetSummary.getLateCount() != null ? timesheetSummary.getLateCount() : 0;
            
            // Calculate attendance percentage
            double attendancePercentage = workingDays > 0 
                ? (presentDays * 100.0) / workingDays 
                : 0.0;
            
            System.out.println("✅ TIMESHEET DATA USED:");
            System.out.println("   Employee: " + employeeId);
            System.out.println("   Month: " + month);
            System.out.println("   Present: " + presentDays);
            System.out.println("   Absent: " + absentDays);
            System.out.println("   LOP: " + lopDays);
            System.out.println("   Working Days: " + workingDays);
            System.out.println("   Late Arrivals: " + lateArrivals);
            System.out.println("   Attendance %: " + attendancePercentage);
            
            return AttendanceSummary.builder()
                .employeeId(employeeId)
                .month(month)
                .totalWorkingDays(workingDays)
                .presentDays(presentDays)
                .absentDays(absentDays)
                .lopDays(lopDays)
                .halfDays(0) // Can be enhanced later
                .lateArrivals(lateArrivals)
                .earlyDepartures(0) // Can be enhanced later
                .attendancePercentage(Math.round(attendancePercentage * 100.0) / 100.0)
                .totalWorkedMinutes(presentDays * 8 * 60) // Estimate: 8 hours per present day
                .overtimeMinutes(0) // Can be enhanced later
                .build();
                
        } catch (Exception e) {
            System.err.println("Error calculating attendance summary from timesheet: " + e.getMessage());
            e.printStackTrace();
            // Return default summary
            return createDefaultSummary(employeeId, month);
        }
    }
    
    /**
     * Helper method to create a default attendance summary when no data is found
     */
    private AttendanceSummary createDefaultSummary(String employeeId, String month) {
        return AttendanceSummary.builder()
            .employeeId(employeeId)
            .month(month)
            .totalWorkingDays(30)
            .presentDays(0)
            .absentDays(30)
            .lopDays(0)
            .attendancePercentage(0.0)
            .lateArrivals(0)
            .totalWorkedMinutes(0)
            .overtimeMinutes(0)
            .build();
    }

    /**
     * Calculate attendance bonus based on attendance percentage
     * @param summary AttendanceSummary
     * @return Bonus amount
     */
    public Double calculateAttendanceBonus(AttendanceSummary summary) {
        if (summary == null || summary.getAttendancePercentage() == null) {
            return 0.0;
        }
        
        double percentage = summary.getAttendancePercentage();
        
        // Bonus rules
        if (percentage >= 98.0) {
            return 2000.0; // Excellent attendance
        } else if (percentage >= 95.0) {
            return 1500.0; // Very good attendance
        } else if (percentage >= 90.0) {
            return 1000.0; // Good attendance
        } else if (percentage >= 85.0) {
            return 500.0; // Average attendance
        } else {
            return 0.0; // Below average
        }
    }

    /**
     * Calculate late arrival deduction
     * @param summary AttendanceSummary
     * @return Deduction amount
     */
    public Double calculateLateDeduction(AttendanceSummary summary) {
        if (summary == null || summary.getLateArrivals() == null) {
            return 0.0;
        }
        
        // Deduct ₹100 per late arrival
        return summary.getLateArrivals() * 100.0;
    }

    /**
     * Calculate overtime pay
     * @param summary AttendanceSummary
     * @param hourlyRate Hourly rate
     * @return Overtime pay amount
     */
    public Double calculateOvertimePay(AttendanceSummary summary, Double hourlyRate) {
        if (summary == null || summary.getOvertimeMinutes() == null || hourlyRate == null) {
            return 0.0;
        }
        
        // Overtime rate is 1.5x normal rate
        double overtimeHours = summary.getOvertimeMinutes() / 60.0;
        return overtimeHours * hourlyRate * 1.5;
    }
}
