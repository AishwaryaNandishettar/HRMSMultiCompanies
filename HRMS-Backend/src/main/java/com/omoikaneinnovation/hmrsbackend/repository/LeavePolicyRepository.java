package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.LeavePolicy;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeavePolicyRepository extends MongoRepository<LeavePolicy, String> {
}