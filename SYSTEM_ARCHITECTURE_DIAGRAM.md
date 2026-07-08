# 🏗️ System Architecture - Internal Job Notification System

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN/MANAGER                                │
│                                                                     │
│  Opens Recruitment Dashboard → Clicks "+ Post Job"                 │
│                                                                     │
│  Fills Job Form:                                                   │
│  ┌───────────────────────────────────────────┐                    │
│  │ Job Title: DevOps Engineer                │                    │
│  │ Department: Engineering                    │                    │
│  │ Status: Open  ← TRIGGERS NOTIFICATION     │                    │
│  │ Experience: 3-5 years                      │                    │
│  │ Location: Bangalore                        │                    │
│  │ Description: [Full description]            │                    │
│  └───────────────────────────────────────────┘                    │
│                                                                     │
│  Clicks [Post Job]                                                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                                │
│                                                                     │
│  PostJobForm.jsx                                                   │
│  ├─ Validates form data                                            │
│  ├─ Calls API: POST /api/jobs/create                              │
│  └─ Sends job object with all fields                              │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Spring Boot)                           │
│                                                                     │
│  JobController.createJob()                                         │
│  ├─ Receives job data                                              │
│  ├─ Calls JobService.createJob()                                   │
│  ├─ Saves job to MongoDB                                           │
│  ├─ Checks if status == "Open"                                     │
│  └─ If Yes → Trigger notifications                                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│              JobNotificationService                                 │
│                                                                     │
│  notifyEmployeesAboutNewJob(job)                                   │
│  ├─ Query MongoDB for all employees                                │
│  ├─ Filter: Status = "ACTIVE" & Email exists                       │
│  ├─ For each employee:                                             │
│  │   ├─ Build professional email body                              │
│  │   ├─ Include all job details                                    │
│  │   ├─ Send via JavaMailSender (Gmail SMTP)                       │
│  │   └─ Log success/failure                                        │
│  └─ Return summary (success count, fail count)                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    EMAIL DELIVERY                                   │
│                                                                     │
│  Gmail SMTP Server                                                 │
│  ├─ From: aishushettar95@gmail.com                                 │
│  ├─ To: employee@company.com                                       │
│  ├─ Subject: 🆕 New Job Opening: DevOps Engineer                   │
│  └─ Body: Professional formatted email                             │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    EMPLOYEES RECEIVE EMAIL                          │
│                                                                     │
│  📧 Inbox                                                           │
│  ┌──────────────────────────────────────────────────┐             │
│  │ From: HR Team <aishushettar95@gmail.com>         │             │
│  │ Subject: 🆕 New Job Opening: DevOps Engineer     │             │
│  │                                                   │             │
│  │ Dear John Doe,                                   │             │
│  │                                                   │             │
│  │ Great news! A new position is now open...       │             │
│  │                                                   │             │
│  │ 📋 Job Details:                                  │             │
│  │ • Position: DevOps Engineer                      │             │
│  │ • Department: Engineering                        │             │
│  │ • Location: Bangalore                            │             │
│  │ ...                                              │             │
│  └──────────────────────────────────────────────────┘             │
│                                                                     │
│  Employee logs into HRMS to view more details                      │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                EMPLOYEE VIEWS INTERNAL JOB BOARD                    │
│                                                                     │
│  Logs into HRMS → Clicks "💼 Internal Jobs" in sidebar             │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                                │
│                                                                     │
│  InternalJobs.jsx                                                  │
│  ├─ Calls API: GET /api/jobs/open                                  │
│  ├─ Receives list of open jobs                                     │
│  ├─ Displays job cards with:                                       │
│  │   ├─ 🆕 NEW badge (if posted < 7 days)                          │
│  │   ├─ Job title, ID, department                                  │
│  │   ├─ Location, work mode, experience                            │
│  │   ├─ Short description                                          │
│  │   └─ [View Details] [Apply Now] buttons                        │
│  ├─ Provides search box                                            │
│  ├─ Provides department filters                                    │
│  └─ Opens modal on "View Details" click                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────────┐
│              EMPLOYEE APPLIES FOR JOB                               │
│                                                                     │
│  Clicks [Apply Now]                                                │
│  → Shows placeholder message (feature coming soon)                  │
│  → Employee contacts HR directly for now                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Data Flow

