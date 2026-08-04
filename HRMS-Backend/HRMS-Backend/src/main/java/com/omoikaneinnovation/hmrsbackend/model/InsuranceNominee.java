package com.omoikaneinnovation.hmrsbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "insurance_nominees")
public class InsuranceNominee {

    @Id
    private String id;

    private String employeeCode;
    private String nomineeName;
    private String relationship;
    private String phoneNumber;
}