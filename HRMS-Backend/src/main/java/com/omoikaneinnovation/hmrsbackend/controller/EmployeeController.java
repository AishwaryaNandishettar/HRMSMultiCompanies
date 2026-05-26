package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.EmployeeDTO;
import com.omoikaneinnovation.hmrsbackend.dto.EmployeeUpdateDTO;
import com.omoikaneinnovation.hmrsbackend.dto.ParticipantDTO;
import com.omoikaneinnovation.hmrsbackend.model.Employee;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.service.EmployeeService;
import com.omoikaneinnovation.hmrsbackend.service.OnboardingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(originPatterns = {
        "http://localhost:*",
        "http://127.0.0.1:*",
        "https://*.vercel.app",
        "https://*.ngrok-free.dev"
})
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OnboardingService onboardingService;

    /* =========================================================
       CREATE EMPLOYEE
       ========================================================= */
    @PostMapping("/create")
    public ResponseEntity<User> createEmployee(
            @RequestBody EmployeeDTO dto,
            Principal principal
    ) {

        String companyId = null;

        if (principal != null) {
            String email = principal.getName();

            User admin = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            companyId = admin.getCompanyId();
        }

        User employee = employeeService.createEmployee(
                dto.getName(),
                dto.getEmail(),
                dto.getPassword(),
                companyId
        );

        return ResponseEntity.ok(employee);
    }

    /* =========================================================
       UPDATE EMPLOYEE
       ========================================================= */
    @PutMapping("/update/{employeeId}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable String employeeId,
            @RequestBody EmployeeUpdateDTO dto
    ) {

        try {

            Employee updatedEmployee =
                    employeeService.updateEmployee(employeeId, dto);

            return ResponseEntity.ok(updatedEmployee);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body("Failed to update employee: " + e.getMessage());
        }
    }

    /* =========================================================
       GET ALL EMPLOYEES
       ========================================================= */
    @GetMapping("/all")
    public ResponseEntity<?> getAllEmployees(Principal principal) {

        try {

            if (principal == null) {
                return ResponseEntity.ok(new ArrayList<>());
            }

            String email = principal.getName();

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("User not found: " + email)
                    );

            String companyId = user.getCompanyId();

            List<Employee> employees =
                    employeeService.getAllEmployees(companyId);

            return ResponseEntity.ok(employees);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /* =========================================================
       CURRENT MONTH BIRTHDAYS
       ========================================================= */
    @GetMapping("/birthdays/current-month")
    public List<Employee> getBirthdays() {
        return employeeService.getCurrentMonthBirthdays();
    }

    /* =========================================================
       GET EMPLOYEES AS USERS
       ========================================================= */
    @GetMapping("/as-users")
    public ResponseEntity<List<User>> getEmployeesAsUsers(
            Principal principal
    ) {

        List<User> userList = new ArrayList<>();

        // Existing users
        List<User> allUsers = userRepository.findAll();
        userList.addAll(allUsers);

        // Employees
        if (principal != null) {

            String email = principal.getName();

            User user = userRepository.findByEmail(email)
                    .orElseThrow();

            List<Employee> employees =
                    employeeService.getAllEmployees(user.getCompanyId());

            for (Employee emp : employees) {

                User empUser = new User();

                empUser.setId(emp.getId());
                empUser.setName(emp.getFullName());
                empUser.setEmail(emp.getEmail());
                empUser.setDepartment(emp.getDepartment());
                empUser.setDesignation(emp.getDesignation());
                empUser.setRole("EMPLOYEE");

                empUser.setActive(
                        "ACTIVE".equals(emp.getStatus()) ||
                        "INVITED".equals(emp.getStatus())
                );

                userList.add(empUser);
            }
        }

        return ResponseEntity.ok(userList);
    }

    /* =========================================================
       GET PARTICIPANTS
       ========================================================= */
    @GetMapping("/participants")
    public ResponseEntity<List<ParticipantDTO>> getAllParticipants(
            Principal principal
    ) {

        List<ParticipantDTO> participants = new ArrayList<>();

        // Add users
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {

            ParticipantDTO participant = ParticipantDTO.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .department(
                            user.getDepartment() != null
                                    ? user.getDepartment()
                                    : ""
                    )
                    .designation(
                            user.getDesignation() != null
                                    ? user.getDesignation()
                                    : ""
                    )
                    .type("USER")
                    .active(user.isActive())
                    .build();

            participants.add(participant);
        }

        // Add employees
        if (principal != null) {

            String email = principal.getName();

            User loggedInUser = userRepository.findByEmail(email)
                    .orElseThrow();

            List<Employee> employees =
                    employeeService.getAllEmployees(
                            loggedInUser.getCompanyId()
                    );

            for (Employee emp : employees) {

                ParticipantDTO participant = ParticipantDTO.builder()
                        .id(emp.getId())
                        .name(emp.getFullName())
                        .email(emp.getEmail())
                        .department(emp.getDepartment())
                        .designation(emp.getDesignation())
                        .type("EMPLOYEE")
                        .active(
                                "ACTIVE".equals(emp.getStatus()) ||
                                "INVITED".equals(emp.getStatus())
                        )
                        .build();

                participants.add(participant);
            }
        }

        return ResponseEntity.ok(participants);
    }

    /* =========================================================
       SEARCH PARTICIPANTS
       ========================================================= */
    @GetMapping("/participants/search")
    public ResponseEntity<List<ParticipantDTO>> searchParticipants(
            @RequestParam(name = "query", defaultValue = "") String query,
            Principal principal
    ) {

        List<ParticipantDTO> participants = new ArrayList<>();

        String queryLower = query.toLowerCase().trim();

        // Search users
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {

            String name =
                    user.getName() != null ? user.getName() : "";

            String email =
                    user.getEmail() != null ? user.getEmail() : "";

            String dept =
                    user.getDepartment() != null
                            ? user.getDepartment()
                            : "";

            if (
                    name.toLowerCase().contains(queryLower)
                            || email.toLowerCase().contains(queryLower)
                            || dept.toLowerCase().contains(queryLower)
            ) {

                ParticipantDTO participant = ParticipantDTO.builder()
                        .id(user.getId())
                        .name(name)
                        .email(email)
                        .department(dept)
                        .designation(
                                user.getDesignation() != null
                                        ? user.getDesignation()
                                        : ""
                        )
                        .type("USER")
                        .active(user.isActive())
                        .build();

                participants.add(participant);
            }
        }

        // Search employees
        if (principal != null) {

            String email = principal.getName();

            User loggedInUser = userRepository.findByEmail(email)
                    .orElseThrow();

            List<Employee> employees =
                    employeeService.getAllEmployees(
                            loggedInUser.getCompanyId()
                    );

            for (Employee emp : employees) {

                if (
                        emp.getFullName().toLowerCase().contains(queryLower)
                                || emp.getEmail().toLowerCase().contains(queryLower)
                                || (
                                emp.getDepartment() != null
                                        && emp.getDepartment()
                                        .toLowerCase()
                                        .contains(queryLower)
                        )
                ) {

                    ParticipantDTO participant = ParticipantDTO.builder()
                            .id(emp.getId())
                            .name(emp.getFullName())
                            .email(emp.getEmail())
                            .department(emp.getDepartment())
                            .designation(emp.getDesignation())
                            .type("EMPLOYEE")
                            .active(
                                    "ACTIVE".equals(emp.getStatus()) ||
                                    "INVITED".equals(emp.getStatus())
                            )
                            .build();

                    participants.add(participant);
                }
            }
        }

        return ResponseEntity.ok(participants);
    }

    /* =========================================================
       BULK UPLOAD
       ========================================================= */
    @PostMapping("/bulk-upload")
    public ResponseEntity<?> bulkUpload(
            @RequestBody List<Map<String, Object>> employees,
            Principal principal
    ) {

        int success = 0;
        int failed = 0;

        List<String> failedRows = new ArrayList<>();

        String companyId = null;

        if (principal != null) {

            try {

                User admin = userRepository
                        .findByEmail(principal.getName())
                        .orElse(null);

                if (admin != null) {
                    companyId = admin.getCompanyId();
                }

            } catch (Exception ignored) {
            }
        }

        for (Map<String, Object> row : employees) {

            try {

                String empEmail = (String) row.get("email");

                if (empEmail == null || empEmail.isBlank()) {

                    failedRows.add("Row skipped: missing email");
                    failed++;
                    continue;
                }

                if (employeeRepository.findByEmail(empEmail).isPresent()) {

                    failedRows.add(empEmail + ": already exists");
                    failed++;
                    continue;
                }

                Employee emp = new Employee();

                emp.setFullName(
                        (String) row.getOrDefault("fullName", "")
                );

                emp.setEmail(empEmail);

                emp.setDepartment(
                        (String) row.getOrDefault("department", "")
                );

                emp.setDesignation(
                        (String) row.getOrDefault("designation", "")
                );

                emp.setLocation(
                        (String) row.getOrDefault("location", "")
                );

                emp.setManager(
                        (String) row.getOrDefault("manager", "")
                );

                emp.setManagerEmail(
                        (String) row.getOrDefault("managerEmail", "")
                );

                emp.setDob(
                        (String) row.getOrDefault("dob", "")
                );

                emp.setDoj(
                        (String) row.getOrDefault("doj", "")
                );

                emp.setStatus("INVITED");

                emp.setCompanyId(companyId);

                String dept =
                        emp.getDepartment() != null
                                && emp.getDepartment().length() >= 2
                                ? emp.getDepartment()
                                .substring(0, 2)
                                .toUpperCase()
                                : "GN";

                long count = employeeRepository.count() + 1;

                emp.setEmployeeId(
                        dept + "-EMP-" + String.format("%04d", count)
                );

                employeeRepository.save(emp);

                success++;

            } catch (Exception e) {

                failed++;

                failedRows.add(
                        row.getOrDefault("email", "unknown")
                                + ": "
                                + e.getMessage()
                );
            }
        }

        return ResponseEntity.ok(
                Map.of(
                        "total", employees.size(),
                        "success", success,
                        "failed", failed,
                        "failedRows", failedRows
                )
        );
    }

    /* =========================================================
       UPDATE ROLE
       ========================================================= */
    @PostMapping("/update-role")
    public ResponseEntity<?> updateUserRole(
            @RequestBody Map<String, String> request
    ) {

        try {

            String email = request.get("email");
            String newRole = request.get("role");

            if (email == null || newRole == null) {

                return ResponseEntity.badRequest()
                        .body("Email and role are required");
            }

            if (!newRole.matches("ADMIN|HR|MANAGER|EMPLOYEE")) {

                return ResponseEntity.badRequest()
                        .body(
                                "Invalid role. Must be one of: " +
                                "ADMIN, HR, MANAGER, EMPLOYEE"
                        );
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found with email: " + email
                            )
                    );

            String oldRole = user.getRole();

            user.setRole(newRole.toUpperCase());

            userRepository.save(user);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Role updated successfully",
                            "email", email,
                            "oldRole", oldRole,
                            "newRole", newRole.toUpperCase()
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(
                            "Failed to update role: " + e.getMessage()
                    );
        }
    }

    /* =========================================================
       INVITE ALL EMPLOYEES
       ========================================================= */
    @PostMapping("/invite-all")
    public ResponseEntity<?> inviteAllEmployees(
            Principal principal
    ) {

        try {

            String email = principal.getName();

            User admin = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Admin not found")
                    );

            String companyId = admin.getCompanyId();

            List<Employee> employees =
                    employeeRepository.findByCompanyId(companyId);

            int invited = 0;

            for (Employee emp : employees) {

                if (
                        emp.getEmail() == null
                                || emp.getEmail().isBlank()
                ) {
                    continue;
                }

                if (
                        "INVITED".equalsIgnoreCase(emp.getStatus())
                                || "ACTIVE".equalsIgnoreCase(emp.getStatus())
                ) {
                    continue;
                }

                try {

                    onboardingService.sendInvitationEmail(
                            emp.getEmail(),
                            emp.getFullName(),
                            "Temp@123"
                    );

                    emp.setStatus("INVITED");

                    employeeRepository.save(emp);

                    invited++;

                } catch (Exception ex) {

                    ex.printStackTrace();
                }
            }

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            invited + " employees invited successfully"
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }
}