package com.omoikaneinnovation.hmrsbackend.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
@Data
public class ProfileResponse {

    private String employeeId;
    private String name;
    private String department;

    private String managerId;
    private String managerName;
}