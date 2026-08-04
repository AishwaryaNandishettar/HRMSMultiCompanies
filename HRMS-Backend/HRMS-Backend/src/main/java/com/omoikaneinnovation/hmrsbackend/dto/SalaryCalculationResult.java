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

    // ✅ Missing getters — required for JSON serialization
    public String getEmpName() { return empName; }
    public String getDepartment() { return department; }
    public Double getConveyance() { return conveyance; }
    public Double getOvertimePay() { return overtimePay; }
    public Double getProfessionalTax() { return professionalTax; }
    public Double getLopDeduction() { return lopDeduction; }
    public Double getTotalDeductions() { return totalDeductions; }
    public Integer getAbsentDays() { return absentDays; }
    public Integer getLeaveDays() { return leaveDays; }
    public Double getAttendancePercentage() { return attendancePercentage; }
    public Double getPerformanceRating() { return performanceRating; }
    public String getCalculationMode() { return calculationMode; }
    public Long getCalculatedAt() { return calculatedAt; }
    public Map<String, Object> getBreakdown() { return breakdown; }

    // ✅ Missing setters — required for builder and deserialization
    public void setEmpName(String empName) { this.empName = empName; }
    public void setDepartment(String department) { this.department = department; }
    public void setBasic(Double basic) { this.basic = basic; }
    public void setHra(Double hra) { this.hra = hra; }
    public void setAllowance(Double allowance) { this.allowance = allowance; }
    public void setBonus(Double bonus) { this.bonus = bonus; }
    public void setIncentive(Double incentive) { this.incentive = incentive; }
    public void setConveyance(Double conveyance) { this.conveyance = conveyance; }
    public void setAttendanceBonus(Double attendanceBonus) { this.attendanceBonus = attendanceBonus; }
    public void setPerformanceBonus(Double performanceBonus) { this.performanceBonus = performanceBonus; }
    public void setOvertimePay(Double overtimePay) { this.overtimePay = overtimePay; }
    public void setPf(Double pf) { this.pf = pf; }
    public void setEsi(Double esi) { this.esi = esi; }
    public void setTax(Double tax) { this.tax = tax; }
    public void setProfessionalTax(Double professionalTax) { this.professionalTax = professionalTax; }
    public void setDeduction(Double deduction) { this.deduction = deduction; }
    public void setLopDeduction(Double lopDeduction) { this.lopDeduction = lopDeduction; }
    public void setLateDeduction(Double lateDeduction) { this.lateDeduction = lateDeduction; }
    public void setOtherDeduction(Double otherDeduction) { this.otherDeduction = otherDeduction; }
    public void setGrossSalary(Double grossSalary) { this.grossSalary = grossSalary; }
    public void setTotalDeductions(Double totalDeductions) { this.totalDeductions = totalDeductions; }
    public void setNetSalary(Double netSalary) { this.netSalary = netSalary; }
    public void setTotalWorkingDays(Integer totalWorkingDays) { this.totalWorkingDays = totalWorkingDays; }
    public void setPresentDays(Integer presentDays) { this.presentDays = presentDays; }
    public void setAbsentDays(Integer absentDays) { this.absentDays = absentDays; }
    public void setLeaveDays(Integer leaveDays) { this.leaveDays = leaveDays; }
    public void setLopDays(Integer lopDays) { this.lopDays = lopDays; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    public void setPerformanceRating(Double performanceRating) { this.performanceRating = performanceRating; }
    public void setCalculationMode(String calculationMode) { this.calculationMode = calculationMode; }
    public void setCalculatedAt(Long calculatedAt) { this.calculatedAt = calculatedAt; }
    public void setBreakdown(Map<String, Object> breakdown) { this.breakdown = breakdown; }
}
