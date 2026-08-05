import React, { useState } from "react";
import "./UpdateStatusModal.css";

/**
 * UpdateStatusModal Component
 * 
 * Professional modal for HR to update candidate status with comments
 * Automatically sends email notifications to candidates based on status change
 * 
 * Props:
 * - candidate: Current candidate object
 * - onClose: Function to close modal
 * - onSave: Function to save status + comments + send email
 */

export default function UpdateStatusModal({ candidate, onClose, onSave }) {
    console.log("Candidate Data:", candidate);
  const [status, setStatus] = useState(candidate.status || candidate.stage || "Applied");
  const [comments, setComments] = useState("");
  const [email, setEmail] = useState(candidate.email && candidate.email !== "-" ? candidate.email : "");
  const [phone, setPhone] = useState(candidate.phone || ""); // ✅ NEW: Phone state
  const [loading, setLoading] = useState(false);

  // ✅ Email templates for different statuses
  const getEmailTemplate = (statusType) => {
    const templates = {
      "Shortlisted": {
        subject: "Application Shortlisted - Congratulations! 🎉",
        body: `Dear ${candidate.name},

Congratulations! 🎉

We are pleased to inform you that your profile has been shortlisted for the next round of interviews.

Our team will contact you shortly with further details regarding the interview schedule.

Best regards,
HR Team`
      },
      "Interview Stage": {
        subject: "Interview Scheduled - Next Steps 📅",
        body: `Dear ${candidate.name},

Good news! You have been selected for the interview stage.

Our HR team will reach out to you shortly with the interview schedule and other relevant details.

Please keep your phone and email accessible for further communication.

Best regards,
HR Team`
      },
      "Selected": {
        subject: "Congratulations - You're Selected! 🎊",
        body: `Dear ${candidate.name},

Congratulations! 🎊

We are delighted to inform you that you have been selected for the position of ${candidate.role || "the role"}.

Our HR team will contact you shortly with the offer letter and next steps.

Welcome to the team!

Best regards,
HR Team`
      },
      "Rejected": {
        subject: "Application Status Update",
        body: `Dear ${candidate.name},

Thank you for your interest in joining our team and for taking the time to go through the interview process.

After careful consideration, we have decided not to proceed with your application at this time.

We encourage you to apply for future openings that match your profile and wish you all the best in your career endeavors.

Best regards,
HR Team`
      }
    };

    return templates[statusType] || templates["Shortlisted"];
  };

  const handleSave = async () => {
    if (!comments.trim()) {
      alert("Please add comments/remarks before updating status");
      return;
    }

    if (!email.trim()) {
      alert("Please enter the candidate's email address to send the notification");
      return;
    }

    setLoading(true);

    try {
      const emailTemplate = getEmailTemplate(status);

      console.log("📱 Candidate Phone:", phone.trim());
console.log("📧 Candidate Email:", email.trim());
console.log("👤 Assigned To:", candidate.assignedTo);
console.log("📞 Sending phone:", phone.trim());
      // Call parent save function with all data including phone
      await onSave({
        candidateId: candidate.id || candidate._id,
        candidateName: candidate.name,
        candidateEmail: email.trim(),
        candidatePhone: phone.trim(),   // ✅ NEW: Include phone number
        newStatus: status,
        comments: comments.trim(),
        emailSubject: emailTemplate.subject,
        emailBody: emailTemplate.body
      });

      
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-status-overlay" onClick={onClose}>
      <div className="update-status-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3>Update Candidate Status</h3>
            <p className="candidate-info">
              {candidate.name} ({candidate.email || "No email"})
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          
          {/* Status Selection */}
          <div className="form-group">
            <label>Change Status To: *</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              <option value="Applied">Received / Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Stage">Interview Stage</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Candidate Email */}
          <div className="form-group">
            <label>Candidate Email: *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter candidate email (e.g. name@example.com)"
              className="status-select"
              style={{ width: "100%", padding: "8px 12px", fontSize: "14px" }}
            />
          </div>

          {/* ✅ NEW: Candidate Phone */}
          <div className="form-group">
            <label>Candidate Phone: (Optional for WhatsApp/SMS)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number (e.g. 9876543210)"
              className="status-select"
              style={{ width: "100%", padding: "8px 12px", fontSize: "14px" }}
            />
          </div>

          {/* Comments/Remarks */}
          <div className="form-group">
            <label>Comments / Remarks: *</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your remarks here (e.g., Good communication skills, Technical knowledge is strong)"
              rows="5"
              className="comments-textarea"
            />
          </div>

          {/* Email Preview Info */}
          <div className="email-info">
            <div className="info-icon">📧</div>
            <div>
              <strong>Email Notification</strong>
              <p>An automated email will be sent to <strong>{email || "candidate"}</strong> after saving</p>
            </div>
          </div>

          {/* ✅ NEW: SMS/HR Notification Info */}
{/* Candidate SMS Notification */}
<div
  className="email-info"
  style={{
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    marginTop: "12px"
  }}
>
  <div className="info-icon">📱</div>

  <div>
    <strong>Candidate SMS Notification</strong>

    <p>
      SMS notification will be sent to:
    </p>

    <div
      style={{
        marginTop: "6px",
        fontSize: "13px"
      }}
    >
      <span
        style={{
          background: "#dcfce7",
          padding: "4px 8px",
          borderRadius: "6px",
          fontWeight: "600"
        }}
      >
        📞 {candidate?.name}: {phone || "No Phone Number"}
      </span>
    </div>
  </div>
</div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="save-notify-btn" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Sending..." : "📧📱 Send Email & SMS"}
          </button>
        </div>

      </div>
    </div>
  );
}
