package com.omoikaneinnovation.hmrsbackend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
public class LoginResponse {
    public String id;         // ✅ MongoDB _id
    public String name;
    public String email;
    public String role;
    public String token;
    public String empId;     // ✅ Employee ID
    public String employeeId; // ✅ Employee ID (fallback)
    public String companyId;   // ✅ Company ID
    public String department;  // ✅ Department
    public String managerEmail; // ✅ Manager Email
}
