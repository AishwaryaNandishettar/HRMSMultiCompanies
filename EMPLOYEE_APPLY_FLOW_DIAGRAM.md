# 🔄 Employee Job Application Flow Diagram

## 📱 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     EMPLOYEE LOGIN                               │
│                          ↓                                       │
│              [Username + Password]                               │
│                          ↓                                       │
│                   Authentication                                 │
│                          ↓                                       │
│              ✅ Role: "employee" verified                        │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                     MAIN DASHBOARD                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Sidebar Navigation                                      │   │
│  │  ├── 🏠 Home                                             │   │
│  │  ├── 📊 Dashboard                                        │   │
│  │  ├── ⏰ Attendance                                       │   │
│  │  ├── 👔 Recruitment  ← CLICK HERE                       │   │
│  │  └── ...                                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  RECRUITMENT DASHBOARD (Employee View)           │
│                                                                  │
│  📋 Recruitment Dashboard                                       │
│  Track and manage job openings, candidate pipelines, and        │
│  hiring progress.                                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🔍 Search: [_________________]  [⇅ Recent ▾]           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────┬──────────┬──────┬──────┬────────┬──────┬──────────┐   │
│  │Job │ Domain   │ Dept │Appl. │ Posted │ CTC  │Description│Apply│
│  ├────┼──────────┼──────┼──────┼────────┼──────┼──────────┼───┤
│  │001 │Frontend  │  IT  │  5   │ 13/04  │6-8 L │   👁️    │📝  │
│  │002 │Sales Mgr │Sales │  3   │ 15/04  │8-10L │   👁️    │📝  │
│  │003 │HR Exec   │  HR  │  2   │ 18/04  │4-6 L │   👁️    │📝  │
│  └────┴──────────┴──────┴──────┴────────┴──────┴──────────┴───┘
│                                                                  │
│  💡 Only "Open" jobs are visible to employees                   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
               ┌───────────┴────────────┐
               │                        │
          Click 👁️                  Click 📝
        View Details              Apply Now
               │                        │
               ↓                        ↓
