package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.InsuranceClaim;
import com.omoikaneinnovation.hmrsbackend.service.InsuranceClaimService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
    import com.omoikaneinnovation.hmrsbackend.model.InsuranceDetails;
import com.omoikaneinnovation.hmrsbackend.model.Nominee;
import com.omoikaneinnovation.hmrsbackend.model.Dependent;
@RestController
@RequestMapping("/api/insurance")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
public class InsuranceClaimController {

    private final InsuranceClaimService service;

    public InsuranceClaimController(InsuranceClaimService service){
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
    public List<InsuranceClaim> getAllClaims(){
        return service.getAllClaims();
    }

   @PutMapping("/status/{id}")
    public InsuranceClaim updateStatus(@PathVariable String id, @RequestParam String status){
        return service.updateStatus(id,status);
    }

    @PutMapping("/amount/{id}")
public InsuranceClaim updateAmount(@PathVariable String id, @RequestParam double amount){
    return service.updateApprovedAmount(id, amount);
}

@PostMapping("/employee-details")
public InsuranceDetails saveEmployeeDetails(
        @RequestBody InsuranceDetails details) {
 System.out.println("EMPLOYEE DETAILS API HIT");
    return service.saveInsuranceDetails(details);
}

@PostMapping("/nominee")
public Nominee saveNominee(
        @RequestBody Nominee nominee) {

    return service.saveNominee(nominee);
}


@PostMapping("/renew/{employeeCode}")
public String renewPolicy(
        @PathVariable String employeeCode) {

    return service.renewPolicy(employeeCode);
}
}