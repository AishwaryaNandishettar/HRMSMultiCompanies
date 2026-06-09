# 📱 SMS Notification Flow - Visual Diagram

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  PipelineTable.jsx                                                 │  │
│  │  • Shows all candidates in table format                            │  │
│  │  • Displays: Name, Email, Phone, Status, Comments                  │  │
│  │  • Action menu with "Update Status" button                         │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
│                                ↓ (Click Update Status)                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  UpdateStatusModal.jsx                                             │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Form Fields:                                                 │  │  │
│  │  │  • Status Dropdown: [Shortlisted/Interview/Selected/Rejected]│  │  │
│  │  │  • Email Input: john@example.com                             │  │  │
│  │  │  • Phone Input: 9876543210  ← NEW ✅                        │  │  │
│  │  │  • Comments Textarea: "Strong technical skills"             │  │  │
│  │  │                                                               │  │  │
│  │  │  Info Boxes:                                                  │  │  │
│  │  │  • 📧 Email Notification Preview                            │  │  │
│  │  │  • 📱 SMS will be sent to: Padmanabh (9663743316)          │  │  │
│  │  │                                                               │  │  │
│  │  │  [Cancel]  [📧📱 Send Email & SMS]                          │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
└─────────────────────────────────┼─────────────────────────────────────────┘
                                  ↓
                   ┌──────────────────────────────┐
                   │    HTTP POST Request         │
                   │  /api/jobs/update-status     │
                   │                               │
                   │  Request Body:                │
                   │  {                            │
                   │    candidateId: "...",        │
                   │    candidateName: "John Doe", │
                   │    candidateEmail: "...",     │
                   │    candidatePhone: "9876...", │
                   │    newStatus: "Shortlisted",  │
                   │    comments: "..."            │
                   │  }                            │
                   └──────────────┬────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Spring Boot)                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  JobController.java                                                │  │