┌──────────────────────────┐   ┌─────────────────────────────────┐
│   JOB DETAILS MODAL      │   │      APPLY CONFIRMATION         │
│                          │   │                                 │
│  Frontend Developer      │   │  Apply for Frontend Developer?  │
│  ───────────────────     │   │                                 │
│  📍 Location: Bangalore  │   │  Your profile will be           │
│  💼 Job Type: Full-time  │   │  submitted to HR for review.    │
│  🏠 Work Mode: Hybrid    │   │                                 │
│  ⏱️ Notice: 30 Days      │   │     [Cancel]    [OK]            │
│                          │   │                                 │
│  📋 Job Description:     │   └─────────────────────────────────┘
│  We are looking for...   │                  │
│                          │                  │ Employee clicks OK
│  [Close]                 │                  ↓
└──────────────────────────┘   ┌─────────────────────────────────┐
       │ Close modal             │      FRONTEND PROCESSING        │
       ↓                         │                                 │
   Back to job list              │  const confirmed = confirm(...) │
                                 │  if (!confirmed) return;        │
                                 │                                 │
                                 │  await applyForJob(jobId, {     │
                                 │    jobTitle: "Frontend Dev",    │
                                 │    department: "IT",            │
                                 │    appliedDate: new Date()      │
                                 │  });                            │
                                 └─────────────────────────────────┘
                                           ↓
                                 ┌─────────────────────────────────┐
                                 │      API CALL (Frontend)        │
                                 │                                 │
                                 │  POST /api/jobs/apply/:jobId    │
                                 │  Headers: {                     │
                                 │    Authorization: Bearer token  │
                                 │    Content-Type: application/json│
                                 │  }                              │
                                 │  Body: {                        │
                                 │    jobTitle: "Frontend Dev",    │
                                 │    department: "IT",            │
                                 │    appliedDate: "2026-07-08..." │
                                 │  }                              │
                                 └─────────────────────────────────┘
                                           ↓
                        ┌──────────────────┴─────────────────┐
                        │                                     │
                        ↓                                     ↓
              ┌──────────────────────┐           ┌──────────────────────┐
              │   BACKEND SUCCESS    │           │    BACKEND ERROR     │
              │   (To Be Implemented)│           │  (To Be Implemented) │
              │                      │           │                      │
              │  1. Verify Auth      │           │  • 401 Unauthorized  │
              │  2. Check Role       │           │  • 403 Forbidden     │
              │  3. Validate Job     │           │  • 404 Job Not Found │
              │  4. Check Duplicate  │           │  • 409 Already Applied│
              │  5. Save Application │           │  • 500 Server Error  │
              │  6. Send Email (opt) │           │                      │
              │                      │           │  return error        │
              │  return {            │           └──────────────────────┘
              │    success: true,    │                      │
              │    data: {...}       │                      │
              │  }                   │                      │
              └──────────────────────┘                      │
                        │                                   │
                        ↓                                   ↓
              ┌──────────────────────┐           ┌──────────────────────┐
              │   SUCCESS POPUP      │           │    ERROR POPUP       │
              │                      │           │                      │
              │  ✅ Application      │           │  ❌ Failed to submit │
              │  submitted!          │           │  application         │
              │                      │           │                      │
              │  Our HR team will    │           │  Please try again or │
              │  review your         │           │  contact HR.         │
              │  application for     │           │                      │
              │  Frontend Developer  │           │     [OK]             │
              │  and contact you     │           │                      │
              │  soon.               │           └──────────────────────┘
              │                      │                      │
              │     [OK]             │                      │
              │                      │                      │
              └──────────────────────┘                      │
                        │                                   │
                        └──────────────┬────────────────────┘
                                       ↓
                        ┌──────────────────────────────────┐
                        │   BACK TO JOB LIST              │
                        │                                  │
                        │  Employee can:                   │
                        │  • Apply to more jobs            │
                        │  • View other positions          │
                        │  • Search/filter jobs            │
                        │                                  │
                        │  Job they just applied to:       │
                        │  • Still shows "Apply Now" button│
                        │  • Can apply again (frontend)    │
                        │  • Backend prevents duplicate    │
                        └──────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌──────────────┐
│   Employee   │
│   Browser    │
└──────┬───────┘
       │ 1. Click "Apply Now"
       ↓
┌──────────────────────────────────────────────────────────┐
│                      Frontend (React)                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Recruitment.jsx                                    │  │
│  │  ├── const isEmployee = user?.role === "employee"  │  │
│  │  ├── Show "Apply Now" button if isEmployee         │  │
│  │  ├── onClick → confirm() dialog                    │  │
│  │  ├── await applyForJob(jobId, data)                │  │
│  │  └── Show success/error alert                      │  │
│  └────────────────────────────────────────────────────┘  │
│                          ↓                                │
│  ┌────────────────────────────────────────────────────┐  │
│  │  recruitmentApi.js                                  │  │
│  │  export const applyForJob = async (jobId, data) => │  │
│  │    const res = await api.post(                     │  │
│  │      `/api/jobs/apply/${jobId}`,                   │  │
│  │      data,                                         │  │
│  │      { headers: { Authorization: Bearer token } }  │  │
│  │    );                                              │  │
│  │    return res.data;                                │  │
│  │  }                                                  │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │ 2. HTTP POST Request
                            │    POST /api/jobs/apply/:jobId
                            │    Authorization: Bearer <token>
                            │    Body: { jobTitle, department, appliedDate }
                            ↓
