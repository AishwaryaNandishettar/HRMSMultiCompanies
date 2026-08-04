    package com.omoikaneinnovation.hmrsbackend.service;

    import com.omoikaneinnovation.hmrsbackend.dto.AttendanceDTO;
    import com.omoikaneinnovation.hmrsbackend.model.Attendance;
    import com.omoikaneinnovation.hmrsbackend.model.Employee;
    import com.omoikaneinnovation.hmrsbackend.model.User;
    import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.client.RestTemplate;
    import org.springframework.stereotype.Service;
    import org.springframework.scheduling.annotation.Scheduled;
    import java.time.Duration;
    import java.time.LocalDate;
    import java.time.LocalTime;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;
    import java.util.Map;
    import java.util.HashMap;
    import java.util.ArrayList;

    @Service
    public class AttendanceService {

        @Autowired
        private AttendanceRepository attendanceRepo;

        @Autowired
        private UserRepository userRepo;

        @Autowired
        private EmployeeRepository employeeRepo;

       @Autowired
private RestTemplate restTemplate;

        public String checkIn(String userId) {
            return checkIn(userId, null);
        }

        public String checkIn(String userId, Map<String, String> payload) {
            String today = LocalDate.now().toString();
            String date = (payload != null && payload.get("date") != null) ? payload.get("date") : today;

            // Normalize userId: if it looks like an email, find the user and get their ID
            String normalizedUserId = userId;
            User currentUser = null;
            if (userId != null && userId.contains("@")) {
                Optional<User> userOpt = userRepo.findByEmail(userId);
                if (userOpt.isPresent()) {
                    currentUser = userOpt.get();
                    normalizedUserId = currentUser.getId();
                }
            } else {
                // If userId is not email, try to find user by ID
                Optional<User> userOpt = userRepo.findById(normalizedUserId);
                if (userOpt.isPresent()) {
                    currentUser = userOpt.get();
                }
            }

            Attendance existing = attendanceRepo.findByUserIdAndDate(normalizedUserId, date);

            if (existing != null) {
                return "Already checked in for this date";
            }

            Attendance attendance = new Attendance();
            attendance.setUserId(normalizedUserId);
            attendance.setDate(date);
            attendance.setCheckIn(LocalTime.now().toString());

            // Set additional fields from payload
            if (payload != null) {
                attendance.setEmpId(payload.get("empId"));
                attendance.setName(payload.get("name"));
                attendance.setDepartment(payload.get("department"));
                attendance.setLocationIn(payload.get("locationIn"));
                attendance.setTos(payload.get("tos"));
                attendance.setAttendanceType(payload.get("attendanceType") != null ? payload.get("attendanceType") : "Office");
                attendance.setStatus(payload.get("status") != null ? payload.get("status") : "Pending Approval");
                
                // Calculate late status
                String checkInTime = attendance.getCheckIn();
                if (checkInTime != null) {
                    int hour = Integer.parseInt(checkInTime.split(":")[0]);
                    attendance.setLate(hour > 9 ? "Yes" : "No");
                }
            }
            
            // ✅ FIX: Always fetch and set current manager information from User table
            if (currentUser != null) {
                // Use current manager info from User table (this ensures updated managers are reflected)
                if (currentUser.getManagerEmail() != null) {
                    attendance.setManagerEmail(currentUser.getManagerEmail());
                }
                if (currentUser.getManagerName() != null) {
                    attendance.setReportingManager(currentUser.getManagerName());
                }
                if (currentUser.getManagerId() != null) {
                    attendance.setManagerId(currentUser.getManagerId());
                }
                
                System.out.println("✅ Check-in: Set manager info from User table - " +
                    "Manager: " + currentUser.getManagerName() + 
                    " (" + currentUser.getManagerEmail() + ") for user: " + currentUser.getEmail());
            } else {
                // Fallback: use payload manager info if User not found
                attendance.setReportingManager(payload != null ? payload.get("reportingManager") : null);
                attendance.setManagerId(payload != null ? payload.get("managerId") : null);
                attendance.setManagerEmail(payload != null ? payload.get("managerEmail") : null);
                System.out.println("⚠️ Check-in: User not found, using payload manager info (may be outdated)");
            }

            attendanceRepo.save(attendance);
            return "Check-in successful";
        }

        public String checkOut(String userId, String date) {
            return checkOut(userId, date, null);
        }

        public String checkOut(String userId, String date, Map<String, String> payload) {

            // Normalize userId: if it looks like an email, find the user and get their ID
            String normalizedUserId = userId;
            if (userId != null && userId.contains("@")) {
                Optional<User> userOpt = userRepo.findByEmail(userId);
                if (userOpt.isPresent()) {
                    normalizedUserId = userOpt.get().getId();
                }
            }

            // Use the passed date if provided, otherwise fall back to today
            String lookupDate = (date != null && !date.isBlank()) ? date : LocalDate.now().toString();

            Attendance attendance =
                    attendanceRepo.findByUserIdAndDate(normalizedUserId, lookupDate);

            if (attendance == null) {
                return "Check-in not found";
            }

            String checkOutTime = LocalTime.now().toString();
            attendance.setCheckOut(checkOutTime);

            LocalTime in = LocalTime.parse(attendance.getCheckIn());
            LocalTime out = LocalTime.parse(checkOutTime);

            int minutes = (int) Duration.between(in, out).toMinutes();
            attendance.setWorkedMinutes(minutes);

            // Calculate early leave (before 18:00)
            int outHour = out.getHour();
            attendance.setEarlyLeave(outHour < 18 ? "Yes" : "No");
            attendance.setStatus("Pending Approval");

            // Update location out if provided
            if (payload != null && payload.get("locationOut") != null) {
                attendance.setLocationOut(payload.get("locationOut"));
            }

            attendanceRepo.save(attendance);

            return "Check-out successful";
        }

     public List<AttendanceDTO> getManagerAttendance(String managerEmail) {

    System.out.println("🔍 Manager Attendance Request - Manager Email: " + managerEmail);

    // Get all users under this manager FROM THE USER TABLE (current assignments)
    List<User> team = userRepo.findByManagerEmail(managerEmail);
    
    System.out.println("👥 Found " + team.size() + " team members under manager: " + managerEmail);
    team.forEach(u -> System.out.println("   - " + u.getName() + " (" + u.getEmail() + ") ID: " + u.getId()));

    List<String> userIds = new ArrayList<>();
    team.forEach(u -> userIds.add(u.getId()));

    // Also include the manager's own records
    Optional<User> managerOpt = userRepo.findByEmail(managerEmail);
    if (managerOpt.isPresent()) {
        User manager = managerOpt.get();
        String managerId = manager.getId();
        if (!userIds.contains(managerId)) {
            userIds.add(managerId);
            System.out.println("✅ Added manager's own ID: " + managerId);
        }
    }

    // If no userIds found, return empty list
    if (userIds.isEmpty()) {
        System.out.println("⚠️ No user IDs found for manager: " + managerEmail);
        return new ArrayList<>();
    }

    // Fetch ALL attendance records for these users (regardless of what managerEmail is stored in attendance)
    List<Attendance> records = attendanceRepo.findByUserIdIn(userIds);
    
    System.out.println("📋 Found " + records.size() + " attendance records for team members");

    // Enrich each record with CURRENT employee details from User table
    return records.stream()
            .map(att -> {
                AttendanceDTO dto = enrichAttendance(att);
                
                // ✅ CRITICAL FIX: Override manager info with CURRENT manager from User table
                Optional<User> userOpt = userRepo.findById(att.getUserId());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    
                    // Update manager information to reflect CURRENT assignment
                    dto.setManagerEmail(user.getManagerEmail() != null ? user.getManagerEmail() : "-");
                    dto.setManagerId(user.getManagerId() != null ? user.getManagerId() : "-");
                    dto.setReportingManager(user.getManagerName() != null ? user.getManagerName() : 
                        (user.getManagerEmail() != null ? user.getManagerEmail() : "-"));
                    
                    System.out.println("   ✓ Updated record for " + user.getName() + " - Manager: " + dto.getReportingManager());
                }
                
                // If this is the manager's own record, ensure it has the manager's details
                if (managerOpt.isPresent() && att.getUserId().equals(managerOpt.get().getId())) {
                    User manager = managerOpt.get();
                    // Always use manager's details for their own record
                    dto.setName(manager.getName() != null ? manager.getName() : manager.getEmail());
                    dto.setEmpId(manager.getEmployeeId() != null ? manager.getEmployeeId() : "MGR-" + manager.getId().substring(0, 6));
                    dto.setDepartment(manager.getDepartment() != null ? manager.getDepartment() : "Management");
                    dto.setReportingManager("-"); // Manager has no reporting manager
                    
                    System.out.println("   👤 Manager's own record: " + dto.getName());
                }
                
                return dto;
            })
            .collect(Collectors.toList());
}
        public List<AttendanceDTO> getMyAttendance(String userId) {

    if (userId == null || userId.isBlank()) {
        return List.of();
    }

    List<Attendance> records = attendanceRepo.findByUserId(userId);

    return records.stream()
            .map(this::enrichAttendance)
            .collect(Collectors.toList());
}

