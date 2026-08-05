package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.model.Employee;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.dto.ProfileResponse;
import com.omoikaneinnovation.hmrsbackend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("🔥 PROFILE CONTROLLER HIT");
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        String email = userDetails.getUsername();
        
        // Get User data
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Get Employee data (which has the correct name)
        Employee employee = employeeRepository.findByEmail(email).orElse(null);
        System.out.println("========== PROFILE DEBUG ==========");
System.out.println("Employee Found : " + (employee != null));

if (employee != null) {
    System.out.println("Employee Name        : " + employee.getFullName());
    System.out.println("Employee Manager     : " + employee.getManager());
    System.out.println("Employee ManagerEmail: " + employee.getManagerEmail());
}

System.out.println("==================================");
        
        // Create merged profile response
        Map<String, Object> profile = new HashMap<>();
        
        // Use Employee name if available, otherwise fall back to User name
        profile.put("name", employee != null ? employee.getFullName() : user.getName());
        profile.put("fullName", employee != null ? employee.getFullName() : user.getName());
        profile.put("empName", employee != null ? employee.getFullName() : user.getName());
        
        // User fields
        profile.put("email", user.getEmail());
        profile.put("employeeId", user.getEmployeeId());
        profile.put("department", user.getDepartment());
        profile.put("designation", user.getDesignation());
        profile.put("role", user.getRole());
        profile.put("phone", user.getPhone());
        profile.put("joiningDate", user.getJoiningDate());
        profile.put("totalExp", user.getTotalExp());
        profile.put("currentExp", user.getCurrentExp());
   String managerName = null;

// Read manager from Employee Directory
if (employee != null &&
    employee.getManager() != null &&
    !employee.getManager().trim().isEmpty()) {

    managerName = employee.getManager();

} else if (user.getManagerName() != null &&
           !user.getManagerName().trim().isEmpty()) {

    managerName = user.getManagerName();
}
// 👇 ADD HERE
System.out.println("Employee Manager = " +
        (employee != null ? employee.getManager() : "EMPLOYEE NULL"));

System.out.println("User Manager Name = " + user.getManagerName());

System.out.println("Final Manager Name = " + managerName);
System.out.println("Manager Name  : " +
        (employee != null ? employee.getManager() : "NULL"));

System.out.println("Manager Email : " +
        (employee != null ? employee.getManagerEmail() : "NULL"));
profile.put("managerName", managerName);
profile.put("reportingManager", managerName);
System.out.println("PROFILE RESPONSE = " + profile);
        profile.put("hrName", user.getHrName());
        profile.put("managerId", user.getManagerId());
        profile.put("companyId", user.getCompanyId());
        
        // Employee fields (if available)
        if (employee != null) {
            profile.put("dob", employee.getDob());
            // ✅ These fields don't exist in Employee model — use null safely
            profile.put("fatherName", null);
            profile.put("motherName", null);
            profile.put("bloodGroup", null);
            profile.put("permanentAddress", null);
            profile.put("currentAddress", null);
            profile.put("city", null);
            profile.put("taluk", null);
            profile.put("district", null);
            profile.put("state", null);
            profile.put("pincode", null);
            profile.put("bankAccountNumber", employee.getBankAccountNumber());
            profile.put("ifsc", employee.getIfsc());
            profile.put("uan", employee.getUan());
            profile.put("pfMemberId", employee.getPfMemberId());
            profile.put("pf", employee.getPf());
            profile.put("esic", employee.getEsic());
        }
        
        System.out.println("✅ Profile API - User: " + user.getName() + ", Employee: " + (employee != null ? employee.getFullName() : "null"));
        System.out.println("✅ Returning name: " + profile.get("name"));
        System.out.println("========== PROFILE DEBUG ==========");
System.out.println("Logged User Email : " + email);

if (employee != null) {
    System.out.println("Employee Found");
    System.out.println("Employee Manager      : " + employee.getManager());
    System.out.println("Employee ManagerEmail : " + employee.getManagerEmail());
} else {
    System.out.println("Employee NOT FOUND");
}

System.out.println("User ManagerName : " + user.getManagerName());
System.out.println("Final Manager    : " + managerName);
System.out.println("==================================");
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@RequestParam String empId) {
        return profileService.getMyProfile(empId);
    }

    @PutMapping("/update-job")
    public ResponseEntity<?> updateJobDetails(
            @RequestBody User updatedUser,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized - please log in again");
        }

        String email = userDetails.getUsername();

        User existing = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // update only non-null job fields
        if (updatedUser.getDesignation()    != null) existing.setDesignation(updatedUser.getDesignation());
        if (updatedUser.getDepartment()     != null) existing.setDepartment(updatedUser.getDepartment());
        if (updatedUser.getJoiningDate()    != null) existing.setJoiningDate(updatedUser.getJoiningDate());
        if (updatedUser.getTotalExp()       != null) existing.setTotalExp(updatedUser.getTotalExp());
        if (updatedUser.getCurrentExp()     != null) existing.setCurrentExp(updatedUser.getCurrentExp());
        if (updatedUser.getPf()             != null) existing.setPf(updatedUser.getPf());
        if (updatedUser.getUan()            != null) existing.setUan(updatedUser.getUan());
        if (updatedUser.getEsic()           != null) existing.setEsic(updatedUser.getEsic());
        if (updatedUser.getEmploymentType() != null) existing.setEmploymentType(updatedUser.getEmploymentType());
        if (updatedUser.getLocation()       != null) existing.setLocation(updatedUser.getLocation());
        if (updatedUser.getManagerName()    != null) existing.setManagerName(updatedUser.getManagerName());
        if (updatedUser.getHrName()         != null) existing.setHrName(updatedUser.getHrName());
        if (updatedUser.getManagerId()      != null) existing.setManagerId(updatedUser.getManagerId());

        User saved = userRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}