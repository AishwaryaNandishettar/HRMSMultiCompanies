package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.InsurancePolicy;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceClaim;
import com.omoikaneinnovation.hmrsbackend.repository.InsurancePolicyRepository;
import com.omoikaneinnovation.hmrsbackend.repository.InsuranceClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.List;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceNominee;
import com.omoikaneinnovation.hmrsbackend.repository.InsuranceNomineeRepository;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceEmployee;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceDependent;

import com.omoikaneinnovation.hmrsbackend.repository.InsuranceEmployeeRepository;
import com.omoikaneinnovation.hmrsbackend.repository.InsuranceDependentRepository;
@Service
public class InsuranceClaimService {

    private final InsuranceClaimRepository repo;
    private final InsurancePolicyRepository policyRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final InsuranceEmployeeRepository insuranceDetailsRepository;
private final InsuranceNomineeRepository nomineeRepository;
private final InsuranceDependentRepository dependentRepository;

    public InsuranceClaimService(
            InsuranceClaimRepository repo,
            InsurancePolicyRepository policyRepo,
            SimpMessagingTemplate messagingTemplate,
             InsuranceEmployeeRepository insuranceDetailsRepository,
      InsuranceNomineeRepository nomineeRepository,
        InsuranceDependentRepository dependentRepository
    ) {
        this.repo = repo;
        this.policyRepo = policyRepo;
         this.messagingTemplate = messagingTemplate;
          this.insuranceDetailsRepository = insuranceDetailsRepository;
 this.nomineeRepository = nomineeRepository;
    this.dependentRepository = dependentRepository;
    }

    public InsuranceClaim createClaim(InsuranceClaim claim) {

        //validateClaim(claim);

        claim.setStatus(InsuranceClaim.Status.SUBMITTED);

        return repo.save(claim);
    }

    public List<InsuranceClaim> getAllClaims() {
        return repo.findAll();
    }

    public InsuranceClaim updateStatus(String id, String status) {
        InsuranceClaim claim = repo.findById(id).orElseThrow();

        try {
          String formatted = status.toUpperCase().replace(" ", "_");
claim.setStatus(InsuranceClaim.Status.valueOf(formatted));
        } catch (Exception e) {
            throw new RuntimeException("Invalid status value: " + status);
        }


       InsuranceClaim saved = repo.save(claim);

    // 🔴 ADD THIS (REAL-TIME PUSH)
    messagingTemplate.convertAndSend("/topic/claims",
            "STATUS_UPDATED:" + saved.getId());
        return repo.save(claim);
    }

    public void validateClaim(InsuranceClaim claim) {

        InsurancePolicy policy = getPolicy(claim.getCompanyId());

        if (claim.getAmount() > policy.getMaxClaimAmount()) {
            throw new RuntimeException("Amount exceeds policy limit");
        }

        if (!policy.getAllowedClaimTypes().contains(claim.getClaimType())) {
            throw new RuntimeException("Claim type not allowed");
        }

        if (policy.isHospitalRequired() && claim.getHospitalName() == null) {
            throw new RuntimeException("Hospital details required");
        }

        if (!policy.isTravelAllowed() && claim.getTravelFromDate() != null) {
            throw new RuntimeException("Travel claims not allowed");
        }

        if (claim.getAdmittedDays() > policy.getMaxAdmittedDays()) {
            throw new RuntimeException("Admitted days exceeded");
        }
    }

    public InsurancePolicy getPolicy(String companyId) {
        return policyRepo.findByCompanyId(companyId)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
    }

    public InsuranceClaim updateApprovedAmount(String id, double amount) {
    InsuranceClaim claim = repo.findById(id).orElseThrow();
    claim.setApprovedAmount(amount);
    return repo.save(claim);
}

public InsuranceEmployee saveEmployeeDetails(
         InsuranceEmployee details){

    return insuranceDetailsRepository.save(details);
}
public InsuranceNominee saveNominee(
        InsuranceNominee nominee) {

    return nomineeRepository.save(nominee);
}

public List<InsuranceDependent> getDependents(
        String employeeCode) {

    return dependentRepository
            .findByEmployeeCode(employeeCode);
}

public String renewPolicy(String employeeCode) {
    return "Policy renewed successfully";
}
}