┌──────────────────────────────────────────────────────────┐
│                   Backend API (Node.js)                   │
│                   (⏳ TO BE IMPLEMENTED)                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  POST /api/jobs/apply/:jobId                       │  │
│  │                                                     │  │
│  │  1. Extract JWT token from Authorization header    │  │
│  │     ├── Verify token is valid                      │  │
│  │     ├── Decode → get employeeId                    │  │
│  │     └── Check role === "employee"                  │  │
│  │                                                     │  │
│  │  2. Validate jobId                                 │  │
│  │     ├── Check job exists in database               │  │
│  │     ├── Check job.status === "Open"                │  │
│  │     └── Job not deleted                            │  │
│  │                                                     │  │
│  │  3. Check for duplicate application                │  │
│  │     ├── Query: employeeId + jobId                  │  │
│  │     └── If exists → return 409 Conflict            │  │
│  │                                                     │  │
│  │  4. Create application record                      │  │
│  │     ├── applicationId: "APP-001"                   │  │
│  │     ├── jobId: req.params.jobId                    │  │
│  │     ├── employeeId: decoded.userId                 │  │
│  │     ├── employeeName: user.name                    │  │
│  │     ├── jobTitle: req.body.jobTitle                │  │
│  │     ├── status: "Applied"                          │  │
│  │     └── Save to database                           │  │
│  │                                                     │  │
│  │  5. Optional: Send email to HR                     │  │
│  │                                                     │  │
│  │  6. Return success response                        │  │
│  │     return { success: true, data: application }    │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │ 3. Database Write
                            ↓
┌──────────────────────────────────────────────────────────┐
│                  Database (MongoDB)                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Collection: job_applications                       │  │
│  │  {                                                  │  │
│  │    _id: ObjectId("..."),                           │  │
│  │    applicationId: "APP-001",                       │  │
│  │    jobId: ObjectId("..."),                         │  │
│  │    employeeId: ObjectId("..."),                    │  │
│  │    employeeName: "John Doe",                       │  │
│  │    employeeEmail: "john@company.com",              │  │
│  │    jobTitle: "Frontend Developer",                 │  │
│  │    department: "IT",                               │  │
│  │    status: "Applied",                              │  │
│  │    appliedDate: ISODate("2026-07-08..."),          │  │
│  │    createdAt: ISODate("2026-07-08..."),            │  │
│  │    updatedAt: ISODate("2026-07-08...")             │  │
│  │  }                                                  │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │ 4. Success Response
                            ↓
┌──────────────────────────────────────────────────────────┐
│                    Backend Response                       │
│  {                                                        │
│    "success": true,                                       │
│    "message": "Application submitted successfully",      │
│    "data": {                                             │
│      "applicationId": "APP-001",                         │
│      "jobId": "60d5ec49f1b2c72b8c8e4a1b",                │
│      "employeeId": "60d5ec49f1b2c72b8c8e4a1a",           │
│      "jobTitle": "Frontend Developer",                   │
│      "status": "Applied",                                │
│      "appliedDate": "2026-07-08T10:30:00.000Z"           │
│    }                                                      │
│  }                                                        │
└───────────────────────────┬──────────────────────────────┘
                            │ 5. HTTP 201 Response
                            ↓
┌──────────────────────────────────────────────────────────┐
│                   Frontend (React)                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Handle Response                                    │  │
│  │  .then(response => {                               │  │
│  │    if (response.success) {                         │  │
│  │      alert("✅ Application submitted!");           │  │
│  │    }                                               │  │
│  │  })                                                │  │
│  │  .catch(error => {                                 │  │
│  │    alert("❌ Failed to submit");                   │  │
│  │  })                                                │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │ 6. Show Alert to User
                            ↓
                      ┌──────────────┐
                      │   Employee   │
                      │   Browser    │
                      │              │
                      │  [✅ Success │
                      │   Message]   │
                      └──────────────┘