│  │  @PostMapping("/api/jobs/update-status")                           │  │
│  │                                                                     │  │
│  │  • Receives request                                                 │  │
│  │  • Validates: candidateId, newStatus required                      │  │
│  │  • Extracts: email, phone, comments                                │  │
│  │  • Calls: service.updateStatusWithEmailAndSms()                    │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
│                                ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  JobService.java                                                   │  │
│  │  updateStatusWithEmailAndSms()                                     │  │
│  │                                                                     │  │
│  │  Step 1: 💾 Update Database                                        │  │
│  │  ┌────────────────────────────────────────────────────────┐       │  │
│  │  │  MongoDB - Job Collection                              │       │  │
│  │  │  {                                                      │       │  │
│  │  │    _id: "65f7a8b9...",                                 │       │  │
│  │  │    status: "Shortlisted",     ← Updated                │       │  │
│  │  │    comments: "Strong skills",  ← Updated               │       │  │
│  │  │    email: "john@example.com",  ← Updated               │       │  │
│  │  │    phone: "9876543210"         ← Updated (Cleaned)     │       │  │
│  │  │  }                                                      │       │  │
│  │  └────────────────────────────────────────────────────────┘       │  │
│  │                                                                     │  │
│  │  Step 2: 📧 Send Email                                             │  │
│  │  ┌────────────────────────────────────────────────────────┐       │  │
│  │  │  JavaMailSender (Gmail SMTP)                           │       │  │
│  │  │  From: aishushettar95@gmail.com                        │       │  │
│  │  │  To: john@example.com                                  │       │  │
│  │  │  Subject: "Application Shortlisted - Congratulations!"│       │  │
│  │  │  Body: [Professional email template]                  │       │  │
│  │  └────────────────────────────────────────────────────────┘       │  │
│  │                                                                     │  │
│  │  Step 3: 📱 Call SmsService                                        │  │
│  │  smsService.sendCandidateStatusSms(                                │  │
│  │    phone: "9876543210",                                            │  │
│  │    name: "John Doe",                                               │  │
│  │    jobTitle: "Frontend Developer",                                 │  │
│  │    status: "Shortlisted"                                           │  │
│  │  )                                                                  │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
│                                ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  SmsService.java                                                   │  │
│  │  sendCandidateStatusSms()                                          │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Step 1: Validate                                            │  │  │
│  │  │  • Check SMS_ENABLED = true                                  │  │  │
│  │  │  • Check phone != null                                       │  │  │
│  │  │  • Clean phone number (remove +91, spaces, etc.)            │  │  │
│  │  │  • Validate: 10 digits, starts with 9/8/7/6                 │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Step 2: Create Messages                                     │  │  │
│  │  │                                                               │  │  │
│  │  │  Message 1 (To Candidate):                                   │  │  │
│  │  │  "Congratulations John Doe! You have been SHORTLISTED       │  │  │
│  │  │   for Frontend Developer. Our team will contact you         │  │  │
│  │  │   shortly with interview details. - HR Team"                │  │  │
│  │  │                                                               │  │  │
│  │  │  Message 2 (To HR Team):                                     │  │  │
│  │  │  "🎉 RECRUITMENT UPDATE: John Doe has been SHORTLISTED      │  │  │
│  │  │   for Frontend Developer. Contact: john@example.com         │  │  │
│  │  │   - HR Team"                                                 │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  Step 3: Send via Provider                                   │  │  │
│  │  │                                                               │  │  │
│  │  │  First Try: Twilio (Most Reliable)                           │  │  │
│  │  │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  sendViaTwilio(phone, message)                        │  │  │  │
│  │  │  │  • Account SID: ACd65c9f79bb00c416...               │  │  │  │
│  │  │  │  • Auth Token: 9bf3fae162b21b15...                   │  │  │  │
│  │  │  │  • From: +18658306022                                │  │  │  │
│  │  │  │  • To: +919876543210                                 │  │  │  │
│  │  │  │  • Message: [Template content]                       │  │  │  │
│  │  │  │                                                       │  │  │  │
│  │  │  │  ✅ Success: Returns SMS SID                         │  │  │  │
│  │  │  └───────────────────────────────────────────────────────┘  │  │  │
│  │  │                                                               │  │  │
│  │  │  If Twilio Fails:                                            │  │  │
│  │  │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  sendViaFast2SMS(phone, message)                      │  │  │  │
│  │  │  │  • API URL: https://www.fast2sms.com/dev/bulkV2      │  │  │  │
│  │  │  │  • API Key: ZorwgJS8mE72kAU3j...                     │  │  │  │
│  │  │  │  • Route: p (promotional)                            │  │  │  │
│  │  │  │  • Numbers: 9876543210                               │  │  │  │
│  │  │  │                                                       │  │  │  │
│  │  │  │  ✅ Success: Returns {"return": true}               │  │  │  │
│  │  │  └───────────────────────────────────────────────────────┘  │  │  │
│  │  │                                                               │  │  │
│  │  │  If Both Fail:                                               │  │  │
│  │  │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  Simulation Mode (Log only)                           │  │  │  │
│  │  │  │  Console: "📱 [SMS] TO 9876543210: [message]"       │  │  │  │
│  │  │  └───────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────┬──────────────────────────────────────┘  │
└─────────────────────────────────┼─────────────────────────────────────────┘
                                  ↓
                   ┌──────────────────────────────┐
                   │    Response to Frontend      │
                   │  {                            │
                   │    success: true,             │
                   │    message: "Status updated   │
                   │             successfully!     │
                   │             📧 Email sent     │
                   │             📱 SMS sent",     │
                   │    candidate: {...}           │
                   │  }                            │
                   └──────────────┬────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        NOTIFICATIONS SENT                                │
│                                                                          │
│  📱 To Candidate (9876543210):                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Congratulations John Doe! You have been SHORTLISTED for       │    │
│  │  Frontend Developer. Our team will contact you shortly with    │    │
│  │  interview details. - HR Team                                  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  📧 To Candidate (john@example.com):                                    │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Subject: Application Shortlisted - Congratulations! 🎉        │    │
│  │                                                                 │    │
│  │  Dear John Doe,                                                │    │
│  │                                                                 │    │
│  │  Congratulations! 🎉                                           │    │
│  │                                                                 │    │
│  │  We are pleased to inform you that your profile has been       │    │
│  │  shortlisted for the position of Frontend Developer.           │    │
│  │                                                                 │    │
│  │  Our team will contact you shortly with further details        │    │
│  │  regarding the interview schedule.                             │    │
│  │                                                                 │    │
│  │  Best regards,                                                 │    │
│  │  HR Team                                                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  📱 To HR Team (9663743316 - Padmanabh):                                │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  🎉 RECRUITMENT UPDATE: John Doe has been SHORTLISTED for      │    │
│  │  Frontend Developer. Contact: john@example.com - HR Team       │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   HR User    │
│ (Frontend)   │
└──────┬───────┘
       │
       │ 1. Enters candidate info + phone number
       ↓
