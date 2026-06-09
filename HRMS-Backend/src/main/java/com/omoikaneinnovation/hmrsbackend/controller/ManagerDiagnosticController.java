package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.model.Employee;
import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;

@RestController
@RequestMapping("/api/diagnostic")
@CrossOrigin(origins = "*")
public class ManagerDiagnosticController {

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private EmployeeRepository employeeRepo;
    
    @Autowired
    private AttendanceRepository attendanceRepo;

    @GetMapping("/user-managers")
    public List<Map<String, Object>> getUserManagers() {
        List<User> users = userRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole());
            userInfo.put("managerEmail", user.getManagerEmail());
            userInfo.put("managerName", user.getManagerName());
            userInfo.put("managerId", user.getManagerId());
            result.add(userInfo);
        }
        
        return result;
    }

    @GetMapping("/employee-managers")
    public List<Map<String, Object>> getEmployeeManagers() {
        List<Employee> employees = employeeRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Employee emp : employees) {
            Map<String, Object> empInfo = new HashMap<>();
            empInfo.put("id", emp.getId());
            empInfo.put("fullName", emp.getFullName());
            empInfo.put("email", emp.getEmail());
            empInfo.put("managerEmail", emp.getManagerEmail());
            empInfo.put("manager", emp.getManager());
            result.add(empInfo);
        }
        
        return result;
    }

    @GetMapping("/team-members")
    public List<Map<String, Object>> getTeamMembers(@RequestParam String managerEmail) {
        List<User> team = userRepo.findByManagerEmail(managerEmail);
        List<Map<String, Object>> result = new ArrayList<>();
        
        System.out.println("🔍 Searching for team members under: " + managerEmail);
        System.out.println("📊 Found " + team.size() + " team members");
        
        for (User member : team) {
            Map<String, Object> memberInfo = new HashMap<>();
            memberInfo.put("id", member.getId());
            memberInfo.put("name", member.getName());
            memberInfo.put("email", member.getEmail());
            memberInfo.put("managerEmail", member.getManagerEmail());
            memberInfo.put("role", member.getRole());
            result.add(memberInfo);
            
            System.out.println("👤 Team member: " + member.getName() + " (" + member.getEmail() + ")");
        }
        
        return result;
    }

    @GetMapping("/recent-attendance")
    public List<Map<String, Object>> getRecentAttendance(@RequestParam(defaultValue = "7") int days) {
        List<Attendance> records = attendanceRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        // Filter for recent records
        java.time.LocalDate cutoffDate = java.time.LocalDate.now().minusDays(days);
        
        for (Attendance record : records) {
            if (record.getDate() != null) {
                try {
                    java.time.LocalDate recordDate = java.time.LocalDate.parse(record.getDate());
                    if (recordDate.isAfter(cutoffDate) || recordDate.isEqual(cutoffDate)) {
                        Map<String, Object> recordInfo = new HashMap<>();
                        recordInfo.put("userId", record.getUserId());
                        recordInfo.put("name", record.getName());
                        recordInfo.put("empId", record.getEmpId());
                        recordInfo.put("date", record.getDate());
                        recordInfo.put("checkIn", record.getCheckIn());
                        recordInfo.put("checkOut", record.getCheckOut());
                        recordInfo.put("managerEmail", record.getManagerEmail());
                        recordInfo.put("reportingManager", record.getReportingManager());
                        recordInfo.put("managerId", record.getManagerId());
                        result.add(recordInfo);
                    }
                } catch (Exception e) {
                    System.err.println("⚠️ Invalid date format for record: " + record.getDate());
                }
            }
        }
        
        // Sort by date (newest first)
        result.sort((a, b) -> {
            String dateA = (String) a.get("date");
            String dateB = (String) b.get("date");
            return dateB.compareTo(dateA);
        });
        
        return result;
    }

    @PostMapping("/sync-managers")
    public Map<String, String> syncManagers() {
        List<Employee> employees = employeeRepo.findAll();
        int synced = 0;
        int errors = 0;
        
        System.out.println("🔄 Starting manager sync for all employees...");
        
        for (Employee emp : employees) {
            try {
                if (emp.getEmail() != null) {
                    Optional<User> userOpt = userRepo.findByEmail(emp.getEmail());
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        boolean changed = false;
                        
                        // Sync manager email
                        if (!Objects.equals(user.getManagerEmail(), emp.getManagerEmail())) {
                            user.setManagerEmail(emp.getManagerEmail());
                            changed = true;
                        }
                        
                        // Sync manager name
                        if (!Objects.equals(user.getManagerName(), emp.getManager())) {
                            user.setManagerName(emp.getManager());
                            changed = true;
                        }
                        
                        if (changed) {
                            userRepo.save(user);
                            synced++;
                            System.out.println("✅ Synced: " + emp.getEmail() + 
                                " -> Manager: " + emp.getManagerEmail());
                        }
                    } else {
                        System.out.println("⚠️ User not found for email: " + emp.getEmail());
                        errors++;
                    }
                }
            } catch (Exception e) {
                System.err.println("❌ Error syncing " + emp.getEmail() + ": " + e.getMessage());
                errors++;
            }
        }
        
        String message = String.format("Synced %d records, %d errors", synced, errors);
        System.out.println("🎉 Sync complete: " + message);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("synced", String.valueOf(synced));
        response.put("errors", String.valueOf(errors));
        
        return response;
    }
}