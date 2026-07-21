    package com.omoikaneinnovation.hmrsbackend.service;

    import com.omoikaneinnovation.hmrsbackend.dto.AttendanceDTO;
    import com.omoikaneinnovation.hmrsbackend.model.Attendance;
    import com.omoikaneinnovation.hmrsbackend.model.Employee;
    import com.omoikaneinnovation.hmrsbackend.model.LeaveRequest;
    import com.omoikaneinnovation.hmrsbackend.model.User;
    import com.omoikaneinnovation.hmrsbackend.repository.AttendanceRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.LeaveRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.client.RestTemplate;
    import org.springframework.stereotype.Service;
    import org.springframework.scheduling.annotation.Scheduled;
    import java.time.Duration;
    import java.time.LocalDate;
    import java.time.LocalTime;
    import java.time.ZoneId;
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

       @Autowired
       private NotificationService notificationService;

       @Autowired
       private LeaveRepository leaveRepo;
        public String checkIn(String userId) {
            return checkIn(userId, null);
        }

        public String checkIn(String userId, Map<String, String> payload) {
            String today = LocalDate.now(ZoneId.of("Asia/Kolkata")).toString();
            String date = (payload != null && payload.get("date") != null) ? payload.get("date") : today;

            System.out.println("🔍 CHECK-IN REQUEST:");
            System.out.println("   Original userId: " + userId);
            System.out.println("   Date: " + date);
            System.out.println("   Payload: " + payload);

            // Normalize userId: if it looks like an email, find the user and get their ID
            String normalizedUserId = userId;
            User currentUser = null;
            if (userId != null && userId.contains("@")) {
                Optional<User> userOpt = userRepo.findByEmail(userId);
                if (userOpt.isPresent()) {
                    currentUser = userOpt.get();
                    normalizedUserId = currentUser.getId();
                    System.out.println("   ✅ Resolved email to userId: " + normalizedUserId);
                }
            } else {
                // If userId is not email, try to find user by ID
                Optional<User> userOpt = userRepo.findById(normalizedUserId);
                if (userOpt.isPresent()) {
                    currentUser = userOpt.get();
                    System.out.println("   ✅ Found user by ID: " + normalizedUserId);
                }
            }

            // ✅ CHECK IF ALREADY CHECKED IN TODAY
            Attendance existing = attendanceRepo.findByUserIdAndDate(normalizedUserId, date);
            
            System.out.println("   🔍 Checking existing attendance...");
            System.out.println("   Normalized userId: " + normalizedUserId);
            System.out.println("   Date: " + date);
            System.out.println("   Existing record: " + (existing != null ? "FOUND" : "NOT FOUND"));

            if (existing != null) {
                System.out.println("   ❌ DUPLICATE CHECK-IN BLOCKED!");
                System.out.println("   Existing check-in: " + existing.getCheckIn());
                System.out.println("   Existing check-out: " + existing.getCheckOut());
                return "Already checked in for this date";
            }

            System.out.println("   ✅ No existing record, creating new attendance...");

            Attendance attendance = new Attendance();
            attendance.setUserId(normalizedUserId);
            attendance.setDate(date);
         attendance.setCheckIn(
    LocalTime.now(ZoneId.of("Asia/Kolkata")).toString()
);

            // ✅ ALWAYS FETCH EMPID FROM EMPLOYEE COLLECTION (MOST RELIABLE)
            String empId = null;
            String fullName = null;
            String department = null;
            
            if (currentUser != null) {
                // Try to get from Employee collection first
                Optional<Employee> empOpt = employeeRepo.findByEmail(currentUser.getEmail());
                if (empOpt.isEmpty()) {
                    empOpt = employeeRepo.findByUserId(currentUser.getId());
                }
                
                if (empOpt.isPresent()) {
                    Employee emp = empOpt.get();
                    empId = emp.getEmployeeId();
                    fullName = emp.getFullName();
                    department = emp.getDepartment();
                    System.out.println("   ✅ Got empId from Employee collection: " + empId);
                }
                
                // Fallback to User collection
                if (empId == null || empId.trim().isEmpty()) {
                    empId = currentUser.getEmployeeId();
                    System.out.println("   ℹ️  Fell back to User.employeeId: " + empId);
                }
                
                if (fullName == null || fullName.trim().isEmpty()) {
                    fullName = currentUser.getName();
                }
                
                if (department == null || department.trim().isEmpty()) {
                    department = currentUser.getDepartment();
                }
            }

            // Set additional fields from payload or fetched data
            if (payload != null) {
                // Use payload values if provided, otherwise use fetched values
                attendance.setEmpId(payload.get("empId") != null ? payload.get("empId") : empId);
                attendance.setName(payload.get("name") != null ? payload.get("name") : fullName);
                attendance.setDepartment(payload.get("department") != null ? payload.get("department") : department);
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
            } else {
                // If no payload, use fetched values
                attendance.setEmpId(empId);
                attendance.setName(fullName);
                attendance.setDepartment(department);
                attendance.setAttendanceType("Office");
                attendance.setStatus("Pending Approval");
            }
            
            System.out.println("   📋 Attendance data being saved:");
            System.out.println("      empId: " + attendance.getEmpId());
            System.out.println("      name: " + attendance.getName());
            System.out.println("      department: " + attendance.getDepartment());
            
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
            System.out.println("   ✅ Attendance saved successfully!");
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

            String checkOutTime =
    LocalTime.now(ZoneId.of("Asia/Kolkata")).toString();
            attendance.setCheckOut(checkOutTime);

            LocalTime in = LocalTime.parse(attendance.getCheckIn());
            LocalTime out = LocalTime.parse(checkOutTime);

            int minutes = (int) Duration.between(in, out).toMinutes();
            attendance.setWorkedMinutes(minutes);

            // Calculate early leave (before 18:00)
            int outHour = out.getHour();
            attendance.setEarlyLeave(outHour < 18 ? "Yes" : "No");

            // ── AUTO STATUS based on worked hours ──
            // >= 8 hours (480 min) → Present
            // >= 4 hours (240 min) → Half Day
            // < 4 hours            → Half Day (came but left very early)
            String autoStatus;
            if (minutes >= 480) {
                autoStatus = "Present";
            } else if (minutes >= 240) {
                autoStatus = "Half Day";
            } else {
                autoStatus = "Half Day";
            }
            attendance.setStatus(autoStatus);

            // Update location out if provided
            if (payload != null && payload.get("locationOut") != null) {
                attendance.setLocationOut(payload.get("locationOut"));
            }

            attendanceRepo.save(attendance);

            return "Check-out successful";
        }

     public List<AttendanceDTO> getManagerAttendance(String managerEmail) {

    System.out.println("🔍 getManagerAttendance called with managerEmail: " + managerEmail);
    
    // Get all users under this manager (try exact match first, then case-insensitive)
    List<User> team = userRepo.findByManagerEmail(managerEmail);
    if (team.isEmpty()) {
        System.out.println("🔄 No exact match found, trying case-insensitive search...");
        team = userRepo.findByManagerEmailIgnoreCase(managerEmail);
    }
    
    System.out.println("📋 Found " + team.size() + " team members for manager: " + managerEmail);
    
    for (User u : team) {
        System.out.println("  - Team member: " + u.getEmail() + " (ID: " + u.getId() + ", Name: " + u.getName() + ")");
    }

    List<String> userIds = new ArrayList<>();
    team.forEach(u -> userIds.add(u.getId()));

    // Also include the manager's own records (try exact match first, then case-insensitive)
    Optional<User> managerOptTemp = userRepo.findByEmail(managerEmail);
    if (managerOptTemp.isEmpty()) {
        System.out.println("🔄 Manager not found with exact email, trying case-insensitive...");
        managerOptTemp = userRepo.findByEmailIgnoreCase(managerEmail);
    }
    
    final Optional<User> managerOpt = managerOptTemp; // Make it final for lambda use
    
    if (managerOpt.isPresent()) {
        User manager = managerOpt.get();
        String managerId = manager.getId();
        System.out.println("📋 Manager found: " + manager.getEmail() + " (ID: " + managerId + ")");
        if (!userIds.contains(managerId)) {
            userIds.add(managerId);
        }
    } else {
        System.out.println("❌ Manager not found with email: " + managerEmail);
    }

    System.out.println("📋 Total userIds to fetch attendance for: " + userIds.size() + " -> " + userIds);

    // If no userIds found, return empty list
    if (userIds.isEmpty()) {
        System.out.println("❌ No userIds found - returning empty list");
        return new ArrayList<>();
    }

    List<Attendance> records = attendanceRepo.findByUserIdIn(userIds);
    System.out.println("📋 Found " + records.size() + " attendance records for these users");

    // Enrich each record with proper employee details
    return records.stream()
            .map(att -> {
                AttendanceDTO dto = enrichAttendance(att);
                
                // If this is the manager's own record, ensure it has the manager's details
                if (managerOpt.isPresent() && att.getUserId().equals(managerOpt.get().getId())) {
                    User manager = managerOpt.get();
                    // Always use manager's details for their own record
                    dto.setName(manager.getName() != null ? manager.getName() : manager.getEmail());
                    dto.setEmpId(manager.getEmployeeId() != null ? manager.getEmployeeId() : "MGR-" + manager.getId().substring(0, 6));
                    dto.setDepartment(manager.getDepartment() != null ? manager.getDepartment() : "Management");
                    dto.setReportingManager("-"); // Manager has no reporting manager
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

    /**
     * Get all attendance records with proper filtering
     */
    public List<AttendanceDTO> getAllAttendance() {
        List<Attendance> records = attendanceRepo.findAll();
        
        // ✅ Get current time in IST
        LocalTime currentTime = LocalTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDate currentDate = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        String today = currentDate.toString();
        
        // ✅ Define end of work hours (6:00 PM)
        LocalTime endOfWorkHours = LocalTime.of(18, 0);
        boolean isAfterWorkHours = currentTime.isAfter(endOfWorkHours);
        
        System.out.println("🕐 Current Time (IST): " + currentTime);
        System.out.println("🕐 End of Work Hours: " + endOfWorkHours);
        System.out.println("🕐 Is After Work Hours: " + isAfterWorkHours);
        
        return records.stream()
                .map(r -> enrichAttendance(r))
                .filter(dto -> {
                    // ✅ FILTER OUT EMPTY RECORDS AT BACKEND LEVEL
                    // Only return records with valid essential data
                    boolean hasValidEmpId = dto.getEmpId() != null && 
                                          !dto.getEmpId().equals("-") && 
                                          !dto.getEmpId().trim().isEmpty();
                    boolean hasValidName = dto.getName() != null && 
                                         !dto.getName().equals("-") && 
                                         !dto.getName().trim().isEmpty();
                    boolean hasValidDate = dto.getDate() != null && 
                                         !dto.getDate().equals("-") && 
                                         !dto.getDate().trim().isEmpty();
                    
                    // ✅ HIDE ABSENT STATUS DURING WORK HOURS (before 6 PM)
                    // Only show "Absent" after 6 PM for today's date
                    boolean isAbsentToday = "Absent".equals(dto.getStatus()) && today.equals(dto.getDate());
                    boolean shouldHideAbsent = isAbsentToday && !isAfterWorkHours;
                    
                    if (shouldHideAbsent) {
                        System.out.println("⏰ Hiding Absent status for " + dto.getName() + " (before 6 PM)");
                        return false; // Don't show this record yet
                    }
                    
                    return hasValidEmpId && hasValidName && hasValidDate;
                })
                .collect(Collectors.toList());
    }

        public String deleteAttendance(String id) {
            try {
                if (attendanceRepo.existsById(id)) {
                    attendanceRepo.deleteById(id);
                    return "Attendance record deleted successfully";
                } else {
                    return "Attendance record not found";
                }
            } catch (Exception e) {
                return "Failed to delete attendance record: " + e.getMessage();
            }
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
    if (a.getUserId() != null && !a.getUserId().isBlank()) {
        Optional<User> userOpt = Optional.empty();

        // Try to find user by different methods
        userOpt = userRepo.findById(a.getUserId());

        if (userOpt.isEmpty()) {
            userOpt = userRepo.findByEmail(a.getUserId());
        }

        if (userOpt.isEmpty()) {
            userOpt = userRepo.findAll().stream()
                    .filter(u -> a.getUserId().equals(u.getEmployeeId()))
                    .findFirst();
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Set manager details
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
                        : null;
                }
                // Only capitalize if we have a valid name
                if (resolvedName != null && !resolvedName.isEmpty() && !resolvedName.equals("-")) {
                    resolvedName = Character.toUpperCase(resolvedName.charAt(0)) + resolvedName.substring(1);
                    dto.setName(resolvedName);
                } else {
                    dto.setName(null); // Keep it null for filtering
                }
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

            // Resolve empId with better fallback logic
            if (dto.getEmpId() == null || dto.getEmpId().isEmpty()) {
                String resolvedEmpId = user.getEmployeeId();

                // If user.employeeId is null, try Employee collection
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

                // Generate fallback empId only if we have valid user data
                if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
                    String rawId = user.getId() != null ? user.getId() : "";
                    if (rawId.length() >= 6) {
                        resolvedEmpId = "EMP" + rawId.replaceAll("[^a-zA-Z0-9]", "").toUpperCase()
                            .substring(Math.max(0, rawId.length() - 6));
                    } else {
                        resolvedEmpId = "EMP" + rawId.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
                    }
                }
                dto.setEmpId(resolvedEmpId);
            }
        }
        // If no user found, leave essential fields as null for filtering
    }

    // Only set defaults for non-essential fields
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

            com.omoikaneinnovation.hmrsbackend.model.Notification notification =
                new com.omoikaneinnovation.hmrsbackend.model.Notification();
            notification.setMessage("User " + a.getUserId() + " missed checkout today");
            notification.setType("warning");
            notification.setUserId(a.getUserId());
            notification.setBadge(1);
            notification.setLink("/attendance");

            try {
                notificationService.save(notification);
            } catch (Exception e) {
                System.out.println("Notification save failed: " + e.getMessage());
            }
        }
    }
}

    /**
     * Runs every night at 11:00 PM.
     * For every active user who has NO attendance record for today:
     *   - If they have an APPROVED leave covering today → status = "On Leave"
     *   - Otherwise                                     → status = "Absent"
     *
     * Also handles users who checked in but never checked out by end of day
     * → marks them as "Half Day" (they came but didn't complete the day properly).
     */
    @Scheduled(cron = "0 0 23 * * *")
    public void autoMarkAbsentAndLeave() {

        String today = LocalDate.now().toString();
        System.out.println("⏰ [AutoMark] Running attendance auto-status for: " + today);

        // All attendance records for today
        List<Attendance> todayRecords = attendanceRepo.findAll().stream()
                .filter(a -> today.equals(a.getDate()))
                .collect(Collectors.toList());

        // Build a set of userIds who already have a record today
        java.util.Set<String> checkedInUserIds = todayRecords.stream()
                .map(Attendance::getUserId)
                .collect(java.util.stream.Collectors.toSet());

        // ── Part 1: fix records that have checkIn but no checkOut (missed checkout) ──
        for (Attendance a : todayRecords) {
            if (a.getCheckIn() != null && !a.getCheckIn().isBlank()
                    && (a.getCheckOut() == null || a.getCheckOut().isBlank())) {
                // Checked in but never checked out → Half Day
                if (!"Half Day".equals(a.getStatus()) && !"Present".equals(a.getStatus())) {
                    a.setStatus("Half Day");
                    attendanceRepo.save(a);
                    System.out.println("✏️  [AutoMark] Half Day (no checkout): userId=" + a.getUserId());
                }
            }
        }

        // ── Part 2: create Absent / On Leave records for users with NO record today ──
        List<User> allUsers = userRepo.findAll();

        // All approved leaves that cover today
        List<LeaveRequest> todayLeaves = leaveRepo.findAll().stream()
                .filter(l -> "APPROVED".equalsIgnoreCase(l.getStatus()))
                .filter(l -> {
                    try {
                        LocalDate start = LocalDate.parse(l.getStartDate());
                        LocalDate end   = LocalDate.parse(l.getEndDate());
                        LocalDate date  = LocalDate.parse(today);
                        return !date.isBefore(start) && !date.isAfter(end);
                    } catch (Exception e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());

        java.util.Set<String> onLeaveUserIds = todayLeaves.stream()
                .map(LeaveRequest::getUserId)
                .collect(java.util.stream.Collectors.toSet());

        // Day of week — skip Sundays (1=Mon … 7=Sun)
        java.time.DayOfWeek dayOfWeek = LocalDate.parse(today).getDayOfWeek();
        boolean isWeeklyOff = (dayOfWeek == java.time.DayOfWeek.SUNDAY);

        if (isWeeklyOff) {
            System.out.println("ℹ️  [AutoMark] Sunday — skipping absent marking.");
            return;
        }

        for (User user : allUsers) {
            String uid = user.getId();

            // Already has a record today — skip
            if (checkedInUserIds.contains(uid)) continue;

            String resolvedStatus;
            String resolvedAttendanceType;

            if (onLeaveUserIds.contains(uid)) {
                resolvedStatus       = "On Leave";
                resolvedAttendanceType = "Leave";
            } else {
                resolvedStatus       = "Absent";
                resolvedAttendanceType = "Absent";
            }

            // Create a minimal attendance record so it shows up in the table
            Attendance absent = new Attendance();
            absent.setUserId(uid);
            absent.setDate(today);
            absent.setEmpId(user.getEmployeeId() != null ? user.getEmployeeId() : "-");
            absent.setName(user.getName() != null ? user.getName() : "-");
            absent.setDepartment(user.getDepartment() != null ? user.getDepartment() : "-");
            absent.setStatus(resolvedStatus);
            absent.setAttendanceType(resolvedAttendanceType);
            absent.setLate("No");
            absent.setEarlyLeave("No");
            absent.setManagerEmail(user.getManagerEmail() != null ? user.getManagerEmail() : "-");

            attendanceRepo.save(absent);
            System.out.println("✏️  [AutoMark] " + resolvedStatus + " created for userId=" + uid + " (" + user.getName() + ")");
        }

        System.out.println("✅ [AutoMark] Done for " + today);
    }

    /**
     * Manager can edit attendance for their team members
     * This allows managers to mark absent employees as present
     */
    public String managerEditAttendance(String userId, String date, String status, 
                                        String checkIn, String checkOut, String managerEmail) {
        
        if (userId == null || date == null || managerEmail == null) {
            return "Missing required fields: userId, date, or managerEmail";
        }

        // Verify that the manager has authority to edit this employee's attendance
        Optional<User> employeeOpt = userRepo.findById(userId);
        if (employeeOpt.isEmpty()) {
            return "Employee not found";
        }

        User employee = employeeOpt.get();
        
        // Check if the manager is authorized (manager's email should match employee's managerEmail)
        if (employee.getManagerEmail() == null || 
            !employee.getManagerEmail().equalsIgnoreCase(managerEmail)) {
            return "Unauthorized: You are not the reporting manager for this employee";
        }

        // Find or create attendance record
        Attendance attendance = attendanceRepo.findByUserIdAndDate(userId, date);
        
        if (attendance == null) {
            // Create new attendance record
            attendance = new Attendance();
            attendance.setUserId(userId);
            attendance.setDate(date);
            attendance.setEmpId(employee.getEmployeeId() != null ? employee.getEmployeeId() : "-");
            attendance.setName(employee.getName() != null ? employee.getName() : "-");
            attendance.setDepartment(employee.getDepartment() != null ? employee.getDepartment() : "-");
            attendance.setReportingManager(employee.getManagerName() != null ? employee.getManagerName() : managerEmail);
            attendance.setManagerEmail(managerEmail);
            attendance.setManagerId(employee.getManagerId());
        }

        // Update status
        // ✅ FIX: When manager explicitly sets status, use it. Otherwise, auto-calculate from worked hours
        if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("Pending Approval")) {
            attendance.setStatus(status);
        }
        // If status is "Pending Approval" or empty, it will be auto-calculated below when check-out is set

        // Update check-in time if provided
        if (checkIn != null && !checkIn.isEmpty() && !checkIn.equals("-")) {
            attendance.setCheckIn(checkIn);
            // Set attendance type if marking present
            if ("Present".equalsIgnoreCase(status) || "Half Day".equalsIgnoreCase(status)) {
                if (attendance.getAttendanceType() == null || attendance.getAttendanceType().equals("-") || attendance.getAttendanceType().equals("Absent")) {
                    attendance.setAttendanceType("Office");
                }
            }
        }

        // Update check-out time if provided
        if (checkOut != null && !checkOut.isEmpty() && !checkOut.equals("-")) {
            attendance.setCheckOut(checkOut);
            
            // Calculate worked minutes if both check-in and check-out are present
            if (attendance.getCheckIn() != null && !attendance.getCheckIn().isEmpty() && !attendance.getCheckIn().equals("-")) {
                try {
                    LocalTime in = LocalTime.parse(attendance.getCheckIn());
                    LocalTime out = LocalTime.parse(checkOut);
                    int minutes = (int) Duration.between(in, out).toMinutes();
                    attendance.setWorkedMinutes(minutes);
                    
                    // ✅ FIX: Auto-calculate and SET status when manager edits (even if status was "Pending Approval")
                    // Only keep explicit status if manager specifically set it to Present/Absent/Half Day
                    if (status == null || status.isEmpty() || status.equalsIgnoreCase("Pending Approval")) {
                        if (minutes >= 480) { // 8 hours or more
                            attendance.setStatus("Present");
                        } else if (minutes >= 240) { // 4 hours or more
                            attendance.setStatus("Half Day");
                        } else if (minutes > 0) { // Less than 4 hours
                            attendance.setStatus("Half Day");
                        } else {
                            attendance.setStatus("Absent");
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Error calculating worked minutes: " + e.getMessage());
                }
            }
        }

        // Set location defaults if not present
        if (attendance.getLocationIn() == null || attendance.getLocationIn().isEmpty()) {
            attendance.setLocationIn("Manager Edited");
        }
        if (attendance.getLocationOut() == null || attendance.getLocationOut().isEmpty()) {
            attendance.setLocationOut("Manager Edited");
        }

        // Set late status based on check-in time
        if (attendance.getCheckIn() != null && !attendance.getCheckIn().isEmpty() && !attendance.getCheckIn().equals("-")) {
            try {
                int hour = Integer.parseInt(attendance.getCheckIn().split(":")[0]);
                attendance.setLate(hour > 9 ? "Yes" : "No");
            } catch (Exception e) {
                attendance.setLate("No");
            }
        } else {
            attendance.setLate("No");
        }

        // Set early leave status
        if (attendance.getEarlyLeave() == null || attendance.getEarlyLeave().isEmpty()) {
            attendance.setEarlyLeave("No");
        }

        attendanceRepo.save(attendance);
        
        return "Attendance updated successfully by manager";
    }

    /**
     * Backfill missing empId, name, department, and manager info in all Attendance records
     * This ensures timesheet displays correct data after page refresh
     */
    public String backfillAttendanceData() {
        System.out.println("🔄 Starting attendance data backfill...");
        
        List<Attendance> allAttendance = attendanceRepo.findAll();
        int updatedCount = 0;
        int skippedCount = 0;
        
        for (Attendance attendance : allAttendance) {
            boolean needsUpdate = false;
            
            // Skip if empId is already properly set (not empty, not "-", not UNKNOWN)
            if (attendance.getEmpId() == null || 
                attendance.getEmpId().trim().isEmpty() || 
                attendance.getEmpId().equals("-") ||
                attendance.getEmpId().equals("UNKNOWN") ||
                attendance.getEmpId().startsWith("EMP-")) {
                
                // Find user by userId (could be email or MongoDB _id)
                Optional<User> userOpt = userRepo.findByEmail(attendance.getUserId());
                if (userOpt.isEmpty()) {
                    userOpt = userRepo.findById(attendance.getUserId());
                }
                
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    
                    // Try to get empId from Employee collection first
                    Optional<Employee> empOpt = employeeRepo.findByEmail(user.getEmail());
                    if (empOpt.isEmpty()) {
                        empOpt = employeeRepo.findByUserId(user.getId());
                    }
                    
                    String empId = null;
                    String fullName = null;
                    
                    if (empOpt.isPresent()) {
                        Employee emp = empOpt.get();
                        empId = emp.getEmployeeId();
                        fullName = emp.getFullName();
                    }
                    
                    // Fallback to User collection
                    if (empId == null || empId.trim().isEmpty()) {
                        empId = user.getEmployeeId();
                    }
                    
                    if (fullName == null || fullName.trim().isEmpty()) {
                        fullName = user.getName();
                    }
                    
                    // Update attendance record
                    if (empId != null && !empId.trim().isEmpty()) {
                        attendance.setEmpId(empId);
                        needsUpdate = true;
                    }
                    
                    if (fullName != null && !fullName.trim().isEmpty()) {
                        attendance.setName(fullName);
                        needsUpdate = true;
                    }
                    
                    if (user.getDepartment() != null && !user.getDepartment().trim().isEmpty()) {
                        attendance.setDepartment(user.getDepartment());
                        needsUpdate = true;
                    }
                    
                    if (user.getManagerEmail() != null && !user.getManagerEmail().trim().isEmpty()) {
                        attendance.setManagerEmail(user.getManagerEmail());
                        needsUpdate = true;
                    }
                    
                    if (user.getManagerName() != null && !user.getManagerName().trim().isEmpty()) {
                        attendance.setReportingManager(user.getManagerName());
                        needsUpdate = true;
                    }
                    
                    if (needsUpdate) {
                        attendanceRepo.save(attendance);
                        updatedCount++;
                        System.out.println("✅ Updated attendance: " + attendance.getDate() + 
                                         " | " + attendance.getUserId() + 
                                         " | empId=" + empId);
                    }
                } else {
                    skippedCount++;
                    System.out.println("⚠️  User not found for attendance: " + attendance.getUserId());
                }
            } else {
                skippedCount++;
            }
        }
        
        String result = "Backfill complete: " + updatedCount + " records updated, " + 
                       skippedCount + " records skipped (already have empId or user not found)";
        System.out.println("🎉 " + result);
        return result;
    }

}