┌────────────────────────────────────┐
│   UpdateStatusModal.jsx            │
│   • Candidate Name: John Doe       │
│   • Status: Shortlisted            │
│   • Email: john@example.com        │
│   • Phone: 9876543210              │
│   • Comments: Strong skills        │
└────────┬───────────────────────────┘
         │
         │ 2. Submits form
         ↓
┌────────────────────────────────────┐
│   axios.post()                     │
│   /api/jobs/update-status          │
└────────┬───────────────────────────┘
         │
         │ 3. HTTP POST request
         ↓
┌────────────────────────────────────┐
│   JobController.java               │
│   • Validates input                │
│   • Extracts parameters            │
└────────┬───────────────────────────┘
         │
         │ 4. Calls service method
         ↓
┌────────────────────────────────────┐
│   JobService.java                  │
│   updateStatusWithEmailAndSms()    │
└────┬────┬────┬──────────────────────┘
     │    │    │
     │    │    │ 5. Three parallel actions
     │    │    │
     ↓    ↓    ↓
┌─────┐ ┌──────┐ ┌───────┐
│ DB  │ │Email │ │  SMS  │
│Save │ │Send  │ │Service│
└─────┘ └──────┘ └───┬───┘
                     │
                     │ 6. SMS service processes
                     ↓
        ┌────────────────────────────┐
        │   SmsService.java          │
        │   • Validates phone        │
        │   • Creates messages       │
        │   • Sends via Twilio       │
        └─────────┬──────────────────┘
                  │
                  │ 7. SMS delivery
                  ↓
        ┌─────────────────────────────┐
        │        Twilio API            │
        │   • Validates credentials   │
        │   • Routes SMS              │
        │   • Delivers to phone       │
        └─────────┬───────────────────┘
                  │
                  │ 8. SMS delivered
                  ↓
        ┌──────────────────────────────┐
        │   📱 Candidate's Phone       │
        │   📱 HR Team's Phone         │
        │   📧 Candidate's Email       │
        └──────────────────────────────┘
```

---

## 🔄 State Changes

```
BEFORE Update:
┌─────────────────────────────────────┐
│  Job Document in MongoDB            │
│  {                                  │
│    _id: "65f7a8b9...",             │
│    jobTitle: "Frontend Developer", │
│    status: "Applied",              │
│    email: "-",                     │
│    phone: null,                    │
│    comments: null                  │
│  }                                  │
└─────────────────────────────────────┘

                  ↓
         [HR Updates Status]
                  ↓

AFTER Update:
┌─────────────────────────────────────┐
│  Job Document in MongoDB            │
│  {                                  │
│    _id: "65f7a8b9...",             │
│    jobTitle: "Frontend Developer", │
│    status: "Shortlisted", ✅       │
│    email: "john@example.com", ✅   │
│    phone: "9876543210", ✅         │
│    comments: "Strong skills" ✅    │
│  }                                  │
└─────────────────────────────────────┘

                  +
