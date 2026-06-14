package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.InsuranceEmployee;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InsuranceEmployeeRepository
        extends MongoRepository<InsuranceEmployee, String> {
}