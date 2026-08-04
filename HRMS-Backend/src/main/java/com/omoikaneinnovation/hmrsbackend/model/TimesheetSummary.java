package com.omoikaneinnovation.hmrsbackend.model;
import lombok.*;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "timesheet")
public class TimesheetSummary {

    private String empId;
    private String empName;
    private String department;
    private String reportingManager;
    private String month;

    private Integer present;
    private Integer leave;
    private Integer lop;
    private Integer halfDay;
    private Integer late;
    private Integer wfh;
    private Integer field;
    private Integer absent;
    private Integer workingDays;

    private Double avgHours;
    private String approval;

    // Alias methods for backward compatibility
    public Integer getLateCount() {
        return late;
    }
    
    public void setLateCount(Integer lateCount) {
        this.late = lateCount;
    }
    
    public Integer getAbsent() {
        return absent != null ? absent : 0;
    }
    
    public Integer getWorkingDays() {
        return workingDays != null ? workingDays : 30;
    }
}