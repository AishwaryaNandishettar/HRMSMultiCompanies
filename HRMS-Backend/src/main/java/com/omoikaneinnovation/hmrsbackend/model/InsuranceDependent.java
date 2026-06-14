package com.omoikaneinnovation.hmrsbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "insurance_dependents")
public class InsuranceDependent {

    @Id
    private String id;

    private String employeeCode;
    private String dependentName;
    private String relationship;
    private int age;
}