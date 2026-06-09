package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

import com.omoikaneinnovation.hmrsbackend.model.Employee;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/cleanup")
@CrossOrigin(origins = "*")
public class DatabaseCleanupController {

    @Autowired
    private EmployeeRepository employeeRepo;

    @GetMapping("/check-duplicates")
    public Map<String, Object> checkDuplicateEmployeeIds() {
        List<Employee> allEmployees = employeeRepo.findAll();
        
        // Group by employeeId
        Map<String, List<Employee>> groupedByEmployeeId = allEmployees.stream()
            .filter(e -> e.getEmployeeId() != null)
            .collect(Collectors.groupingBy(Employee::getEmployeeId));
        
        // Find duplicates
        Map<String, List<Employee>> duplicates = groupedByEmployeeId.entrySet().stream()
            .filter(entry -> entry.getValue().size() > 1)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalEmployees", allEmployees.size());
        result.put("duplicateEmployeeIds", duplicates.size());
        result.put("duplicateDetails", duplicates);
        
        System.out.println("🔍 Duplicate Check Results:");
        System.out.println("📊 Total Employees: " + allEmployees.size());
        System.out.println("⚠️ Duplicate EmployeeIds Found: " + duplicates.size());
        
        for (Map.Entry<String, List<Employee>> entry : duplicates.entrySet()) {
            System.out.println("❌ EmployeeId '" + entry.getKey() + "' has " + 
                entry.getValue().size() + " records:");
            for (Employee emp : entry.getValue()) {
                System.out.println("   - " + emp.getFullName() + " (MongoDB ID: " + emp.getId() + ")");
            }
        }
        
        return result;
    }

    @PostMapping("/fix-duplicates")
    public Map<String, Object> fixDuplicateEmployeeIds() {
        List<Employee> allEmployees = employeeRepo.findAll();
        
        // Group by employeeId
        Map<String, List<Employee>> groupedByEmployeeId = allEmployees.stream()
            .filter(e -> e.getEmployeeId() != null)
            .collect(Collectors.groupingBy(Employee::getEmployeeId));
        
        int fixedCount = 0;
        int errorCount = 0;
        List<String> fixedEmployees = new ArrayList<>();
        
        for (Map.Entry<String, List<Employee>> entry : groupedByEmployeeId.entrySet()) {
            List<Employee> duplicates = entry.getValue();
            
            if (duplicates.size() > 1) {
                // Keep the first one, modify others
                for (int i = 1; i < duplicates.size(); i++) {
                    Employee duplicate = duplicates.get(i);
                    try {
                        // Generate new unique employeeId
                        String newEmployeeId = generateUniqueEmployeeId(duplicate.getEmployeeId(), i);
                        String oldId = duplicate.getEmployeeId();
                        
                        duplicate.setEmployeeId(newEmployeeId);
                        employeeRepo.save(duplicate);
                        
                        fixedCount++;
                        String fixInfo = duplicate.getFullName() + ": " + oldId + " → " + newEmployeeId;
                        fixedEmployees.add(fixInfo);
                        
                        System.out.println("✅ Fixed duplicate: " + fixInfo);
                        
                    } catch (Exception e) {
                        errorCount++;
                        System.err.println("❌ Error fixing duplicate for " + 
                            duplicate.getFullName() + ": " + e.getMessage());
                    }
                }
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("fixedCount", fixedCount);
        result.put("errorCount", errorCount);
        result.put("fixedEmployees", fixedEmployees);
        result.put("message", "Fixed " + fixedCount + " duplicate employeeIds with " + errorCount + " errors");
        
        System.out.println("🎉 Duplicate Fix Complete: " + fixedCount + " fixed, " + errorCount + " errors");
        
        return result;
    }

    @PostMapping("/generate-missing-employee-ids")
    public Map<String, Object> generateMissingEmployeeIds() {
        List<Employee> employees = employeeRepo.findAll();
        int generatedCount = 0;
        int errorCount = 0;
        List<String> generatedIds = new ArrayList<>();
        
        for (Employee emp : employees) {
            if (emp.getEmployeeId() == null || emp.getEmployeeId().trim().isEmpty()) {
                try {
                    // Generate new employeeId based on name or email
                    String newEmployeeId = generateEmployeeId(emp);
                    emp.setEmployeeId(newEmployeeId);
                    employeeRepo.save(emp);
                    
                    generatedCount++;
                    String info = emp.getFullName() + " → " + newEmployeeId;
                    generatedIds.add(info);
                    
                    System.out.println("✅ Generated employeeId: " + info);
                    
                } catch (Exception e) {
                    errorCount++;
                    System.err.println("❌ Error generating employeeId for " + 
                        emp.getFullName() + ": " + e.getMessage());
                }
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("generatedCount", generatedCount);
        result.put("errorCount", errorCount);
        result.put("generatedIds", generatedIds);
        result.put("message", "Generated " + generatedCount + " employeeIds with " + errorCount + " errors");
        
        return result;
    }

    private String generateUniqueEmployeeId(String baseId, int suffix) {
        return baseId + "-" + String.format("%02d", suffix);
    }

    private String generateEmployeeId(Employee emp) {
        // Generate based on name or email
        String base;
        if (emp.getFullName() != null && !emp.getFullName().trim().isEmpty()) {
            // Use first 3 letters of name
            base = emp.getFullName().replaceAll("[^a-zA-Z]", "").toUpperCase();
            if (base.length() > 3) {
                base = base.substring(0, 3);
            }
        } else if (emp.getEmail() != null) {
            // Use first 3 letters of email username
            base = emp.getEmail().split("@")[0].replaceAll("[^a-zA-Z]", "").toUpperCase();
            if (base.length() > 3) {
                base = base.substring(0, 3);
            }
        } else {
            base = "EMP";
        }
        
        // Add sequential number
        long timestamp = System.currentTimeMillis() % 10000;
        return base + "-" + String.format("%04d", timestamp);
    }
}