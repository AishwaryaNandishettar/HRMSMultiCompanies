# 🔧 Backend API Specification - Job Application Endpoint

## 📋 Overview

This document specifies the backend API endpoint required to handle employee job applications from the recruitment page.

---

## 🎯 API Endpoint

### **POST** `/api/jobs/apply/:jobId`

**Purpose:** Allow employees to apply for open job positions

---

## 📥 Request Specification

### URL Parameters
```javascript
{
  jobId: String  // MongoDB ObjectId or Job ID
}
```

### Request Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <employee_jwt_token>"
}
```

### Request Body
```javascript
{
  "jobTitle": String,        // e.g., "Frontend Developer"
  "department": String,      // e.g., "IT"
  "appliedDate": String      // ISO 8601 format: "2026-07-08T10:30:00.000Z"
}
```

### Example Request
```javascript
POST /api/jobs/apply/60d5ec49f1b2c72b8c8e4a1b
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "jobTitle": "Frontend Developer",
  "department": "IT",
  "appliedDate": "2026-07-08T10:30:00.000Z"
}
```

---

## 📤 Response Specification

### Success Response (201 Created)
```javascript
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "60d5ec49f1b2c72b8c8e4a1c",
    "jobId": "60d5ec49f1b2c72b8c8e4a1b",
    "employeeId": "60d5ec49f1b2c72b8c8e4a1a",
    "jobTitle": "Frontend Developer",
    "department": "IT",
    "status": "Applied",
    "appliedDate": "2026-07-08T10:30:00.000Z",
    "createdAt": "2026-07-08T10:30:05.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Invalid Data
```javascript
{
  "success": false,
  "message": "Invalid application data",
  "errors": [
    "jobTitle is required",
    "department is required"
  ]
}
```

#### 401 Unauthorized - Not Logged In
```javascript
{
  "success": false,
  "message": "Authentication required"
}
```

#### 403 Forbidden - Not Employee
```javascript
{
  "success": false,
  "message": "Only employees can apply for jobs"
}
```

#### 404 Not Found - Job Doesn't Exist
```javascript
{
  "success": false,
  "message": "Job not found or no longer available"
}
```

#### 409 Conflict - Already Applied
```javascript
{
  "success": false,
  "message": "You have already applied for this position",
  "data": {
    "applicationId": "60d5ec49f1b2c72b8c8e4a1c",
    "appliedDate": "2026-07-05T09:00:00.000Z"
  }
}
```

#### 500 Internal Server Error
```javascript
{
  "success": false,
  "message": "Failed to submit application. Please try again later."
}
```

---

## 🗄️ Database Schema

### Collection/Table: `job_applications`

```javascript
{
  _id: ObjectId,                    // Primary key
  applicationId: String,            // Unique application ID (e.g., "APP-001")
  jobId: ObjectId,                  // Reference to jobs collection
  employeeId: ObjectId,             // Reference to users/employees collection
  employeeName: String,             // Employee full name
  employeeEmail: String,            // Employee email
  employeePhone: String,            // Employee phone (optional)
  jobTitle: String,                 // Job title at time of application
  department: String,               // Department at time of application
  designation: String,              // Employee's current designation
  status: String,                   // "Applied", "Under Review", "Shortlisted", "Rejected", "Accepted"
  appliedDate: Date,                // When employee applied
  reviewedDate: Date,               // When HR reviewed (optional)
  reviewedBy: ObjectId,             // HR user who reviewed (optional)
  notes: String,                    // HR notes (optional)
  createdAt: Date,                  // Record creation timestamp
  updatedAt: Date                   // Record update timestamp
}
```

### Example Document
```javascript
{
  "_id": ObjectId("60d5ec49f1b2c72b8c8e4a1c"),
  "applicationId": "APP-001",
  "jobId": ObjectId("60d5ec49f1b2c72b8c8e4a1b"),
  "employeeId": ObjectId("60d5ec49f1b2c72b8c8e4a1a"),
  "employeeName": "John Doe",
  "employeeEmail": "john.doe@omoikane.com",
  "employeePhone": "+919876543210",
  "jobTitle": "Frontend Developer",
  "department": "IT",
  "designation": "Junior Developer",
  "status": "Applied",
  "appliedDate": ISODate("2026-07-08T10:30:00.000Z"),
  "reviewedDate": null,
  "reviewedBy": null,
  "notes": "",
  "createdAt": ISODate("2026-07-08T10:30:05.000Z"),
  "updatedAt": ISODate("2026-07-08T10:30:05.000Z")
}
```

