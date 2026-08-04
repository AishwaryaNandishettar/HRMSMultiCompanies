package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.InsuranceClaim;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceEmployee;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceNominee;
import com.omoikaneinnovation.hmrsbackend.service.InsuranceClaimService;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceDependent;
import org.springframework.web.bind.annotation.*;
import com.omoikaneinnovation.hmrsbackend.model.InsuranceEmployee;
import java.util.List;

@RestController
@RequestMapping("/api/insurance")
@CrossOrigin(originPatterns = {
        "http://localhost:*",
        "https://*.ngrok-free.dev"
})
public class InsuranceClaimController {

    private final InsuranceClaimService service;

    public InsuranceClaimController(InsuranceClaimService service) {
        this.service = service;
        System.out.println("InsuranceClaimController Loaded");
    }

    @PostMapping("/create")
    public InsuranceClaim createClaim(@RequestBody InsuranceClaim claim) {
        try {
            return service.createClaim(claim);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/all")
    public List<InsuranceClaim> getAllClaims() {
        return service.getAllClaims();
    }

    @PutMapping("/status/{id}")
    public InsuranceClaim updateStatus(
            @PathVariable String id,
            @RequestParam String status) {

        return service.updateStatus(id, status);
    }

    @PutMapping("/amount/{id}")
    public InsuranceClaim updateAmount(
            @PathVariable String id,
            @RequestParam double amount) {

        return service.updateApprovedAmount(id, amount);
    }

  @PostMapping("/employee-details")
public InsuranceEmployee saveEmployeeDetails(
        @RequestBody InsuranceEmployee details) {

    System.out.println("EMPLOYEE DETAILS API HIT");
    return service.saveEmployeeDetails(details);
}

 @PostMapping("/nominee")
public InsuranceNominee saveNominee(
        @RequestBody InsuranceNominee nominee) {

    return service.saveNominee(nominee);
}
@GetMapping("/dependents/{employeeCode}")
public List<InsuranceDependent> getDependents(
        @PathVariable String employeeCode) {

    return service.getDependents(employeeCode);
}

  
}