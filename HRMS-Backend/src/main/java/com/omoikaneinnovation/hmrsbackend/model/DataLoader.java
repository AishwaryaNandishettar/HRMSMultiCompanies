package com.omoikaneinnovation.hmrsbackend.config;
import lombok.*;
import com.omoikaneinnovation.hmrsbackend.model.*;
import com.omoikaneinnovation.hmrsbackend.repository.PerformanceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.omoikaneinnovation.hmrsbackend.repository.UserRepository;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.model.User;
import com.omoikaneinnovation.hmrsbackend.model.Employee;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(
        PerformanceRepository repo,
        UserRepository userRepository,
        EmployeeRepository employeeRepository){
        return args -> {

            if (repo.count() == 0) {

                Performance p = new Performance();
                p.setEmployeeId("EMP001");
                p.setOverallScore(4.3);

                p.setMonthlyRatings(List.of(
                        new MonthlyRating("Jan", 3.5),
                        new MonthlyRating("Feb", 4.0)
                ));

                repo.save(p);
            }
            // ===== CLEAN UP OLD DATA: FIX ALL companyId VALUES =====
            // Omoi employees should have NULL companyId for strict isolation
            
            userRepository.findAll().forEach(user -> {
                
                // Fix string "omoi", string "null", or empty string → set to actual null
                if ("omoi".equalsIgnoreCase(user.getCompanyId()) || 
                    "null".equalsIgnoreCase(user.getCompanyId()) || 
                    (user.getCompanyId() != null && user.getCompanyId().trim().isEmpty())) {
                    user.setCompanyId(null);
                    userRepository.save(user);
                    // Only log for Omoi users - removed logging for other companies
                }
                
                // If user has no companyId (actual null), keep it null (Omoi employees)
                else if (user.getCompanyId() == null) {
                    System.out.println("ℹ️  User already has null companyId (Omoi): " + user.getEmail());
                }
                
                // If user has valid client companyId (company-a, company-b, company-c), keep it
                else if ("company-a".equals(user.getCompanyId()) || 
                         "company-b".equals(user.getCompanyId()) || 
                         "company-c".equals(user.getCompanyId())) {
                    // Silent - no logging for other companies
                }
                
                // If user has any other invalid value, set to null (treat as Omoi)
                else {
                    user.setCompanyId(null);
                    userRepository.save(user);
                    // Silent - no logging for other companies
                }
            });

            // ===== CLEAN UP OLD DATA: FIX companyId IN EMPLOYEES COLLECTION =====
            
            employeeRepository.findAll().forEach(emp -> {
                
                // Fix string "omoi", string "null", or empty string → set to actual null
                if ("omoi".equalsIgnoreCase(emp.getCompanyId()) || 
                    "null".equalsIgnoreCase(emp.getCompanyId()) || 
                    (emp.getCompanyId() != null && emp.getCompanyId().trim().isEmpty())) {
                    emp.setCompanyId(null);
                    employeeRepository.save(emp);
                    // Only log for Omoi employees - removed logging for other companies
                }
                
                // If employee has no companyId (actual null), keep it null (Omoi employees)
                else if (emp.getCompanyId() == null) {
                    System.out.println("ℹ️  Employee already has null companyId (Omoi): " + emp.getEmail());
                }
                
                // If employee has valid client companyId (company-a, company-b, company-c), keep it
                else if ("company-a".equals(emp.getCompanyId()) || 
                         "company-b".equals(emp.getCompanyId()) || 
                         "company-c".equals(emp.getCompanyId())) {
                    // Silent - no logging for other companies
                }
                
                // If employee has any other invalid value, set to null (treat as Omoi)
                else {
                    emp.setCompanyId(null);
                    employeeRepository.save(emp);
                    // Silent - no logging for other companies
                }
            });
        };
    }
}