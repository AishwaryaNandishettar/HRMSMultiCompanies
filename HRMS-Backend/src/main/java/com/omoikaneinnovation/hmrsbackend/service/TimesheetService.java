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

import java.util.*;

@Service
public class TimesheetService {   // ✅ FIXED NAME

    private final AttendanceRepository repo;
    private final LeaveRepository leaveRepo;
    private final UserRepository userRepo;

    public TimesheetService(AttendanceRepository repo, LeaveRepository leaveRepo, UserRepository userRepo) {
        this.repo = repo;
        this.leaveRepo = leaveRepo;
        this.userRepo = userRepo;
    }

    public List<TimesheetSummary> getMonthlySummary(String month) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       String userId = auth != null ? auth.getName() : "";

        List<Attendance> data;

        if (auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE"))) {

            data = repo.findByUserIdAndDateStartingWith(userId, month);
        } else {
            data = repo.findByDateStartingWith(month);
        }

        List<LeaveRequest> leaveList = leaveRepo.findAll();

        Map<String, TimesheetSummary> map = new HashMap<>();

        for (Attendance r : data) {

            String key = r.getUserId() + "_" + month;

            map.putIfAbsent(key, new TimesheetSummary());
            TimesheetSummary obj = map.get(key);

            // Enrich with user info (empId, name, department, reportingManager)
            if (obj.getEmpId() == null) {
                Optional<User> userOpt = userRepo.findByEmail(r.getUserId());
                if (userOpt.isPresent()) {
                    User u = userOpt.get();
                    // Set proper employee ID (never email)
                    String empId = u.getEmployeeId();
                    if (empId == null || empId.isBlank()) {
                        empId = r.getUserId(); // fallback to email only if no ID set
                    }
                    obj.setEmpId(empId);

                    // Set display name (prefer employeeName, fallback to capitalized email prefix)
                    String name = u.getName();
                    if (name == null || name.isBlank() || name.equals(u.getEmail())) {
                        String prefix = u.getEmail() != null ? u.getEmail().split("@")[0] : "-";
                        name = prefix.isEmpty() ? "-" : Character.toUpperCase(prefix.charAt(0)) + prefix.substring(1);
                    }
                    obj.setEmpName(name);
                    obj.setDepartment(u.getDepartment() != null ? u.getDepartment() : "-");

                    // Reporting manager: prefer managerName, fall back to looking up by managerId
                    String managerName = u.getManagerName();
                    if ((managerName == null || managerName.isBlank()) && u.getManagerId() != null && !u.getManagerId().isBlank()) {
                        Optional<User> mgr = userRepo.findById(u.getManagerId());
                        if (mgr.isEmpty()) mgr = userRepo.findByEmail(u.getManagerId());
                        if (mgr.isPresent() && mgr.get().getName() != null) {
                            managerName = mgr.get().getName();
                        }
                    }
                    obj.setReportingManager(managerName != null ? managerName : "-");
                } else {
                    obj.setEmpId(r.getUserId());
                    obj.setEmpName("-");
                    obj.setDepartment("-");
                    obj.setReportingManager("-");
                }
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
}