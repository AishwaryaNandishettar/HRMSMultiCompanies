package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.dto.*;
import com.omoikaneinnovation.hmrsbackend.model.Payroll;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.PayrollRepository;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SalaryCalculationService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceIntegrationService attendanceService;

    @Autowired
    private LeaveIntegrationService leaveService;

    @Autowired
    private PerformanceIntegrationService performanceService;

    /**
     * Calculate salary for a single employee with real-time data
     * @param request SalaryCalculationRequest
     * @return SalaryCalculationResult
     */
    public SalaryCalculationResult calculateSalary(SalaryCalculationRequest request) {
        String employeeId = request.getEmployeeId();
        String month = request.getMonth();

        // Get existing payroll record (for base salary components)
        Optional<Payroll> payrollOpt = payrollRepository.findByEmployeeId(employeeId);
        Payroll existingPayroll = payrollOpt.orElse(new Payroll());

        // Get employee details
        User user = userRepository.findByEmployeeId(employeeId);

        // Initialize base salary components:
        // Use values from request (admin-entered in Update Payroll table) if provided,
        // otherwise fall back to the existing DB payroll record.
        Double basic      = request.getBasic()      != null && request.getBasic()      > 0 ? request.getBasic()      : (existingPayroll.getBasic()      != null ? existingPayroll.getBasic()      : 0.0);
        Double hra        = request.getHra()         != null && request.getHra()        > 0 ? request.getHra()        : (existingPayroll.getHra()         != null ? existingPayroll.getHra()         : 0.0);
        Double allowance  = request.getAllowance()   != null && request.getAllowance()  > 0 ? request.getAllowance()  : (existingPayroll.getAllowance()    != null ? existingPayroll.getAllowance()    : 0.0);
        Double bonus      = request.getBonus()       != null && request.getBonus()      > 0 ? request.getBonus()      : (existingPayroll.getBonus()       != null ? existingPayroll.getBonus()       : 0.0);
        Double incentive  = request.getIncentive()   != null && request.getIncentive() > 0 ? request.getIncentive()  : (existingPayroll.getIncentive()    != null ? existingPayroll.getIncentive()    : 0.0);
        Double conveyance = request.getConveyance()  != null && request.getConveyance()> 0 ? request.getConveyance() : (existingPayroll.getConveyance()   != null ? existingPayroll.getConveyance()   : 0.0);
        Double variableSalary = request.getVariableSalary() != null && request.getVariableSalary() > 0 ? request.getVariableSalary() : (existingPayroll.getVariableSalary() != null ? existingPayroll.getVariableSalary() : 0.0);

        // Initialize deductions — request overrides DB values when provided
        Double pf              = request.getPf()             != null && request.getPf()             > 0 ? request.getPf()             : (existingPayroll.getPf()             != null ? existingPayroll.getPf()             : 0.0);
        Double esi             = request.getEsi()            != null && request.getEsi()            > 0 ? request.getEsi()            : (existingPayroll.getEsi()            != null ? existingPayroll.getEsi()            : 0.0);
        Double tax             = request.getTax()            != null && request.getTax()            > 0 ? request.getTax()            : (existingPayroll.getTax()            != null ? existingPayroll.getTax()            : 0.0);
        Double professionalTax = request.getProfessionalTax()!= null && request.getProfessionalTax()> 0 ? request.getProfessionalTax(): 0.0;
        Double deduction       = request.getDeduction()      != null && request.getDeduction()      > 0 ? request.getDeduction()      : (existingPayroll.getDeduction()      != null ? existingPayroll.getDeduction()      : 0.0);
        Double otherDeduction  = request.getOtherDeduction() != null && request.getOtherDeduction() > 0 ? request.getOtherDeduction() : 0.0;

        // Real-time calculated components
        Double attendanceBonus = 0.0;
        Double performanceBonus = 0.0;
        Double overtimePay = 0.0;
        Double lopDeduction = 0.0;
        Double lateDeduction = 0.0;

        // Attendance data — use request values when provided (from Update Payroll table)
        AttendanceSummary attendanceSummary = null;
        Integer totalWorkingDays = request.getWorkingDays() != null && request.getWorkingDays() > 0 ? request.getWorkingDays() : 30;
        Integer presentDays = request.getPaidDays()     != null && request.getPaidDays()     > 0 ? request.getPaidDays()     : 30;
        Integer absentDays  = 0;
        Integer leaveDays   = 0;
        Integer lopDays     = request.getLopDays()      != null && request.getLopDays()      > 0 ? request.getLopDays()      : 0;
        Double attendancePercentage = totalWorkingDays > 0 ? (presentDays * 100.0) / totalWorkingDays : 100.0;

        // Performance data
        Double performanceRating = 3.0;

        // Calculate attendance-based components
        if (Boolean.TRUE.equals(request.getIncludeAttendance())) {
            attendanceSummary = attendanceService.getMonthlyAttendance(employeeId, month);
            
            if (attendanceSummary != null) {
                totalWorkingDays = attendanceSummary.getTotalWorkingDays();
                presentDays = attendanceSummary.getPresentDays();
                absentDays = attendanceSummary.getAbsentDays();
                attendancePercentage = attendanceSummary.getAttendancePercentage();
                
                // Calculate attendance bonus
                attendanceBonus = attendanceService.calculateAttendanceBonus(attendanceSummary);
                
                // Calculate late deduction
                lateDeduction = attendanceService.calculateLateDeduction(attendanceSummary);
                
                // Calculate overtime pay
                Double hourlyRate = basic / (totalWorkingDays * 8.0); // Assuming 8 hours per day
                overtimePay = attendanceService.calculateOvertimePay(attendanceSummary, hourlyRate);
            }
        }

        // Calculate leave-based deductions
        if (Boolean.TRUE.equals(request.getIncludeLeave())) {
            LeaveSummary leaveSummary = leaveService.getMonthlyLeaves(employeeId, month);
            
            if (leaveSummary != null) {
                leaveDays = leaveSummary.getTotalLeaveDays();
                lopDays = leaveSummary.getLopDays();
                
                // Calculate LOP deduction
                Double dailySalary = basic / totalWorkingDays;
                lopDeduction = leaveService.calculateLOPDeduction(leaveSummary, dailySalary);
            }
        }

        // Calculate performance bonus
        if (Boolean.TRUE.equals(request.getIncludePerformance())) {
            performanceRating = performanceService.getPerformanceRating(employeeId);
            performanceBonus = performanceService.calculatePerformanceBonus(performanceRating, basic);
        }

        // Calculate totals — variableSalary included in gross
        Double grossSalary = basic + hra + allowance + bonus + incentive + conveyance + variableSalary
                           + attendanceBonus + performanceBonus + overtimePay;

        Double totalDeductions = pf + esi + tax + professionalTax + deduction 
                               + lopDeduction + lateDeduction + otherDeduction;

        Double netSalary = grossSalary - totalDeductions;

        // Create breakdown map
        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("earnings", Map.of(
            "basic", basic,
            "hra", hra,
            "allowance", allowance,
            "bonus", bonus,
            "incentive", incentive,
            "conveyance", conveyance,
            "attendanceBonus", attendanceBonus,
            "performanceBonus", performanceBonus,
            "overtimePay", overtimePay
        ));
        breakdown.put("deductions", Map.of(
            "pf", pf,
            "esi", esi,
            "tax", tax,
            "professionalTax", professionalTax,
            "deduction", deduction,
            "lopDeduction", lopDeduction,
            "lateDeduction", lateDeduction,
            "otherDeduction", otherDeduction
        ));
        breakdown.put("attendance", attendanceSummary);

        // Build result
        return SalaryCalculationResult.builder()
            .employeeId(employeeId)
            .empName(user != null ? user.getName() : existingPayroll.getEmpCode())
            .department(user != null ? user.getDepartment() : existingPayroll.getDepartment())
            .month(month)
            // Earnings
            .basic(basic)
            .hra(hra)
            .allowance(allowance)
            .bonus(bonus)
            .incentive(incentive)
            .conveyance(conveyance)
            .attendanceBonus(attendanceBonus)
            .performanceBonus(performanceBonus)
            .overtimePay(overtimePay)
            // Deductions
            .pf(pf)
            .esi(esi)
            .tax(tax)
            .professionalTax(professionalTax)
            .deduction(deduction)
            .lopDeduction(lopDeduction)
            .lateDeduction(lateDeduction)
            .otherDeduction(otherDeduction)
            // Totals
            .grossSalary(grossSalary)
            .totalDeductions(totalDeductions)
            .netSalary(netSalary)
            // Attendance
            .totalWorkingDays(totalWorkingDays)
            .presentDays(presentDays)
            .absentDays(absentDays)
            .leaveDays(leaveDays)
            .lopDays(lopDays)
            .attendancePercentage(attendancePercentage)
            // Performance
            .performanceRating(performanceRating)
            // Metadata
            .calculationMode("AUTO")
            .calculatedAt(System.currentTimeMillis())
            .breakdown(breakdown)
            .build();
    }

    /**
     * Calculate salary for all employees
     * @param month Month in format "May-2026"
     * @return List of SalaryCalculationResult
     */
    public List<SalaryCalculationResult> calculateBulkSalary(String month) {
        List<Payroll> allPayroll = payrollRepository.findAll();
        List<SalaryCalculationResult> results = new ArrayList<>();

        for (Payroll payroll : allPayroll) {
            try {
                SalaryCalculationRequest request = SalaryCalculationRequest.builder()
                    .employeeId(payroll.getEmployeeId())
                    .month(month)
                    .includeAttendance(true)
                    .includeLeave(true)
                    .includePerformance(true)
                    .build();

                SalaryCalculationResult result = calculateSalary(request);
                results.add(result);
            } catch (Exception e) {
                System.err.println("Error calculating salary for employee " + 
                                 payroll.getEmployeeId() + ": " + e.getMessage());
            }
        }

        return results;
    }

    /**
     * Apply calculated salary to payroll record (update database)
     * @param result SalaryCalculationResult
     * @return Updated Payroll
     */
    public Payroll applySalaryCalculation(SalaryCalculationResult result) {
        // ✅ NEW: Search by employeeId AND month (prevents data conflicts)
        String month = result.getMonth();
        String employeeId = result.getEmployeeId();
        
        Payroll payroll = null;
        
        // Try to find by month first (most accurate)
        if (month != null && !month.isEmpty()) {
            payroll = payrollRepository.findByEmployeeIdAndMonth(employeeId, month);
        }
        
        // Fallback: search by employeeId
        if (payroll == null) {
            Optional<Payroll> payrollOpt = payrollRepository.findByEmployeeId(employeeId);
            payroll = payrollOpt.orElse(new Payroll());
        }

        // Update with calculated values
        payroll.setEmployeeId(employeeId);
        payroll.setMonth(month);
        
        // Update earnings
        payroll.setBasic(result.getBasic());
        payroll.setHra(result.getHra());
        payroll.setAllowance(result.getAllowance());
        payroll.setBonus(result.getBonus() + result.getAttendanceBonus() + result.getPerformanceBonus());
        payroll.setIncentive(result.getIncentive());
        
        // Update deductions
        payroll.setPf(result.getPf());
        payroll.setEsi(result.getEsi());
        payroll.setTax(result.getTax());
        payroll.setDeduction(result.getDeduction() + result.getLateDeduction() + result.getOtherDeduction());
        
        // Update totals
        payroll.setGross(result.getGrossSalary());
        payroll.setNet(result.getNetSalary());
        
        // Update attendance data
        payroll.setWorkingDays(result.getTotalWorkingDays());
        payroll.setPaidDays(result.getPresentDays());
        payroll.setLopDays(result.getLopDays());
        
        // Update metadata
        payroll.setUpdatedAt(System.currentTimeMillis());
        
        System.out.println("✅ APPLIED SALARY CALCULATION: empId=" + employeeId + 
                         ", month=" + month +
                         ", gross=" + result.getGrossSalary() + 
                         ", net=" + result.getNetSalary());
        
        return payrollRepository.save(payroll);
    }
}
