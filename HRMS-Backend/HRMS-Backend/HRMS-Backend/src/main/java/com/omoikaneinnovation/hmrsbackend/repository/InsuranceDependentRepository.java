package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.InsuranceDependent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InsuranceDependentRepository
        extends MongoRepository<InsuranceDependent, String> {

    List<InsuranceDependent> findByEmployeeCode(String employeeCode);
}