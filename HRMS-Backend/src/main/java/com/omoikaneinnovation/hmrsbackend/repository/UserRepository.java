package com.omoikaneinnovation.hmrsbackend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.omoikaneinnovation.hmrsbackend.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByEmailContainingIgnoreCase(String email);
    User findByEmployeeId(String employeeId);
    
    // ✅ Manager-employee relationship methods
    List<User> findByManagerEmail(String managerEmail);
    List<User> findByRole(String role);
    
    // ✅ Case-insensitive email search
    @Query("{'email': {$regex: ?0, $options: 'i'}}")
    Optional<User> findByEmailIgnoreCase(String email);
    
    // ✅ Case-insensitive manager email search  
    @Query("{'managerEmail': {$regex: ?0, $options: 'i'}}")
    List<User> findByManagerEmailIgnoreCase(String managerEmail);
}
