    package com.omoikaneinnovation.hmrsbackend.service;

    import com.omoikaneinnovation.hmrsbackend.model.Employee;
    import com.omoikaneinnovation.hmrsbackend.model.OnboardingRecord;
    import com.omoikaneinnovation.hmrsbackend.model.User;
    import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.OnboardingRepository;
    import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
    import com.omoikaneinnovation.hmrsbackend.security.JwtUtil;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;

    import java.util.List;
    import java.util.Map;

    @Service
    public class OnboardingService {

    private static final Logger log = LoggerFactory.getLogger(OnboardingService.class);

        @Value("${frontend.url:http://localhost:5173}")
        private String frontendUrl;

        @Autowired
        private EmployeeRepository employeeRepo;

        @Autowired
        private OnboardingRepository onboardingRepo;

        @Autowired
        private UserRepository userRepo;

        @Autowired
        private BCryptPasswordEncoder encoder;

        @Autowired
        private OtpService otpService;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
private EmailService emailService;

public void onboard(Map<String, Object> payload) {

    log.info("Payload received: {}", payload);

    String email = ((String) payload.get("email")).trim().toLowerCase();

    log.info("Checking employee email: {}", email);

    User user;
    Employee emp;

    // =====================================================
    // 1. FIND EXISTING EMPLOYEE
    // =====================================================
    emp = employeeRepo.findByEmail(email).orElse(null);

    if (emp != null) {

        log.info("Existing employee found: {}", email);

        // =================================================
        // 2. FIND EXISTING USER
        // =================================================
        user = userRepo.findByEmail(email).orElse(null);

        // =================================================
        // 3. IF USER DOES NOT EXIST, CREATE USER
        // =================================================
        if (user == null) {

            user = new User();

            user.setEmail(email);
            user.setName(
                    emp.getFullName() != null
                            ? emp.getFullName()
                            : (String) payload.get("fullName")
            );

            user.setRole("EMPLOYEE");

            String password = (String) payload.get("password");

            if (password != null && !password.isEmpty()) {
                user.setPassword(encoder.encode(password));
            } else {
                user.setPassword(encoder.encode("Temp@123"));
            }

            user = userRepo.save(user);

            log.info("New User account created for existing employee: {}", email);

        } else {

            log.info("Existing User found for: {}", email);

            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("EMPLOYEE");
                userRepo.save(user);
            }
        }

        // Connect employee with user
        emp.setUserId(user.getId());

        // Update only if values are available
        if (payload.get("fullName") != null) {
            emp.setFullName((String) payload.get("fullName"));
        }

        if (payload.get("department") != null) {
            emp.setDepartment((String) payload.get("department"));
        }

        if (payload.get("designation") != null) {
            emp.setDesignation((String) payload.get("designation"));
        }

        emp.setStatus("INVITED");

        employeeRepo.save(emp);

        log.info("Existing employee prepared for invitation: {}", email);

    } else {

        // =====================================================
        // 4. CREATE NEW USER
        // =====================================================

        user = new User();

        user.setEmail(email);
        user.setName((String) payload.get("fullName"));
        user.setRole("EMPLOYEE");

        String password = (String) payload.get("password");

        if (password != null && !password.isEmpty()) {
            user.setPassword(encoder.encode(password));
        } else {
            user.setPassword(encoder.encode("Temp@123"));
        }

        user = userRepo.save(user);

        // =====================================================
        // 5. CREATE NEW EMPLOYEE
        // =====================================================

        emp = new Employee();

        emp.setEmployeeId(
                generateEmployeeId(
                        (String) payload.get("department")
                )
        );

        emp.setFullName((String) payload.get("fullName"));
        emp.setEmail(email);
        emp.setDepartment((String) payload.get("department"));
        emp.setDesignation((String) payload.get("designation"));
        emp.setUserId(user.getId());
        emp.setStatus("INVITED");

        employeeRepo.save(emp);

        log.info("New employee created: {}", email);
    }

    // =====================================================
    // 6. GENERATE OTP
    // =====================================================

    String otp = otpService.generateOtp(email);

    // =====================================================
    // 7. SEND INVITATION EMAIL
    // =====================================================

    String onboardingLink = frontendUrl;

    try {

        log.info("Sending invite email to: {}", email);

        emailService.sendInviteEmail(
                email,
                onboardingLink,
                otp,
                "Temp@123"
        );

        log.info("Invite email successfully sent to: {}", email);

    } catch (Exception e) {

        log.error(
                "Email sending failed for {}: {}",
                email,
                e.getMessage(),
                e
        );

        throw new RuntimeException(
                "Failed to send invitation email to " + email
        );
    }
}
private String generateEmployeeId(String department) {

    long count = employeeRepo.count() + 1;

    String deptCode = department != null && department.length() >= 2
            ? department.substring(0, 2).toUpperCase()
            : "GN"; // General fallback

    return deptCode + "-EMP-" + String.format("%04d", count);
}
public void acceptInvite(String email, String password) {

    // 1. Find user
    User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 2. Set new password (encode)
    if (password != null && !password.isEmpty()) {
        user.setPassword(encoder.encode(password));
    } else {
        throw new RuntimeException("Password cannot be empty");
    }

    userRepo.save(user);

    // 3. Activate employee (IMPORTANT STEP)
    Employee emp = employeeRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

    emp.setStatus("ACTIVE");
    employeeRepo.save(emp);

    log.info("Invite accepted successfully for email: {}", email);
}


      public void submitOnboarding(String email, Map<String,Object> payload){

    // ✅ EXTRACT PERSONAL DATA
    Map<String, Object> personal = (Map<String, Object>) payload.get("personal");
    Map<String, Object> job = (Map<String, Object>) payload.get("job");

    // ✅ FIND OR CREATE EMPLOYEE
    Employee emp = employeeRepo.findByEmail(email)
            .orElseGet(() -> {
                // Create new employee if doesn't exist (admin direct onboarding)
                Employee newEmp = new Employee();
                
                if (personal != null) {
                    newEmp.setFullName((String) personal.get("fullName"));
                }
                if (job != null) {
                    newEmp.setEmployeeId((String) job.get("employeeId"));
                    newEmp.setDepartment((String) job.get("department"));
                    newEmp.setDesignation((String) job.get("designation"));
                }
                
                newEmp.setEmail(email);
                newEmp.setStatus("ACTIVE");
                
                return employeeRepo.save(newEmp);
            });

    // ✅ SET PASSWORD if provided
    String password = personal != null ? (String) personal.get("password") : null;

    if(password != null && !password.isEmpty()){
        // Try to find user, create if doesn't exist
        User user = userRepo.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName((String) (personal != null ? personal.get("fullName") : ""));
                    newUser.setRole("EMPLOYEE");
                    return userRepo.save(newUser);
                });

        user.setPassword(encoder.encode(password));
        userRepo.save(user);
    }

    // ✅ SAVE ONBOARDING RECORD
    OnboardingRecord record = new OnboardingRecord();

    record.setEmployeeId(emp.getEmployeeId());
    record.setPersonal(personal);
    record.setJob(job);
    record.setExperience((List<Map<String, Object>>) payload.get("experience"));
    record.setCibil((Map<String, Object>) payload.get("cibil"));
    record.setPolice((Map<String, Object>) payload.get("police"));
    record.setResidence((Map<String, Object>) payload.get("residence"));
    record.setReferences((List<Map<String, Object>>) payload.get("references"));
    record.setDocuments((Map<String, Object>) payload.get("documents"));
    record.setBgvStatus("SUBMITTED");
    record.setSubmittedAt(java.time.Instant.now());

    onboardingRepo.save(record);

    // ✅ UPDATE EXISTING EMPLOYEE WITH ONBOARDING DATA
    emp.setStatus("ACTIVE");
    
    if (personal != null) {
        emp.setFullName((String) personal.get("fullName"));
        emp.setDob((String) personal.get("dob"));
    }
    
    if (job != null) {
        emp.setDepartment((String) job.get("department"));
        emp.setDesignation((String) job.get("designation"));
        emp.setJoiningDate((String) job.get("joiningDate"));
    }

    employeeRepo.save(emp);

    log.info("✅ Onboarding submitted successfully for: {}", email);
}



    public void updateBGVStatus(String employeeId, String status) {

        OnboardingRecord record = onboardingRepo.findByEmployeeId(employeeId);

        if(record != null){
            record.setBgvStatus(status);
            onboardingRepo.save(record);
        }
         // ✅ AUTO ACTIVATE WHEN BGV IS COMPLETED
    if ("COMPLETED".equalsIgnoreCase(status)) {

        Employee emp = employeeRepo.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        emp.setStatus("ACTIVE");
        employeeRepo.save(emp);
    }

    }

    public void activateEmployee(String employeeId){

        Employee emp = employeeRepo.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        emp.setStatus("ACTIVE");

        employeeRepo.save(emp);
    }
    }