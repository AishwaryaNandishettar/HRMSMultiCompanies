package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.repository.LeaveRepository;
import com.omoikaneinnovation.hmrsbackend.model.LeaveRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

 public String applyLeave(LeaveRequest request){

    System.out.println("USER ID BEFORE SAVE 👉 " + request.getUserId());

    if(request.getUserId() == null || request.getUserId().isEmpty()){
        throw new RuntimeException("UserId is missing!");
    }

    request.setStatus("PENDING");

    if(request.getEmployeeName() == null){
        request.setEmployeeName("Unknown");
    }

    leaveRepository.save(request);

    // ✅ Send email notification to manager (if email exists and mailSender available)
    if (request.getManagerEmail() != null && !request.getManagerEmail().isEmpty()
            && !request.getManagerEmail().equals("-")
            && mailSender != null) {
        try {
            sendLeaveApplicationEmail(request);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send manager notification email: " + e.getMessage());
        }
    }

    return "Leave Applied Successfully";
}

   public List<LeaveRequest> myLeaves(String userId){
    List<LeaveRequest> all = leaveRepository.findAll();

    return all.stream()
        .filter(l -> userId.equals(String.valueOf(l.getUserId())))
        .toList();
}
    public String updateLeaveStatus(String leaveId, String status){

        LeaveRequest leave = leaveRepository.findById(leaveId).orElse(null);

        if(leave == null){
            return "Leave not found";
        }

        leave.setStatus(status);

        leaveRepository.save(leave);

        return "Leave status updated";
    }

public List<LeaveRequest> getLeavesByManager(String managerEmail) {
    return leaveRepository.findByManagerEmail(managerEmail);
}
    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public LeaveRequest updateLeaveStatusById(String id, String status) {
        LeaveRequest leave = leaveRepository.findById(id).orElseThrow();
        leave.setStatus(status);
        LeaveRequest saved = leaveRepository.save(leave);

        // ✅ Send email notification to employee after status update
        if (leave.getEmployeeEmail() != null && !leave.getEmployeeEmail().isEmpty()
                && !leave.getEmployeeEmail().equals("-")
                && mailSender != null) {
            try {
                sendLeaveStatusUpdateEmail(leave, status);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send employee notification email: " + e.getMessage());
            }
        }

        return saved;
    }

    // ✅ Email template: Notify manager when leave is applied
    private void sendLeaveApplicationEmail(LeaveRequest leave) throws Exception {
        String subject = "Leave Request - " + leave.getEmployeeName();
        String body = "Dear Manager,\n\n"
                + leave.getEmployeeName() + " has applied for " + leave.getLeaveType() + " leave.\n\n"
                + "Details:\n"
                + "━━━━━━━━━━━━━━━━━━\n"
                + "Leave Type: " + leave.getLeaveType() + "\n"
                + "From: " + leave.getStartDate() + "\n"
                + "To: " + leave.getEndDate() + "\n"
                + "Reason: " + leave.getReason() + "\n\n"
                + "Please review and approve/reject this request from the HRMS Leave Management panel.\n\n"
                + "Best regards,\n"
                + "HRMS Team";

        sendEmail(leave.getManagerEmail(), leave.getCcEmail(), subject, body);
    }

    // ✅ Email template: Notify employee when leave status changes
    private void sendLeaveStatusUpdateEmail(LeaveRequest leave, String newStatus) throws Exception {
        String subject;
        String body;
        String name = leave.getEmployeeName() != null ? leave.getEmployeeName() 
                : leave.getEmployeeEmail().split("@")[0];

        if ("APPROVED".equalsIgnoreCase(newStatus)) {
            subject = "Leave Approved - " + leave.getLeaveType();
            body = "Dear " + name + ",\n\n"
                    + "Good news! ✅\n\n"
                    + "Your " + leave.getLeaveType() + " leave request has been APPROVED.\n\n"
                    + "Details:\n"
                    + "━━━━━━━━━━━━━━━━━━\n"
                    + "Leave Type: " + leave.getLeaveType() + "\n"
                    + "From: " + leave.getStartDate() + "\n"
                    + "To: " + leave.getEndDate() + "\n\n"
                    + "Enjoy your time off!\n\n"
                    + "Best regards,\n"
                    + "HR Team";
        } else if ("REJECTED".equalsIgnoreCase(newStatus)) {
            subject = "Leave Request Update - " + leave.getLeaveType();
            body = "Dear " + name + ",\n\n"
                    + "We regret to inform you that your " + leave.getLeaveType() + " leave request has been REJECTED.\n\n"
                    + "Details:\n"
                    + "━━━━━━━━━━━━━━━━━━\n"
                    + "Leave Type: " + leave.getLeaveType() + "\n"
                    + "From: " + leave.getStartDate() + "\n"
                    + "To: " + leave.getEndDate() + "\n\n"
                    + "Please reach out to your manager for more details.\n\n"
                    + "Best regards,\n"
                    + "HR Team";
        } else {
            subject = "Leave Status Updated - " + leave.getLeaveType();
            body = "Dear " + name + ",\n\n"
                    + "Your leave request status has been updated to: " + newStatus + ".\n\n"
                    + "Details:\n"
                    + "━━━━━━━━━━━━━━━━━━\n"
                    + "Leave Type: " + leave.getLeaveType() + "\n"
                    + "From: " + leave.getStartDate() + "\n"
                    + "To: " + leave.getEndDate() + "\n\n"
                    + "Best regards,\n"
                    + "HR Team";
        }

        sendEmail(leave.getEmployeeEmail(), leave.getCcEmail(), subject, body);
    }

    // ✅ Generic email sender with CC support
    private void sendEmail(String to, String cc, String subject, String body) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        
        helper.setTo(to);
        
        if (cc != null && !cc.isEmpty() && !cc.equals("-")) {
            helper.setCc(cc);
        }
        
        helper.setSubject(subject);
        helper.setText(body);
        
        mailSender.send(message);

        System.out.println("✅ Email sent to " + to + " (CC: " + cc + ") for: " + subject);
    }
}