---

## 🔐 Security & Validation

### Required Validations

1. **Authentication Check**
   - Verify JWT token is valid
   - Extract employeeId from token

2. **Authorization Check**
   - Verify user role is "employee"
   - Admin/Manager should not use this endpoint

3. **Job Validation**
   - Job exists in database
   - Job status is "Open"
   - Job has not been deleted

4. **Duplicate Check**
   - Employee hasn't already applied for this job
   - Check: `employeeId + jobId` combination

5. **Data Validation**
   - jobTitle: non-empty string
   - department: non-empty string
   - appliedDate: valid ISO date

### Security Best Practices

```javascript
// Pseudo-code for security checks
async function applyForJob(req, res) {
  try {
    // 1. Authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Auth required" });
    
    const decoded = jwt.verify(token, SECRET_KEY);
    const employeeId = decoded.userId;
    
    // 2. Authorization - Only employees
    const user = await User.findById(employeeId);
    if (user.role !== 'employee') {
      return res.status(403).json({ message: "Only employees can apply" });
    }
    
    // 3. Job validation
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== 'Open') {
      return res.status(400).json({ message: "Job is not open" });
    }
    
    // 4. Duplicate check
    const existing = await Application.findOne({ 
      employeeId, 
      jobId: job._id 
    });
    if (existing) {
      return res.status(409).json({ 
        message: "Already applied",
        data: existing 
      });
    }
    
    // 5. Create application
    const application = await Application.create({
      applicationId: generateAppId(),
      jobId: job._id,
      employeeId,
      employeeName: user.name,
      employeeEmail: user.email,
      jobTitle: job.jobTitle,
      department: job.department,
      status: 'Applied',
      appliedDate: new Date()
    });
    
    // 6. Optional: Send email to HR
    await sendNotificationToHR(application);
    
    return res.status(201).json({
      success: true,
      message: "Application submitted",
      data: application
    });
    
  } catch (error) {
    console.error("Apply job error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Application failed" 
    });
  }
}
```

---

## 📧 Email Notifications (Optional)

### Email to HR when Employee Applies

**Subject:** New Job Application - [Job Title]

**Template:**
```html
<!DOCTYPE html>
<html>
<body>
  <h2>New Job Application Received</h2>
  
  <p>A new application has been submitted for the following position:</p>
  
  <table>
    <tr><td><strong>Job Title:</strong></td><td>Frontend Developer</td></tr>
    <tr><td><strong>Department:</strong></td><td>IT</td></tr>
    <tr><td><strong>Job ID:</strong></td><td>JOB-001</td></tr>
  </table>
  
  <h3>Applicant Details</h3>
  <table>
    <tr><td><strong>Name:</strong></td><td>John Doe</td></tr>
    <tr><td><strong>Email:</strong></td><td>john.doe@omoikane.com</td></tr>
    <tr><td><strong>Phone:</strong></td><td>+919876543210</td></tr>
    <tr><td><strong>Current Role:</strong></td><td>Junior Developer</td></tr>
    <tr><td><strong>Applied On:</strong></td><td>08 Jul 2026, 10:30 AM</td></tr>
  </table>
  
  <p>
    <a href="https://hrms.omoikane.com/recruitment/pipeline">
      View Application in Dashboard
    </a>
  </p>
</body>
</html>
```

### Email to Employee (Confirmation)

**Subject:** Application Received - [Job Title]

**Template:**
```html
<!DOCTYPE html>
<html>
<body>
  <h2>Your Application Has Been Received</h2>
  
  <p>Dear John Doe,</p>
  
  <p>Thank you for applying for the <strong>Frontend Developer</strong> position in the <strong>IT</strong> department.</p>
  
  <p>Your application has been successfully submitted and our HR team will review it shortly.</p>
  
  <h3>What's Next?</h3>
  <ul>
    <li>Our HR team will review your application within 3-5 business days</li>
    <li>If shortlisted, you'll receive an email for the next steps</li>
    <li>For any queries, please contact hr@omoikane.com</li>
  </ul>
  
  <p><strong>Application ID:</strong> APP-001</p>
  <p><strong>Applied Date:</strong> 08 Jul 2026, 10:30 AM</p>
  
  <p>Best regards,<br>HR Team<br>OMOIKANE INNOVATIONS</p>
</body>
</html>
```