```

---

## 🔐 Security Flow

```
┌────────────────────────────────────────────────────────────┐
│                    SECURITY CHECKS                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣ AUTHENTICATION                                         │
│     ├── JWT token present?                                 │
│     │   ├── ✅ Yes → Verify token                          │
│     │   └── ❌ No → Return 401 Unauthorized                │
│     └── Token valid?                                       │
│         ├── ✅ Yes → Proceed                               │
│         └── ❌ No → Return 401 Invalid Token               │
│                                                             │
│  2️⃣ AUTHORIZATION                                          │
│     └── User role === "employee"?                          │
│         ├── ✅ Yes → Proceed                               │
│         ├── ❌ No (admin) → Return 403 Forbidden           │
│         └── ❌ No (manager) → Return 403 Forbidden         │
│                                                             │
│  3️⃣ JOB VALIDATION                                         │
│     ├── Job exists in database?                            │
│     │   ├── ✅ Yes → Proceed                               │
│     │   └── ❌ No → Return 404 Not Found                   │
│     ├── Job status === "Open"?                             │
│     │   ├── ✅ Yes → Proceed                               │
│     │   └── ❌ No → Return 400 Job Not Open                │
│     └── Job not deleted?                                   │
│         ├── ✅ Yes → Proceed                               │
│         └── ❌ No → Return 404 Not Found                   │
│                                                             │
│  4️⃣ DUPLICATE CHECK                                        │
│     └── Application exists (employeeId + jobId)?           │
│         ├── ✅ No → Proceed to save                        │
│         └── ❌ Yes → Return 409 Already Applied            │
│                                                             │
│  5️⃣ DATA VALIDATION                                        │
│     ├── jobTitle is valid string?                          │
│     ├── department is valid string?                        │
│     ├── appliedDate is valid date?                         │
│     │   ├── ✅ All valid → Proceed                         │
│     │   └── ❌ Invalid → Return 400 Bad Request            │
│                                                             │
│  6️⃣ SAVE APPLICATION                                       │
│     └── Insert into job_applications collection            │
│         ├── ✅ Success → Return 201 Created                │
│         └── ❌ Error → Return 500 Server Error             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 State Management

```
┌────────────────────────────────────────────────────────────┐
│              REACT COMPONENT STATE FLOW                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Initial State:                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ const [jobs, setJobs] = useState([]);                │  │
│  │ const isEmployee = user?.role === "employee";       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  Fetch Jobs:                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ useEffect(() => {                                    │  │
│  │   const res = await getAllJobs();                   │  │
│  │   setJobs(res);                                      │  │
│  │ }, []);                                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  Filter Jobs (for Employee):                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ const filteredJobs = jobs.filter(job => {           │  │
│  │   const matchesEmployeeView =                       │  │
│  │     !isEmployee || job.status === "Open";           │  │
│  │   return matchesEmployeeView;                       │  │
│  │ });                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  Render UI:                                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ {filteredJobs.map(job => (                          │  │
│  │   <tr key={job._id}>                                │  │
│  │     {!isEmployee && <AdminColumns />}               │  │
│  │     {isEmployee && <ApplyButton job={job} />}       │  │
│  │   </tr>                                             │  │
│  │ ))}                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  Apply Job (Employee Action):                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ const handleApply = async (job) => {                │  │
│  │   try {                                             │  │
│  │     await applyForJob(job._id, data);               │  │
│  │     alert("✅ Success");                            │  │
│  │   } catch (err) {                                   │  │
│  │     alert("❌ Error");                              │  │
│  │   }                                                 │  │
│  │ };                                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  State remains unchanged                                    │
│  (No need to refresh job list after apply)                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Status

| Component | Status |
|-----------|--------|
| 🔵 Frontend - Route Protection | ✅ Complete |
| 🔵 Frontend - Sidebar Menu | ✅ Complete |
| 🔵 Frontend - Role Detection | ✅ Complete |
| 🔵 Frontend - Job Filtering | ✅ Complete |
| 🔵 Frontend - Conditional UI | ✅ Complete |
| 🔵 Frontend - Apply Button | ✅ Complete |
| 🔵 Frontend - API Integration | ✅ Complete |
| 🔵 Frontend - Error Handling | ✅ Complete |
| 🟡 Backend - API Endpoint | ⏳ Pending |
| 🟡 Backend - Database Schema | ⏳ Pending |
| 🟡 Backend - Authentication | ⏳ Pending |
| 🟡 Backend - Validation | ⏳ Pending |
| 🟢 Documentation | ✅ Complete |
| 🟢 Code Quality | ✅ Verified |

---

**Diagram Version:** 1.0  
**Last Updated:** 2026-07-08  
**Status:** Ready for Implementation
