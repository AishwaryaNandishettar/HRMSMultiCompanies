package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.InsuranceNominee;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InsuranceNomineeRepository
        extends MongoRepository<InsuranceNominee, String> {
}