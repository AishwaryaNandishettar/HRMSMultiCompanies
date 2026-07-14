package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.model.TimesheetSummary;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.omoikaneinnovation.hmrsbackend.repository.LeaveRepository;
import com.omoikaneinnovation.hmrsbackend.model.LeaveRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.model.Employee;
import java.util.*;

@Service
public class TimesheetService {   // ✅ FIXED NAME

    private final AttendanceRepository repo;
    private final LeaveRepository leaveRepo;
    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;

    public TimesheetService(AttendanceRepository repo, LeaveRepository leaveRepo, UserRepository userRepo,EmployeeRepository employeeRepo) {
        this.repo = repo;
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
          this.employeeRepo = employeeRepo;
    }

    public List<TimesheetSummary> getMonthlySummary(String month) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // auth.getName() returns the logged-in user's email (from JWT)
        String loggedEmail = auth != null ? auth.getName() : "";

        List<Attendance> data;
        List<String> userIds = new ArrayList<>();

        // Determine role from the database (more reliable than JWT authority strings)
        Optional<User> loggedUserOpt = userRepo.findByEmail(loggedEmail);
        String userRole = loggedUserOpt.map(u -> u.getRole() != null ? u.getRole().toUpperCase() : "EMPLOYEE")
                                       .orElse("EMPLOYEE");

        if ("EMPLOYEE".equals(userRole)) {
            // Employee: fetch by both their MongoDB _id AND their email
            // (attendance records may be stored with either)
            if (loggedUserOpt.isPresent()) {
                userIds.add(loggedUserOpt.get().getId());  // MongoDB _id
                userIds.add(loggedEmail);                   // email as userId fallback
            } else {
                userIds.add(loggedEmail);
            }
            data = repo.findByUserIdInAndDateStartingWith(userIds, month);
        } else if ("MANAGER".equals(userRole)) {
            // Manager: their own records + all team members' records
            if (loggedUserOpt.isPresent()) {
                User manager = loggedUserOpt.get();
                userIds.add(manager.getId());   // manager's MongoDB _id
                userIds.add(loggedEmail);        // manager's email as fallback

                // Add all team members under this manager
                List<User> team = userRepo.findByManagerEmail(loggedEmail);
                team.forEach(u -> {
                    userIds.add(u.getId());      // team member's MongoDB _id
                    userIds.add(u.getEmail());   // team member's email as fallback
                });
            } else {
                userIds.add(loggedEmail);
            }
            data = repo.findByUserIdInAndDateStartingWith(userIds, month);
        } else {
            // Admin / HR: all data
            data = repo.findByDateStartingWith(month);
        }

        List<LeaveRequest> leaveList = leaveRepo.findAll();

        Map<String, TimesheetSummary> map = new HashMap<>();

