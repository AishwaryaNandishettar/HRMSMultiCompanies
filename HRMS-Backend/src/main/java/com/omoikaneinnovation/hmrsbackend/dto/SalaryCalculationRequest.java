package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryCalculationRequest {
    private String employeeId;
    private String month; // Format: "May-2026"
    private Boolean includeAttendance;
    private Boolean includeLeave;
    private Boolean includePerformance;

    // ✅ Salary components sent from the Update Payroll table (override DB values)
    private Double basic;
    private Double hra;
    private Double allowance;
    private Double bonus;
    private Double incentive;
    private Double conveyance;
    private Double variableSalary;

    // ✅ Deduction components sent from the Update Payroll table (override DB values)
    private Double pf;
    private Double esi;
    private Double tax;
    private Double deduction;
    private Double professionalTax;
    private Double lopDeduction;
    private Double otherDeduction;

    // ✅ Attendance days from the Update Payroll table
    private Integer workingDays;
    private Integer paidDays;
    private Integer lopDays;
}
