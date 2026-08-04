package com.omoikaneinnovation.hmrsbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "insurance_employees")
public class InsuranceEmployee {

    @Id
    private String id;

    private String employeeCode;
    private String employeeName;
    private String department;
    private String designation;
    private String email;
    private String phone;
}