---

## 🧪 Testing Checklist

### Unit Tests
- ✅ Valid application submission succeeds
- ✅ Missing jobTitle returns 400
- ✅ Missing department returns 400
- ✅ Invalid jobId returns 404
- ✅ Closed job returns 400
- ✅ Duplicate application returns 409
- ✅ Non-employee role returns 403
- ✅ Missing auth token returns 401
- ✅ Invalid auth token returns 401

### Integration Tests
- ✅ Application saved to database correctly
- ✅ Employee can retrieve their applications
- ✅ HR can view all applications
- ✅ Email sent to HR on application
- ✅ Email sent to employee on confirmation

### Manual Testing
```bash
# Test 1: Valid application
curl -X POST http://localhost:5000/api/jobs/apply/60d5ec49f1b2c72b8c8e4a1b \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <employee_token>" \
  -d '{
    "jobTitle": "Frontend Developer",
    "department": "IT",
    "appliedDate": "2026-07-08T10:30:00.000Z"
  }'

# Expected: 201 Created

# Test 2: Duplicate application
curl -X POST http://localhost:5000/api/jobs/apply/60d5ec49f1b2c72b8c8e4a1b \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <same_employee_token>" \
  -d '{
    "jobTitle": "Frontend Developer",
    "department": "IT",
    "appliedDate": "2026-07-08T10:35:00.000Z"
  }'

# Expected: 409 Conflict

# Test 3: No authentication
curl -X POST http://localhost:5000/api/jobs/apply/60d5ec49f1b2c72b8c8e4a1b \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Frontend Developer",
    "department": "IT",
    "appliedDate": "2026-07-08T10:30:00.000Z"
  }'

# Expected: 401 Unauthorized
```

---

## 📊 Additional Endpoints (Recommended)

### 1. Get Employee's Applications
```javascript
GET /api/jobs/applications/my
Authorization: Bearer <employee_token>

Response:
{
  "success": true,
  "data": [
    {
      "applicationId": "APP-001",
      "jobTitle": "Frontend Developer",
      "department": "IT",
      "status": "Under Review",
      "appliedDate": "2026-07-08T10:30:00.000Z"
    }
  ]
}
```

### 2. Get All Applications (HR Only)
```javascript
GET /api/jobs/applications/all
Authorization: Bearer <hr_token>

Response:
{
  "success": true,
  "data": [
    {
      "applicationId": "APP-001",
      "employeeName": "John Doe",
      "jobTitle": "Frontend Developer",
      "status": "Applied",
      "appliedDate": "2026-07-08T10:30:00.000Z"
    }
  ]
}
```

### 3. Update Application Status (HR Only)
```javascript
PUT /api/jobs/applications/:applicationId/status
Authorization: Bearer <hr_token>

Body:
{
  "status": "Shortlisted",
  "notes": "Good profile, schedule interview"
}

Response:
{
  "success": true,
  "message": "Application status updated"
}
```

---

## 🚀 Implementation Priority

### Phase 1 (Must Have) ✅
- ✅ POST `/api/jobs/apply/:jobId` endpoint
- ✅ Database schema for applications
- ✅ Authentication & authorization
- ✅ Duplicate check validation

### Phase 2 (Should Have) ⏳
- ⏳ GET `/api/jobs/applications/my` (employee view)
- ⏳ GET `/api/jobs/applications/all` (HR view)
- ⏳ Email notification to HR

### Phase 3 (Nice to Have) 💡
- 💡 PUT update application status
- 💡 Email confirmation to employee
- 💡 Application tracking dashboard
- 💡 Analytics on applications

---

## 📝 Notes for Backend Developers

1. **Use Existing Auth Middleware**
   - Reuse your existing JWT verification middleware
   - Extract user info from token

2. **Use Existing Job Model**
   - Reference the existing Job schema
   - No need to modify Job collection

3. **Create New Application Model**
   - Create separate `JobApplication` schema
   - Link to Job and User via ObjectId

4. **Transaction Safety**
   - Use MongoDB transactions if available
   - Ensure atomic operations for duplicate checks

5. **Error Logging**
   - Log all application attempts
   - Track failures for debugging

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-08  
**Status:** 📋 Specification Ready  
**Implementation Status:** ⏳ Pending Backend Development