### **1. Job Creation Flow**

```
User Input
    ↓
Frontend Validation
    ↓
API Call: POST /api/jobs/create
    ↓
Backend Controller (JobController)
    ↓
Service Layer (JobService)
    ↓
MongoDB (jobs collection)
    ↓
Check Status == "Open"?
    ↓ Yes
JobNotificationService
    ↓
Email Service (JavaMailSender)
    ↓
SMTP Server (Gmail)
    ↓
Employee Inboxes
```

### **2. Job Board Access Flow**

```
Employee Login
    ↓
Navigate to "Internal Jobs"
    ↓
API Call: GET /api/jobs/open
    ↓
Backend Controller (JobController)
    ↓
Service Layer (JobService)
    ↓
MongoDB Query (status == "Open")
    ↓
Return List of Open Jobs
    ↓
Frontend Display (InternalJobs.jsx)
    ↓
User Filters/Searches
    ↓
View Job Details
    ↓
Apply for Job (Placeholder)
```

---

## 🗄️ Database Schema

### **Jobs Collection (MongoDB)**

```javascript
{
  _id: ObjectId,
  id: "string",
  jobId: "JOB-012",              // Auto-generated
  jobTitle: "DevOps Engineer",
  department: "Engineering",
  status: "Open",                // ← TRIGGERS EMAIL
  experience: "3-5 years",
  salary: 800000,
  description: "Full description...",
  location: "Bangalore",
  jobType: "Full-time",
  workMode: "Hybrid",
  postedDate: "06/07/2026",      // ← For "NEW" badge
  applicants: 1,
  // ... other fields
}
```

### **Employees Collection (MongoDB)**

```javascript
{
  _id: ObjectId,
  id: "string",
  employeeId: "EMP-001",
  fullName: "John Doe",
  email: "john@omoikane.com",    // ← Used for notification
  department: "Engineering",
  status: "ACTIVE",              // ← Only ACTIVE get emails
  // ... other fields
}
```

---

## 🔐 Access Control Matrix

```
┌──────────────────────────┬──────────┬─────────┬───────┐
│ Feature                  │ Employee │ Manager │ Admin │
├──────────────────────────┼──────────┼─────────┼───────┤
│ Receive Email            │    ✅    │   ✅    │  ✅   │
│ View Internal Job Board  │    ✅    │   ✅    │  ✅   │
│ Apply for Jobs           │    ✅    │   ✅    │  ✅   │
│ View Recruitment Dash    │    ❌    │   ✅    │  ✅   │
│ Post New Jobs            │    ❌    │   ✅    │  ✅   │
│ Manage Candidates        │    ❌    │   ✅    │  ✅   │
└──────────────────────────┴──────────┴─────────┴───────┘
```

---

## 🌐 Network Architecture

### **Local Development**

```
┌─────────────────────────────────────────────────────────┐
│                    Developer Machine                     │
│                                                          │
│  ┌────────────────┐         ┌─────────────────┐        │
│  │   Frontend     │         │    Backend      │        │
│  │ localhost:5176 │ ◄────► │ localhost:8082  │        │
│  │   (Vite)       │         │ (Spring Boot)   │        │
│  └────────────────┘         └─────────────────┘        │
│         │                            │                  │
│         │                            ↓                  │
│         │                   ┌─────────────────┐        │
│         │                   │   MongoDB       │        │
│         │                   │   (Cloud)       │        │
│         │                   └─────────────────┘        │
│         │                            │                  │
│         └────────────────────────────┼──────────────────┤
│                                      ↓                  │
│                            ┌──────────────────┐        │
│                            │  Gmail SMTP      │        │
│                            │  smtp.gmail.com  │        │
│                            └──────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### **Production Deployment**

```
┌──────────────────────────────────────────────────────────┐
│                        Internet                          │
└────────────┬──────────────────────────┬──────────────────┘
             │                          │
    ┌────────▼──────────┐      ┌────────▼──────────┐
    │   Vercel CDN      │      │  Render Cloud     │
    │   (Frontend)      │      │  (Backend)        │
    │   *.vercel.app    │      │  *.onrender.com   │
    └────────┬──────────┘      └────────┬──────────┘
             │                          │
             │   API Calls              │
             └──────────────────────────┤
                                        │
                         ┌──────────────▼──────────────┐
                         │   MongoDB Atlas (Cloud)     │
                         │   cluster0.aexpf8t.mongodb  │
                         └──────────────┬──────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │   Gmail SMTP Server         │
                         │   smtp.gmail.com:587        │
                         └─────────────────────────────┘
