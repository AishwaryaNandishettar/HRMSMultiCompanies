package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leave_policy")
public class LeavePolicy {

    @Id
    private String id;

    private int monthly;
    private int carry;

    // getters & setters
}