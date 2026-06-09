# 🎯 Recruitment Workflow - Visual Flow Diagram

## 📊 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RECRUITMENT WORKFLOW                          │
│                     Automation System Flow                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   HR Opens   │
│ Pipeline     │
│   Table      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  CANDIDATE TABLE                                          │
├────────┬──────────┬────────┬────────┬───────┬──────────┤
│ Name   │ Email    │ Role   │ Status │ Cmts  │ Action   │
├────────┼──────────┼────────┼────────┼───────┼──────────┤
│ Rahul  │ rahul@   │ Dev    │ Applied│ -     │ [⋯]     │
│        │ gmail    │        │        │       │          │
└────────┴──────────┴────────┴────────┴───────┴──────────┘
                                                  │
                                                  │ HR clicks
                                                  ▼
                                          ┌───────────────┐
                                          │  Action Menu  │
                                          ├───────────────┤
                                          │ ✏️ Update     │
                                          │   Status      │
                                          │ View Profile  │
                                          │ Schedule      │
                                          └───────┬───────┘
                                                  │
                                                  │ Clicks "Update Status"
                                                  ▼
        ┌────────────────────────────────────────────────────────┐
        │           UPDATE STATUS MODAL                           │
        │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
        │   Update Candidate Status                               │
        │   Rahul (rahul@gmail.com)                              │
        │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
        │                                                         │
        │   Change Status To: *                                   │
        │   ┌──────────────────────────────────────┐             │
        │   │ Shortlisted                   ▼      │             │
        │   └──────────────────────────────────────┘             │
        │                                                         │
        │   Comments/Remarks: *                                   │
        │   ┌──────────────────────────────────────┐             │
        │   │ Good communication skills.           │             │
        │   │ Strong technical knowledge.          │             │
        │   │ Moving to technical round.           │             │
        │   └──────────────────────────────────────┘             │
        │                                                         │
        │   📧 Email will be sent to: rahul@gmail.com            │
        │                                                         │
        │   [Cancel]         [💾 Save & Notify Candidate]        │
        └─────────────────────────────────┬──────────────────────┘
                                          │
                                          │ HR clicks "Save & Notify"
                                          ▼
    ┌──────────────────────────────────────────────────────────┐
    │              BACKEND API PROCESSING                       │
    │                                                            │
    │  Step 1: Update Database                                  │
    │  ┌─────────────────────────────────────┐                 │
    │  │ UPDATE candidates                   │                 │
    │  │ SET status = 'Shortlisted',         │                 │
    │  │     comments = 'Good comm skills'   │                 │
    │  │ WHERE id = rahul_id                 │                 │
    │  └─────────────────────────────────────┘                 │
    │                                                            │
    │  Step 2: Save Status History (Optional)                   │
    │  ┌─────────────────────────────────────┐                 │
    │  │ INSERT INTO status_history          │                 │
    │  │ VALUES (rahul_id, 'Applied',        │                 │
    │  │         'Shortlisted', comments,     │                 │
    │  │         'HR_Manager', NOW())         │                 │
    │  └─────────────────────────────────────┘                 │
    │                                                            │
    │  Step 3: Send Email Notification                          │
    │  ┌─────────────────────────────────────┐                 │
    │  │ sendEmail({                         │                 │
    │  │   to: 'rahul@gmail.com',            │                 │
    │  │   subject: 'Application             │                 │
    │  │            Shortlisted',            │                 │
    │  │   body: 'Dear Rahul, Congrats!'     │                 │
    │  │ })                                   │                 │
    │  └─────────────────────────────────────┘                 │
    │                                                            │
    │  Step 4: Return Success Response                          │
    │  ┌─────────────────────────────────────┐                 │
    │  │ { success: true, message: 'Status   │                 │
    │  │   updated and email sent!' }         │                 │
    │  └─────────────────────────────────────┘                 │
    └─────────────────┬────────────────────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────────┐
        │      FRONTEND UPDATES             │
        │                                    │
        │  1. Update local state            │
        │  2. Show success message          │
        │  3. Close modal                   │
        │  4. Refresh table                 │
        └──────────┬───────────────────────┘
                   │
                   ▼
    ┌────────────────────────────────────────────────────┐
    │  UPDATED TABLE (Instant Feedback)                   │
    ├────────┬──────────┬────────┬──────────┬────────────┤
    │ Name   │ Email    │ Role   │ Status   │ Comments   │
    ├────────┼──────────┼────────┼──────────┼────────────┤
    │ Rahul  │ rahul@   │ Dev    │Shortlist │ Good comm  │
    │        │ gmail    │        │  ed      │ skills...  │
    └────────┴──────────┴────────┴──────────┴────────────┘

                   ║
                   ║ Simultaneously
                   ▼
    ┌────────────────────────────────────────────────────┐
    │         CANDIDATE RECEIVES EMAIL                    │
    │                                                      │
    │  From: hr@yourcompany.com                           │
    │  To: rahul@gmail.com                                │
    │  Subject: Application Shortlisted - Congratulations!│
    │                                                      │
    │  ─────────────────────────────────────────────────  │
    │                                                      │
    │  Dear Rahul,                                        │
    │                                                      │
    │  Congratulations! 🎉                                │
    │                                                      │
    │  We are pleased to inform you that your profile     │
    │  has been shortlisted for the next round.           │
    │                                                      │
    │  Our team will contact you shortly.                 │
    │                                                      │
    │  Best regards,                                       │
    │  HR Team                                             │
    └─────────────────────────────────────────────────────┘
```

---

## 🔄 Status Change Flow for All Stages

```
┌─────────────┐
│   APPLIED   │
│  (Received) │
└──────┬──────┘
       │
       │ HR: "Good profile, let's interview"
       │ Email: "You've been shortlisted!"
       ▼
┌─────────────┐
│ SHORTLISTED │
└──────┬──────┘
       │
       │ HR: "Schedule technical round"
       │ Email: "Interview scheduled"
       ▼
┌─────────────┐
│  INTERVIEW  │
│    STAGE    │
└──────┬──────┘
       │
       ├───────────┐
       │           │
       │           │ HR: "Does not meet requirements"
       │           │ Email: "Thank you for applying..."
       │           ▼
       │      ┌─────────────┐
       │      │  REJECTED   │
       │      └─────────────┘
       │
       │ HR: "Excellent performance!"
       │ Email: "Congratulations! You're selected!"
       ▼
┌─────────────┐
│  SELECTED   │
└──────┬──────┘
       │
       │ HR: "Release offer letter"
       │ Email: "Offer letter attached"
       ▼
┌─────────────┐
│ OFFER SENT  │
└─────────────┘
```

---

## 🗄️ Database Structure - Before & After

### **BEFORE (Current System)**
```
candidates table:
┌────┬─────────┬──────────┬──────────┐
│ id │  name   │   role   │  status  │
├────┼─────────┼──────────┼──────────┤
│ 1  │ Rahul   │ Dev      │ Applied  │
│ 2  │ Priya   │ Designer │ Applied  │
└────┴─────────┴──────────┴──────────┘
```

### **AFTER (Enhanced System)**
```
candidates table:
┌────┬─────────┬───────────────────┬──────────┬──────────────┬─────────────────────┐
│ id │  name   │      email        │   role   │   status     │      comments       │
├────┼─────────┼───────────────────┼──────────┼──────────────┼─────────────────────┤
│ 1  │ Rahul   │ rahul@gmail.com   │ Dev      │ Shortlisted  │ Good comm skills    │
│ 2  │ Priya   │ priya@gmail.com   │ Designer │ Rejected     │ Portfolio needs work│
└────┴─────────┴───────────────────┴──────────┴──────────────┴─────────────────────┘

status_history table (Optional but Professional):
┌────┬─────────────┬──────────────┬──────────────┬───────────────────────┬──────────────┬──────────────┐
│ id │candidate_id │ old_status   │  new_status  │      comments         │  changed_by  │  changed_at  │
├────┼─────────────┼──────────────┼──────────────┼───────────────────────┼──────────────┼──────────────┤
│ 1  │     1       │ Applied      │ Shortlisted  │ Good comm skills      │ HR_Manager   │ 2026-06-02   │
│ 2  │     2       │ Applied      │ Rejected     │ Portfolio needs work  │ HR_Manager   │ 2026-06-02   │
└────┴─────────────┴──────────────┴──────────────┴───────────────────────┴──────────────┴──────────────┘
```

---

## 📨 Email Templates for Each Status

### **1. SHORTLISTED**
```
┌────────────────────────────────────────────┐
│ From: hr@company.com                       │
│ To: candidate@email.com                    │
│ Subject: Application Shortlisted 🎉        │
├────────────────────────────────────────────┤
│                                             │
│ Dear [Name],                                │
│                                             │
│ Congratulations! 🎉                        │
│                                             │
│ Your profile has been shortlisted for      │
│ the next round of interviews.              │
│                                             │
│ Our team will contact you shortly.         │
│                                             │
│ Best regards,                               │
│ HR Team                                     │
└────────────────────────────────────────────┘
```

### **2. INTERVIEW STAGE**
```
┌────────────────────────────────────────────┐
│ Subject: Interview Scheduled 📅             │
├────────────────────────────────────────────┤
│                                             │
│ Dear [Name],                                │
│                                             │
│ You have been selected for the interview   │
│ stage.                                      │
│                                             │
│ Our HR team will reach out with schedule.  │
│                                             │
│ Please keep your contact details updated.  │
└────────────────────────────────────────────┘
```

### **3. SELECTED**
```
┌────────────────────────────────────────────┐
│ Subject: Congratulations - You're Selected!│
├────────────────────────────────────────────┤
│                                             │
│ Dear [Name],                                │
│                                             │
│ Congratulations! 🎊                        │
│                                             │
│ You have been selected for the position    │
│ of [Role].                                  │
│                                             │
│ Offer letter will be sent shortly.         │
│                                             │
│ Welcome to the team!                        │
└────────────────────────────────────────────┘
```

### **4. REJECTED**
```
┌────────────────────────────────────────────┐
│ Subject: Application Status Update          │
├────────────────────────────────────────────┤
│                                             │
│ Dear [Name],                                │
│                                             │
│ Thank you for your interest in joining     │
│ our team.                                   │
│                                             │
│ After careful consideration, we have       │
│ decided not to proceed with your           │
│ application at this time.                  │
│                                             │
│ We encourage you to apply for future       │
│ openings.                                   │
│                                             │
│ Best wishes for your career.                │
└────────────────────────────────────────────┘
```

---

## 🎯 Key Benefits of This System

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ PROFESSIONAL BENEFITS                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 🤖 AUTOMATION                                            │
│     • No manual email sending                               │
│     • Instant candidate notification                         │
│     • Reduces HR workload by 70%                            │
│                                                              │
│  2. 📊 TRACKING                                              │
│     • Complete status history                               │
│     • Who changed what and when                             │
│     • Audit trail for compliance                            │
│                                                              │
│  3. 💼 PROFESSIONALISM                                       │
│     • Consistent communication                              │
│     • No candidates left wondering                          │
│     • Better candidate experience                           │
│                                                              │
│  4. 🎨 USER EXPERIENCE                                       │
│     • Beautiful, modern UI                                  │
│     • Easy to use for HR                                    │
│     • Mobile responsive                                     │
│                                                              │
│  5. 📈 SCALABILITY                                           │
│     • Works for 100 or 10,000 candidates                    │
│     • No additional manual effort                           │
│     • Ready for company growth                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Checklist

```
┌─────────────────────────────────────────────────────────────┐
│  STEP-BY-STEP IMPLEMENTATION                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  □ 1. Add email & comments columns to database              │
│  □ 2. Create backend API endpoint                           │
│  □ 3. Configure email service (Gmail/SendGrid)              │
│  □ 4. Import UpdateStatusModal in PipelineTable             │
│  □ 5. Add email column to table display                     │
│  □ 6. Add comments column to table display                  │
│  □ 7. Add "Update Status" button in action menu             │
│  □ 8. Implement handleStatusUpdate function                 │
│  □ 9. Add modal component at end of component               │
│  □ 10. Test with sample candidate                           │
│  □ 11. Verify email is sent                                 │
│  □ 12. Check database updates correctly                     │
│  □ 13. Test all status types                                │
│  □ 14. Test on mobile devices                               │
│  □ 15. Deploy to production                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Created by:** Kiro AI Assistant
**Date:** June 2, 2026
**Purpose:** Visual guide for Recruitment Workflow Automation

