package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Diagnostic controller to check and fix manager-employee relationship data
 */
@RestController
@RequestMapping("/api/diagnostic")
public class DataDiagnosticController {

    @Autowired
    private UserRepository userRepo;

    /**
     * Check manager-employee relationships
     * GET /api/diagnostic/manager-relationships
     */
    @GetMapping("/manager-relationships")
    public Map<String, Object> checkManagerRelationships() {
        Map<String, Object> result = new HashMap<>();
        
        List<User> allUsers = userRepo.findAll();
        List<Map<String, String>> relationships = new ArrayList<>();
        List<String> issues = new ArrayList<>();
        
        for (User user : allUsers) {
            Map<String, String> rel = new HashMap<>();
            rel.put("email", user.getEmail());
            rel.put("name", user.getName());
            rel.put("employeeId", user.getEmployeeId());
            rel.put("managerEmail", user.getManagerEmail());
            rel.put("userId", user.getId());
            
            // Check if manager email exists as a user
            if (user.getManagerEmail() != null && !user.getManagerEmail().trim().isEmpty()) {
                Optional<User> managerOpt = userRepo.findByEmail(user.getManagerEmail());
                if (managerOpt.isPresent()) {
                    rel.put("managerExists", "YES");
                    rel.put("managerName", managerOpt.get().getName());
                } else {
                    rel.put("managerExists", "NO - ISSUE!");
                    issues.add("User " + user.getEmail() + " has manager " + user.getManagerEmail() + " but manager not found in users");
                }
            } else {
                rel.put("managerExists", "NO_MANAGER_SET");
            }
            
            relationships.add(rel);
        }
        
        result.put("totalUsers", allUsers.size());
        result.put("relationships", relationships);
        result.put("issues", issues);
        result.put("issueCount", issues.size());
        
        return result;
    }

    /**
     * Fix specific manager relationships
     * POST /api/diagnostic/fix-manager-relationships
     * Body: [{"userEmail": "adhviti@gmail.com", "managerEmail": "Padmanabh@omoi.com"}]
     */
    @PostMapping("/fix-manager-relationships")
    public Map<String, Object> fixManagerRelationships(@RequestBody List<Map<String, String>> fixes) {
        Map<String, Object> result = new HashMap<>();
        List<String> success = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (Map<String, String> fix : fixes) {
            String userEmail = fix.get("userEmail");
            String managerEmail = fix.get("managerEmail");
            
            try {
                Optional<User> userOpt = userRepo.findByEmail(userEmail);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    
                    // Verify manager exists
                    if (managerEmail != null && !managerEmail.trim().isEmpty()) {
                        Optional<User> managerOpt = userRepo.findByEmail(managerEmail);
                        if (!managerOpt.isPresent()) {
                            errors.add("Manager " + managerEmail + " not found for user " + userEmail);
                            continue;
                        }
                    }
                    
                    user.setManagerEmail(managerEmail);
                    userRepo.save(user);
                    success.add("Updated " + userEmail + " -> manager: " + managerEmail);
                } else {
                    errors.add("User " + userEmail + " not found");
                }
            } catch (Exception e) {
                errors.add("Error fixing " + userEmail + ": " + e.getMessage());
            }
        }
        
        result.put("successCount", success.size());
        result.put("errorCount", errors.size());
        result.put("success", success);
        result.put("errors", errors);
        
        return result;
    }

    /**
     * Auto-fix known relationships based on employee directory
     * POST /api/diagnostic/auto-fix-relationships
     */
    @PostMapping("/auto-fix-relationships")
    public Map<String, Object> autoFixRelationships() {
        Map<String, Object> result = new HashMap<>();
        List<String> success = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        // Known relationships from employee directory
        Map<String, String> knownRelationships = new HashMap<>();
        knownRelationships.put("adhviti@gmail.com", "Padmanabh@omoi.com");
        knownRelationships.put("mahesh@gmail.com", "Aishmanager@omoi.com");
        // Add more relationships as needed
        
        for (Map.Entry<String, String> entry : knownRelationships.entrySet()) {
            String userEmail = entry.getKey();
            String managerEmail = entry.getValue();
            
            try {
                Optional<User> userOpt = userRepo.findByEmail(userEmail);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    
                    // Check if manager exists
                    Optional<User> managerOpt = userRepo.findByEmail(managerEmail);
                    if (managerOpt.isPresent()) {
                        user.setManagerEmail(managerEmail);
                        userRepo.save(user);
                        success.add("Fixed: " + userEmail + " -> " + managerEmail);
                    } else {
                        errors.add("Manager not found: " + managerEmail + " for user " + userEmail);
                    }
                } else {
                    errors.add("User not found: " + userEmail);
                }
            } catch (Exception e) {
                errors.add("Error fixing " + userEmail + ": " + e.getMessage());
            }
        }
        
        result.put("fixedCount", success.size());
        result.put("errorCount", errors.size());
        result.put("fixed", success);
        result.put("errors", errors);
        
        return result;
    }

    /**
     * Get team members for a specific manager
     * GET /api/diagnostic/team/{managerEmail}
     */
    @GetMapping("/team/{managerEmail}")
    public Map<String, Object> getTeamForManager(@PathVariable String managerEmail) {
        Map<String, Object> result = new HashMap<>();
        
        List<User> team = userRepo.findByManagerEmail(managerEmail);
        List<Map<String, String>> teamInfo = new ArrayList<>();
        
        for (User member : team) {
            Map<String, String> info = new HashMap<>();
            info.put("email", member.getEmail());
            info.put("name", member.getName());
            info.put("employeeId", member.getEmployeeId());
            info.put("userId", member.getId());
            teamInfo.add(info);
        }
        
        result.put("managerEmail", managerEmail);
        result.put("teamSize", team.size());
        result.put("team", teamInfo);
        
        return result;
    }
}