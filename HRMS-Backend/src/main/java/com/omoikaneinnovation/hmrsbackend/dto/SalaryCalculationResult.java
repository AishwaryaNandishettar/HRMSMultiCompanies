package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryCalculationResult {
    private String employeeId;
    private String empName;
    private String department;
    private String month;
    
    // Earnings
    private Double basic;
    private Double hra;
    private Double allowance;
    private Double bonus;
    private Double incentive;
    private Double conveyance;
    private Double attendanceBonus;
    private Double performanceBonus;
    private Double overtimePay;
    
    // Deductions
    private Double pf;
    private Double esi;
    private Double tax;
    private Double professionalTax;
    private Double deduction;
    private Double lopDeduction;
    private Double lateDeduction;
    private Double otherDeduction;
    
    // Totals
    private Double grossSalary;
    private Double totalDeductions;
    private Double netSalary;
    
    // Attendance Data
    private Integer totalWorkingDays;
    private Integer presentDays;
    private Integer absentDays;
    private Integer leaveDays;
    private Integer lopDays;
    private Double attendancePercentage;
    
    // Performance Data
    private Double performanceRating;
    
    // Calculation Metadata
    private String calculationMode; // AUTO / MANUAL
    private Long calculatedAt;
    private Map<String, Object> breakdown; // Detailed breakdown
    // ===== MANUAL GETTERS/SETTERS =====

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getMonth() {
        return month;
    }
    public void setMonth(String month) {
        this.month = month;
    }

    public Double getBasic() {
        return basic;
    }

    public Double getHra() {
        return hra;
    }

    public Double getAllowance() {
        return allowance;
    }
public Double getBonus() {
        return bonus;
    }

    public Double getAttendanceBonus() {
        return attendanceBonus;
    }

    public Double getPerformanceBonus() {
        return performanceBonus;
    }

    public Double getIncentive() {
        return incentive;
    }

    public Double getPf() {
        return pf;
    }
    public Double getEsi() {
        return esi;
    }

    public Double getTax() {
        return tax;
    }

    public Double getDeduction() {
        return deduction;
    }

    public Double getLateDeduction() {
        return lateDeduction;
    }

    public Double getOtherDeduction() {
        return otherDeduction;
    }
     public Double getGrossSalary() {
        return grossSalary;
    }

    public Double getNetSalary() {
        return netSalary;
    }

    public Integer getTotalWorkingDays() {
        return totalWorkingDays;
    }

    public Integer getPresentDays() {
        return presentDays;
    }
    public Integer getLopDays() {
        return lopDays;
    }
}