        for (Attendance r : data) {
            System.out.println(
    "Attendance userId = " + r.getUserId()
);

System.out.println(
    "Attendance empId = " + r.getEmpId()
);

           String key = r.getUserId() + "_" + month;

            map.putIfAbsent(key, new TimesheetSummary());
            TimesheetSummary obj = map.get(key);

            // Enrich with user info (empId, name, department, reportingManager)
            if (obj.getEmpId() == null) {
                String empId = null;
                String empName = null;
                String department = null;
                String reportingManager = null;
                
                // ✅ STRATEGY: Lookup Employee table first (source of truth for Profile page)
                Optional<Employee> empOpt = employeeRepo.findByUserId(r.getUserId());
                
                // Fallback: Try finding employee by email if userId lookup fails
                if (empOpt.isEmpty()) {
                    // First get user to find email
                    Optional<User> userOpt = userRepo.findById(r.getUserId());
                    if (userOpt.isEmpty()) {
                        userOpt = userRepo.findByEmail(r.getUserId());
                    }
                    
                    if (userOpt.isPresent()) {
                        String email = userOpt.get().getEmail();
                        empOpt = employeeRepo.findByEmail(email);
                    }
                }
                
                // ✅ If Employee record found, use it as primary source
                if (empOpt.isPresent()) {
                    Employee emp = empOpt.get();
                    empId = emp.getEmployeeId();
                    empName = emp.getFullName();
                    department = emp.getDepartment();
                    reportingManager = emp.getManager();
                    
                    if (reportingManager == null || reportingManager.isBlank()) {
                        reportingManager = emp.getManagerEmail();
                    }
                    
                    System.out.println("✅ EMPLOYEE TABLE LOOKUP SUCCESS");
                    System.out.println("Employee ID: " + empId);
                    System.out.println("Employee Name: " + empName);
                }
                
                // ✅ Fallback to User table if Employee table doesn't have complete data
                Optional<User> userOpt = userRepo.findById(r.getUserId());
                if (userOpt.isEmpty()) {
                    userOpt = userRepo.findByEmail(r.getUserId());
                }
                
                if (userOpt.isPresent()) {
                    User u = userOpt.get();
                    
                    // Fill in missing fields from User table
                    if (empId == null || empId.isBlank()) {
                        empId = u.getEmployeeId();
                    }
                    if (empName == null || empName.isBlank()) {
                        empName = u.getName();
                    }
                    if (department == null || department.isBlank()) {
                        department = u.getDepartment();
                    }
                    if (reportingManager == null || reportingManager.isBlank()) {
                        reportingManager = u.getManagerName();
                        if (reportingManager == null || reportingManager.isBlank()) {
                            reportingManager = u.getManagerEmail();
                        }
                    }
                    
                    // For manager's own record, set reporting manager to "-"
                    if ("MANAGER".equals(userRole) &&
                        u.getEmail() != null && u.getEmail().equalsIgnoreCase(loggedEmail)) {
                        reportingManager = "-";
                    }
                }
                
                // ✅ Final fallback to Attendance record
                if (empId == null || empId.isBlank()) {
                    empId = r.getEmpId();
                }
                if (empName == null || empName.isBlank()) {
                    empName = r.getName();
                }
                if (department == null || department.isBlank()) {
                    department = r.getDepartment();
                }
                if (reportingManager == null || reportingManager.isBlank()) {
                    reportingManager = r.getReportingManager();
                }
                
                // ✅ Set final values (with ultimate fallbacks)
                obj.setEmpId(empId != null && !empId.isBlank() ? empId : "-");
                obj.setEmpName(empName != null && !empName.isBlank() ? empName : "-");
                obj.setDepartment(department != null && !department.isBlank() ? department : "-");
                obj.setReportingManager(reportingManager != null && !reportingManager.isBlank() ? reportingManager : "-");
                
                System.out.println("=================================");
                System.out.println("Attendance UserId : " + r.getUserId());
                System.out.println("Attendance EmpId  : " + r.getEmpId());
                System.out.println("Final EmpId       : " + obj.getEmpId());
                System.out.println("Final Name        : " + obj.getEmpName());
                System.out.println("=================================");
            }

            obj.setMonth(month);

           boolean isLeave = leaveList.stream().anyMatch(l ->
        l.getUserId() != null &&
        r.getUserId() != null &&
        l.getUserId().equals(r.getUserId()) &&
        l.getStartDate() != null &&
        r.getDate() != null &&
        l.getStartDate().equals(r.getDate()) &&
        "APPROVED".equalsIgnoreCase(l.getStatus())
);

            if (isLeave) {
                obj.setLeave(obj.getLeave() + 1);
                continue;
            }

            int checkIn = toMin(r.getCheckIn());
            int checkOut = toMin(r.getCheckOut());
            int worked = checkOut - checkIn;

            if (worked <= 0) {
                // If checkIn exists but no checkOut yet, count as present (still working)
                if (r.getCheckIn() != null && !r.getCheckIn().isBlank() && r.getCheckIn().contains(":")) {
                    obj.setPresent(obj.getPresent() + 1);
                } else {
                    obj.setLop(obj.getLop() + 1);
                }
            } else {

                if (worked >= 360) obj.setPresent(obj.getPresent() + 1);
                else obj.setHalfDay(obj.getHalfDay() + 1);

                if (checkIn > 555) obj.setLate(obj.getLate() + 1);

                obj.setAvgHours(obj.getAvgHours() + worked);
            }
        }

        for (TimesheetSummary t : map.values()) {
            if (t.getPresent() + t.getHalfDay() > 0) {
                t.setAvgHours(t.getAvgHours() / 60.0);
            }
            t.setApproval("Pending");
        }

        return new ArrayList<>(map.values());
    }

  private int toMin(String t) {
    if (t == null || !t.contains(":")) return 0;
    String[] parts = t.split(":");
    return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
}

    public String approve(String empId, String month) {
        // you can store in DB later
        return "Approved for " + empId;
    }

    public Map<String, Object> submitTimesheet(Map<String, Object> req) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String userId = (String) req.get("userId");
            String month = (String) req.get("month");
            
            // Extract timesheet data
            int present = ((Number) req.getOrDefault("present", 0)).intValue();
            int leave = ((Number) req.getOrDefault("leave", 0)).intValue();
            int lop = ((Number) req.getOrDefault("lop", 0)).intValue();
            int halfDay = ((Number) req.getOrDefault("halfDay", 0)).intValue();
            int late = ((Number) req.getOrDefault("late", 0)).intValue();
            int wfh = ((Number) req.getOrDefault("wfh", 0)).intValue();
            int field = ((Number) req.getOrDefault("field", 0)).intValue();
            double avgHours = ((Number) req.getOrDefault("avgHours", 0.0)).doubleValue();
            
            // Create attendance records for each day worked
            // This saves the timesheet data to MongoDB
            for (int day = 1; day <= 31; day++) {
                String date = month + "-" + String.format("%02d", day);
                
                // Create attendance entry
                Attendance attendance = new Attendance();
                attendance.setUserId(userId);
                attendance.setDate(date);
                attendance.setCheckIn("09:00"); // Default check-in
                attendance.setCheckOut("17:00"); // Default check-out
                
                // Save to database
                repo.save(attendance);
            }
            
            response.put("success", true);
            response.put("message", "Timesheet submitted successfully for " + month);
            response.put("userId", userId);
            response.put("month", month);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error submitting timesheet: " + e.getMessage());
        }
        
        return response;
    }
}