public List<Attendance> getByUserId(String userId) {
    return attendanceRepo.findByUserId(userId);
}

public Attendance getByUserIdAndDate(String userId, String date) {
    return attendanceRepo.findByUserIdAndDate(userId, date);
}

        public List<AttendanceDTO> getAllAttendance() {
            List<Attendance> records = attendanceRepo.findAll();
            return records.stream().map(r -> enrichAttendance(r)).collect(Collectors.toList());
        }

        /**
         * Enrich an Attendance record with user info (empId, name, dept, reportingManager)
         * Resolution order for empId:
         *   1. user.employeeId (set on User document)
         *   2. employee.employeeId (from Employee collection, linked by userId)
         *   3. employee.employeeId (from Employee collection, linked by email)
         *   4. raw userId as last resort
         */
       private AttendanceDTO enrichAttendance(Attendance a) {
    AttendanceDTO dto = new AttendanceDTO();
    dto.setId(a.getId());
    dto.setUserId(a.getUserId());
    dto.setDate(a.getDate());
    dto.setCheckIn(a.getCheckIn());
    dto.setCheckOut(a.getCheckOut());
    dto.setWorkedMinutes(a.getWorkedMinutes());
    
    // Use stored fields if available, otherwise enrich from User/Employee
    dto.setEmpId(a.getEmpId());
    dto.setName(a.getName());
    dto.setDepartment(a.getDepartment());
    dto.setReportingManager(a.getReportingManager());
    dto.setManagerId(a.getManagerId());
    dto.setManagerEmail(a.getManagerEmail());
    dto.setLocationIn(a.getLocationIn());
    dto.setLocationOut(a.getLocationOut());
    dto.setStatus(a.getStatus());
    dto.setAttendanceType(a.getAttendanceType());
    dto.setLate(a.getLate());
    dto.setEarlyLeave(a.getEarlyLeave());
    dto.setTos(a.getTos());

    // Enrich missing fields from User/Employee if needed
    if ((dto.getEmpId() == null || dto.getName() == null) && a.getUserId() != null) {
        Optional<User> userOpt = Optional.empty();

        if (a.getUserId() != null && !a.getUserId().isBlank()) {
            userOpt = userRepo.findById(a.getUserId());

            if (userOpt.isEmpty()) {
                userOpt = userRepo.findByEmail(a.getUserId());
            }

            if (userOpt.isEmpty()) {
                userOpt = userRepo.findAll().stream()
                        .filter(u -> a.getUserId().equals(u.getEmployeeId()))
                        .findFirst();
            }
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (dto.getManagerId() == null || dto.getManagerId().isEmpty()) {
                dto.setManagerId(user.getManagerEmail() != null ? user.getManagerEmail() : "-");
            }

            if (dto.getManagerEmail() == null || dto.getManagerEmail().isEmpty()) {
                dto.setManagerEmail(user.getManagerEmail() != null ? user.getManagerEmail() : "-");
            }

            // Resolve display name
            if (dto.getName() == null || dto.getName().isEmpty()) {
                String resolvedName = user.getName();
                if (resolvedName == null || resolvedName.isBlank()) {
                    resolvedName = user.getEmail() != null
                        ? user.getEmail().split("@")[0]
                        : "-";
                }
                if (resolvedName == null || resolvedName.isBlank() || resolvedName.equals(user.getEmail())) {
                    resolvedName = user.getEmail() != null
                        ? user.getEmail().split("@")[0]
                        : "-";
                    if (!resolvedName.isEmpty() && !resolvedName.equals("-")) {
                        resolvedName = Character.toUpperCase(resolvedName.charAt(0)) + resolvedName.substring(1);
                    }
                }
                dto.setName(resolvedName);
            }

            if (dto.getDepartment() == null || dto.getDepartment().isEmpty()) {
                dto.setDepartment(user.getDepartment() != null ? user.getDepartment() : "-");
            }

            // Resolve reporting manager
            if (dto.getReportingManager() == null || dto.getReportingManager().isEmpty()) {
                String reportingManager = user.getManagerName();
                if ((reportingManager == null || reportingManager.isBlank()) && user.getManagerId() != null && !user.getManagerId().isBlank()) {
                    Optional<User> managerOpt = userRepo.findById(user.getManagerId());
                    if (managerOpt.isEmpty()) {
                        managerOpt = userRepo.findByEmail(user.getManagerId());
                    }
                    if (managerOpt.isPresent() && managerOpt.get().getName() != null) {
                        reportingManager = managerOpt.get().getName();
                    }
                }
                if (reportingManager == null || reportingManager.isBlank()) {
                    reportingManager = user.getManagerEmail() != null ? user.getManagerEmail() : "-";
                }
                dto.setReportingManager(reportingManager);
            }

            // Resolve empId
            if (dto.getEmpId() == null || dto.getEmpId().isEmpty()) {
                String resolvedEmpId = user.getEmployeeId();

                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    resolvedEmpId = user.getEmployeeId() != null
                        ? user.getEmployeeId()
                        : user.getId();
                }

                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    Optional<Employee> empByUserId = employeeRepo.findByUserId(a.getUserId());
                    if (empByUserId.isPresent()) {
                        resolvedEmpId = empByUserId.get().getEmployeeId();
                    }
                }

                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    Optional<Employee> empByEmail = employeeRepo.findByEmail(user.getEmail());
                    if (empByEmail.isPresent()) {
                        resolvedEmpId = empByEmail.get().getEmployeeId();
                    }
                }

                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    String rawId = user.getId() != null ? user.getId() : "";
                    resolvedEmpId = "EMP" + rawId.replaceAll("[^a-zA-Z0-9]", "").toUpperCase()
                        .substring(Math.max(0, rawId.length() - 6));
                }
                dto.setEmpId(resolvedEmpId);
            }
        } else {
            if (dto.getEmpId() == null || dto.getEmpId().isEmpty()) {
                dto.setEmpId(a.getUserId());
            }
            if (dto.getName() == null || dto.getName().isEmpty()) {
                dto.setName("-");
            }
            if (dto.getDepartment() == null || dto.getDepartment().isEmpty()) {
                dto.setDepartment("-");
            }
            if (dto.getReportingManager() == null || dto.getReportingManager().isEmpty()) {
                dto.setReportingManager("-");
            }
            if (dto.getManagerId() == null || dto.getManagerId().isEmpty()) {
                dto.setManagerId("-");
            }
        }
    }

    // Set defaults for null fields
    if (dto.getEmpId() == null) dto.setEmpId("-");
    if (dto.getName() == null) dto.setName("-");
    if (dto.getDepartment() == null) dto.setDepartment("-");
    if (dto.getReportingManager() == null) dto.setReportingManager("-");
    if (dto.getManagerId() == null) dto.setManagerId("-");
    if (dto.getManagerEmail() == null) dto.setManagerEmail("-");
    if (dto.getLocationIn() == null) dto.setLocationIn("-");
    if (dto.getLocationOut() == null) dto.setLocationOut("-");
    if (dto.getStatus() == null) dto.setStatus("Pending Approval");
    if (dto.getAttendanceType() == null) dto.setAttendanceType("Office");
    if (dto.getLate() == null) dto.setLate("No");
    if (dto.getEarlyLeave() == null) dto.setEarlyLeave("-");
    if (dto.getTos() == null) dto.setTos("-");

    return dto;
}

@Scheduled(cron = "0 59 23 * * *")
public void checkMissedCheckouts() {

    String today = LocalDate.now().toString();

    List<Attendance> records = attendanceRepo.findAll();

    for (Attendance a : records) {

        // only today records
        if (!today.equals(a.getDate())) continue;

        // already checked-in but NOT checked-out
       if (a.getCheckIn() != null && a.getCheckOut() == null) {

    Map<String, Object> notification = new HashMap<>();

    notification.put("message", "User " + a.getUserId() + " missed checkout today");
    notification.put("type", "warning");
    notification.put("userId", a.getUserId());
    notification.put("date", today);

    try {
    restTemplate.postForObject(
        "http://localhost:8082/api/notifications",
        notification,
        String.class
    );
} catch (Exception e) {
    System.out.println("Notification service not available");
}
}
    }
}
    }