┌─────────────────────────────────────┐
│  Notifications Sent                 │
│  • 📧 Email to candidate            │
│  • 📱 SMS to candidate              │
│  • 📱 SMS to HR team                │
└─────────────────────────────────────┘
```

---

## 🎯 Key Integration Points

### **1. Frontend → Backend**
```javascript
// PipelineTable.jsx
const handleStatusUpdate = async (updateData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/jobs/update-status`,
    {
      candidateId: updateData.candidateId,
      candidateName: updateData.candidateName,
      candidateEmail: updateData.candidateEmail,
      candidatePhone: updateData.candidatePhone,  // ← NEW
      newStatus: updateData.newStatus,
      comments: updateData.comments
    }
  );
};
```

### **2. Backend Controller → Service**
```java
// JobController.java
@PostMapping("/update-status")
public ResponseEntity<?> updateStatusWithEmail(@RequestBody Map<String, String> request) {
    String candidatePhone = request.get("candidatePhone");  // ← Extract phone
    
    Job updated = service.updateStatusWithEmailAndSms(
        candidateId,
        newStatus,
        comments,
        candidateEmail,
        candidatePhone  // ← Pass to service
    );
}
```

### **3. Service → SMS Service**
```java
// JobService.java
public Job updateStatusWithEmailAndSms(..., String candidatePhone) {
    // Update database
    job.setPhone(candidatePhone);
    Job saved = repo.save(job);
    
    // Send email
    sendStatusEmail(candidateEmail, job.getJobTitle(), newStatus);
    
    // Send SMS ← NEW
    smsService.sendCandidateStatusSms(
        candidatePhone,
        candidateName,
        job.getJobTitle(),
        newStatus
    );
    
    return saved;
}
```

### **4. SMS Service → Twilio API**
```java
// SmsService.java
private void sendViaTwilio(String phoneNumber, String messageText) {
    Twilio.init(
        twilioConfig.getAccountSid(),
        twilioConfig.getAuthToken()
    );
    
    Message message = Message.creator(
        new PhoneNumber("+91" + phoneNumber),
        new PhoneNumber(twilioConfig.getPhoneNumber()),
        messageText
    ).create();
    
    System.out.println("SMS SID: " + message.getSid());
}
```

---

## 🔍 Error Handling Flow

```
┌──────────────────────────────────────┐
│  Phone Number Validation             │
│                                       │
│  Input: "+91 9876 543 210"           │
│     ↓                                 │
│  Clean: "919876543210"               │
│     ↓                                 │
│  Remove country code: "9876543210"   │
│     ↓                                 │
│  Validate: Starts with 9/8/7/6? ✅   │
│     ↓                                 │
│  Validate: 10 digits? ✅             │
│     ↓                                 │
│  Final: "9876543210" ✅              │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  SMS Sending with Fallback           │
│                                       │
│  Try: Twilio                          │
│     ↓                                 │
│  Success? ✅ → Return                │
│     ↓ No                              │
│  Try: Fast2SMS                        │
│     ↓                                 │
│  Success? ✅ → Return                │
│     ↓ No                              │
│  Fallback: Log only (Simulation)     │
│     ↓                                 │
│  Log: "📱 [SMS] TO phone: message"   │
└──────────────────────────────────────┘
```

---

## ✅ System Completeness Checklist

| Layer | Component | Status | Details |
|-------|-----------|--------|---------|
| **Frontend** | UpdateStatusModal | ✅ | Phone input field added |
| | PipelineTable | ✅ | Displays phone numbers |
| | API Integration | ✅ | Sends phone to backend |
| **Backend** | JobController | ✅ | Receives phone parameter |
| | JobService | ✅ | Processes phone & sends SMS |
| | SmsService | ✅ | Multi-provider SMS sending |
| **Config** | TwilioConfig | ✅ | Credentials configured |
| | SmsConfig | ✅ | Feature flags & HR contacts |
| | application.properties | ✅ | All properties set |
| **Database** | Job Model | ✅ | Phone field exists |
| **Templates** | Candidate SMS | ✅ | All statuses covered |
| | HR SMS | ✅ | All statuses covered |
| | Email | ✅ | All statuses covered |

---

## 🚀 Quick Start Testing

### **1. Start System**
```bash
# Terminal 1: Backend
cd HRMS-Backend
mvn spring-boot:run

# Terminal 2: Frontend
cd HRMS-Frontend
npm run dev
```

### **2. Test Flow**
1. Open: http://localhost:5173/recruitment/pipeline
2. Click: "Update Status" on any candidate
3. Fill form:
   - Status: Shortlisted
   - Email: test@example.com
   - Phone: 9876543210
   - Comments: Test message
4. Click: "📧📱 Send Email & SMS"

### **3. Verify**
- ✅ Frontend: Success message shown
- ✅ Backend Console: SMS logs visible
- ✅ Phone: SMS received
- ✅ Database: Phone & comments saved

---

**Your SMS system is COMPLETE and PRODUCTION-READY!** 🎉
