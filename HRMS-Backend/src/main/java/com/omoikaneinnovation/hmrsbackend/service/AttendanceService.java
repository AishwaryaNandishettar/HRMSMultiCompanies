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

            String today = LocalDate.now().toString();

            Attendance existing =
                    attendanceRepo.findByUserIdAndDate(userId, today);

            if (existing != null) {
                return "Already checked in today";
            }

            Attendance attendance = new Attendance();

            attendance.setUserId(userId);
            attendance.setDate(today);
            attendance.setCheckIn(LocalTime.now().toString());

            attendanceRepo.save(attendance);

            return "Check-in successful";
        }

        public String checkOut(String userId, String date) {

            // Use the passed date if provided, otherwise fall back to today
            String lookupDate = (date != null && !date.isBlank()) ? date : LocalDate.now().toString();

            Attendance attendance =
                    attendanceRepo.findByUserIdAndDate(userId, lookupDate);

            if (attendance == null) {
                return "Check-in not found";
            }

            String checkOutTime = LocalTime.now().toString();
            attendance.setCheckOut(checkOutTime);

            LocalTime in = LocalTime.parse(attendance.getCheckIn());
            LocalTime out = LocalTime.parse(checkOutTime);

            int minutes = (int) Duration.between(in, out).toMinutes();

            attendance.setWorkedMinutes(minutes);

            attendanceRepo.save(attendance);

            return "Check-out successful";
        }

        public List<AttendanceDTO> getMyAttendance(String userId) {
            List<Attendance> records = attendanceRepo.findByUserId(userId);
            return records.stream().map(r -> enrichAttendance(r)).collect(Collectors.toList());
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

  Optional<User> userOpt = Optional.empty();

if (a.getUserId() != null && !a.getUserId().isBlank()) {

    userOpt = userRepo.findByEmail(a.getUserId());

    if (userOpt.isEmpty()) {
        userOpt = userRepo.findById(a.getUserId());
    }
}

    if (userOpt.isPresent()) {
        User user = userOpt.get();

        // ✅ NOW user is available → safe to use
      dto.setManagerId(
    user.getManagerEmail() != null && !user.getManagerEmail().isBlank()
        ? user.getManagerEmail()
        : (user.getManagerName() != null ? user.getManagerName() : "-")
);

       // Resolve display name: prefer employeeName, then email prefix, never raw email
       String resolvedName = user.getName();
       if (resolvedName == null || resolvedName.isBlank() || resolvedName.equals(user.getEmail())) {
           // employeeName not set — use email prefix as readable fallback
           resolvedName = user.getEmail() != null
               ? user.getEmail().split("@")[0]
               : "-";
           // Capitalize first letter
           if (!resolvedName.isEmpty()) {
               resolvedName = Character.toUpperCase(resolvedName.charAt(0)) + resolvedName.substring(1);
           }
       }
       dto.setName(resolvedName);
        dto.setDepartment(user.getDepartment() != null ? user.getDepartment() : "-");

        // Resolve reporting manager: prefer managerName, fall back to looking up by managerId
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

        String resolvedEmpId = user.getEmployeeId();

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

       // Never fall back to email for empId — use a generated ID if nothing found
       if (resolvedEmpId == null || resolvedEmpId.isBlank()) {
           // Generate a readable ID from the user's MongoDB id (last 6 chars)
           String rawId = user.getId() != null ? user.getId() : "";
           resolvedEmpId = "EMP" + rawId.replaceAll("[^a-zA-Z0-9]", "").toUpperCase()
               .substring(Math.max(0, rawId.length() - 6));
       }
       dto.setEmpId(resolvedEmpId);

    } else {
        dto.setEmpId(a.getUserId());
        dto.setName("-");
        dto.setDepartment("-");
        dto.setReportingManager("-");
        dto.setManagerId("-");
    }

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

    restTemplate.postForObject(
        "http://localhost:8082/api/notifications",
        notification,
        String.class
    );
}
    }
}
    }