```

---

## 📦 Component Structure

### **Backend Components**

```
HRMS-Backend/
└── src/main/java/.../hmrsbackend/
    ├── controller/
    │   └── JobController.java
    │       ├── createJob() ← Modified to trigger notifications
    │       └── getOpenJobs() ← New endpoint
    │
    ├── service/
    │   ├── JobService.java (Existing - no changes)
    │   └── JobNotificationService.java ← NEW
    │       ├── notifyEmployeesAboutNewJob()
    │       ├── sendJobNotificationEmail()
    │       └── buildEmailBody()
    │
    ├── model/
    │   ├── Job.java (Existing - no changes)
    │   └── Employee.java (Existing - no changes)
    │
    └── repository/
        ├── JobRepository.java (Existing - no changes)
        └── EmployeeRepository.java (Existing - no changes)
```

### **Frontend Components**

```
HRMS-Frontend/
└── src/
    ├── Pages/
    │   ├── InternalJobs.jsx ← NEW (Job board page)
    │   ├── InternalJobs.css ← NEW (Styling)
    │   └── Recruitment/
    │       └── ... (Existing - no changes)
    │
    ├── Components/
    │   └── Sidebar.jsx ← Modified (Added menu link)
    │
    ├── api/
    │   └── recruitmentApi.js (Existing - no changes)
    │
    └── App.jsx ← Modified (Added route)
```

---

## 🔄 State Management

### **No Global State Changes**

The implementation uses:
- ✅ Local component state (useState)
- ✅ Direct API calls
- ✅ No Redux/Context changes needed
- ✅ No new global state added

### **Component State**

```javascript
// InternalJobs.jsx
const [jobs, setJobs] = useState([]);           // All jobs
const [loading, setLoading] = useState(true);   // Loading state
const [error, setError] = useState(null);       // Error state
const [filter, setFilter] = useState("all");    // Department filter
const [searchTerm, setSearchTerm] = useState(""); // Search query
const [selectedJob, setSelectedJob] = useState(null); // Modal job
```

---

## 🔌 API Endpoints

### **Existing (No Changes)**
- `GET /api/jobs/all` - Get all jobs
- `POST /api/jobs/create` - Create job (modified internally)
- `PUT /api/jobs/update/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### **New**
- `GET /api/jobs/open` - Get only open jobs (for job board)

### **Email Configuration**
- Uses existing Gmail SMTP configuration
- No new email endpoints needed
- Triggered automatically in backend

---

## 🎯 Summary

### **What Was Built:**
1. ✅ Automatic email notification system
2. ✅ Internal job board page
3. ✅ Search and filter functionality
4. ✅ Job details modal
5. ✅ Sidebar navigation
6. ✅ Responsive design

### **What Wasn't Changed:**
1. ❌ Existing recruitment dashboard
2. ❌ Existing job posting flow
3. ❌ Existing database schema
4. ❌ Existing authentication
5. ❌ Existing employee management

### **Technology Stack:**
- **Frontend**: React, React Router, Axios
- **Backend**: Spring Boot, Java, MongoDB
- **Email**: JavaMailSender, Gmail SMTP
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

**Everything is integrated seamlessly with zero breaking changes!** 🎉
