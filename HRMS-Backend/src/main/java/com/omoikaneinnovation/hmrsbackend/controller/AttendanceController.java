package com.omoikaneinnovation.hmrsbackend.controller;
import com.omoikaneinnovation.hmrsbackend.dto.AttendanceDTO;
import com.omoikaneinnovation.hmrsbackend.model.Attendance;
import com.omoikaneinnovation.hmrsbackend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/checkin")
    public String checkIn(@RequestBody Map<String,String> payload){
        String userId = payload.get("userId");
        return attendanceService.checkIn(userId, payload);
    }

    @PostMapping("/checkout")
    public String checkOut(@RequestBody Map<String,String> payload){
        String userId = payload.get("userId");
        String date = payload.get("date");
        
        return attendanceService.checkOut(userId, date, payload);
    }



@GetMapping("/manager")
public List<AttendanceDTO> getManagerAttendance(@RequestParam String email) {
    return attendanceService.getManagerAttendance(email);
}

@GetMapping("/attendance/{userId}")
public List<Attendance> getByUser(@PathVariable String userId) {
    return attendanceService.getByUserId(userId);
}

    @GetMapping("/my/{userId}")
    public List<AttendanceDTO> myAttendance(@PathVariable String userId){

        return attendanceService.getMyAttendance(userId);
    }

    @GetMapping("/all")
    public List<AttendanceDTO> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable String id) {
        return attendanceService.deleteAttendance(id);
    }

    /**
     * Manager can update/edit attendance for their team members
     * This allows managers to mark absent employees as present
     */
    @PutMapping("/manager-edit")
    public String managerEditAttendance(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String date = payload.get("date");
        String status = payload.get("status");
        String checkIn = payload.get("checkIn");
        String checkOut = payload.get("checkOut");
        String managerEmail = payload.get("managerEmail");
        
        return attendanceService.managerEditAttendance(userId, date, status, checkIn, checkOut, managerEmail);
    }
    
    /**
     * Backfill missing empId data in all attendance records
     * This ensures timesheet shows correct EMP IDs after page refresh
     */
    @PostMapping("/backfill-empids")
    public String backfillEmpIds() {
        return attendanceService.backfillAttendanceData();
    }
}