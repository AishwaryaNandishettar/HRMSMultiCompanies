# Reporting Head Field Implementation - Complete Guide

## What Was Done

Added **Reporting Head** field to the HRMS system so it can be displayed in the Profile page alongside Reporting Manager and HR Business Partner.

---

## Changes Made

### 1. ✅ Backend - Employee Model
**File:** `HRMSProject/HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/model/Employee.java`

**Added:**
```java
private String reportingHead;  // ✅ Reporting Head name

// Getter and Setter
public String getReportingHead() {
    return reportingHead;
}
public void setReportingHead(String reportingHead) {
    this.reportingHead = reportingHead;
}
```

### 2. ✅ Backend - User Model
**File:** `HRMSProject/HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/model/User.java`

**Added:**
```java
private String reportingHead;  // ✅ Reporting Head name

// Getter and Setter
public String getReportingHead() {
    return reportingHead;
}
public void setReportingHead(String reportingHead) {
    this.reportingHead = reportingHead;
}
```

### 3. ✅ Frontend - Profile.jsx
**File:** `HRMSProject/HRMS-Frontend/src/Pages/Profile.jsx`

**Already configured** (line ~473):
```javascript
const reporting = [
  {
    name:
      profileEmployee?.managerName ||
      profileEmployee?.manager ||
      profileData?.managerName ||
      profileData?.manager ||
      "-",
    role: "Reporting Manager",
  },
  {
    name:
      profileEmployee?.reportingHead ||
      profileData?.reportingHead ||
      "-",
    role: "Reporting Head",  // ✅ Will now show reportingHead from backend
  },
  {
    name:
      profileEmployee?.hrName ||
      profileData?.hrName ||
      "-",
    role: "HR Business Partner",  // ✅ Already shows hrName (e.g., "Vishnuvardhan")
  },
];
```

---

## How to Complete the Setup

### Step 1: Run MongoDB Script

Use the provided script to add `reportingHead` field to existing database documents.

**File:** `HRMSProject/add_reporting_head_field.js`

**Option A - MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to your database
3. Select your database (e.g., `hrms` or your company database)
4. Click on "MONGOSH" at the bottom
5. Copy and paste the script from `add_reporting_head_field.js`
6. Press Enter to execute

**Option B - Command Line (mongosh):**
```bash
# Connect to MongoDB
mongosh "your-mongodb-connection-string"

# Select your database
use your_database_name

# Run the script
load("add_reporting_head_field.js")
```

**Option C - MongoDB Shell (direct commands):**
```javascript
// Add reportingHead to employees
db.employees.updateMany(
  {},
  { $set: { reportingHead: "" } }
);

// Add reportingHead to users
db.users.updateMany(
  {},
  { $set: { reportingHead: "" } }
);
```

### Step 2: Restart Backend

After running the MongoDB script, restart your backend application:

```bash
cd HRMSProject/HRMS-Backend
./mvnw spring-boot:run

# OR if already running
# Stop the backend (Ctrl+C) and start again
```

### Step 3: Set Reporting Head for Employees

You can set the reporting head in two ways:

#### Option A - Update Database Directly (for existing employees)

```javascript
// Set reporting head for specific employee in Employee collection
db.employees.updateOne(
  { employeeId: "IT-EMP-0041" },
  { $set: { reportingHead: "Padmanabh" } }
);

// Set reporting head for specific user in User collection
db.users.updateOne(
  { email: "lata.b@omoikaneinnovations.com" },
  { $set: { reportingHead: "Padmanabh" } }
);
```

#### Option B - Add to Admin Forms (for future employees)

You'll need to add a "Reporting Head" input field to your employee creation/edit forms in the admin panel. This would be in forms where you currently set manager and HR partner.

**Typical locations:**
- Employee Directory → Bulk Invite form
- Employee Directory → Edit Employee form
- Admin → Employee Management

---

## Current Reporting Structure Display

After implementation, the Profile page will show:

```
┌─────────────────────────────────────┐
│      Reporting Structure            │
├─────────────────────────────────────┤
│  👤 Padmanabh                       │
│     Reporting Manager               │
├─────────────────────────────────────┤
│  👤 [Reporting Head Name]           │
│     Reporting Head                  │
├─────────────────────────────────────┤
│  👤 Vishnuvardhan                   │
│     HR Business Partner             │
└─────────────────────────────────────┘
```

### Field Mapping:

| Display Label | Database Field (User) | Database Field (Employee) | Current Value Example |
|---------------|----------------------|---------------------------|----------------------|
| **Reporting Manager** | `managerName` | `manager` | "Padmanabh" ✅ |
| **Reporting Head** | `reportingHead` | `reportingHead` | "" (empty initially) |
| **HR Business Partner** | `hrName` | - | "Vishnuvardhan" ✅ |

---

## Database Structure After Implementation

### Employee Collection
```json
{
  "_id": "69de63c67fc1e659a39e42b5",
  "employeeId": "IT-EMP-0041",
  "fullName": "Lata Benakop",
  "email": "lata.b@omoikaneinnovations.com",
  "department": "IT",
  "designation": "Software Developer",
  "manager": "Padmanabh",
  "managerEmail": "bd@omoikaneinnovations.com",
  "reportingHead": "",  // ✅ NEW FIELD
  "status": "ACTIVE"
}
```

### User Collection
```json
{
  "_id": "69de63c67fc1e659a39e42b4",
  "employeeName": "Lata Benakop",
  "email": "lata.b@omoikaneinnovations.com",
  "role": "EMPLOYEE",
  "department": "IT",
  "designation": "Software Developer",
  "managerName": "Padmanabh",
  "managerEmail": "bd@omoikaneinnovations.com",
  "hrName": "Vishnuvardhan",
  "reportingHead": "",  // ✅ NEW FIELD
  "employmentType": "Full-Time"
}
```

---

## Testing

### 1. After Running MongoDB Script:

**Verify field was added:**
```javascript
// Check Employee collection
db.employees.findOne({ employeeId: "IT-EMP-0041" })

// Check User collection
db.users.findOne({ email: "lata.b@omoikaneinnovations.com" })

// You should see reportingHead: "" in both
```

### 2. After Setting Reporting Head Value:

**Update and verify:**
```javascript
// Set reportingHead
db.employees.updateOne(
  { employeeId: "IT-EMP-0041" },
  { $set: { reportingHead: "John Doe" } }
);

db.users.updateOne(
  { email: "lata.b@omoikaneinnovations.com" },
  { $set: { reportingHead: "John Doe" } }
);

// Verify
db.employees.findOne({ employeeId: "IT-EMP-0041" }, { reportingHead: 1 })
db.users.findOne({ email: "lata.b@omoikaneinnovations.com" }, { reportingHead: 1 })
```

### 3. Check Profile Page:

1. Login to HRMS
2. Go to Profile page
3. Scroll to "Reporting Structure" section
4. You should see:
   - ✅ Reporting Manager: Padmanabh (fixed - showing name not email)
   - ✅ Reporting Head: John Doe (if you set the value in Step 2)
   - ✅ HR Business Partner: Vishnuvardhan (already working)

---

## Summary

✅ **Reporting Manager** - Fixed to show name (Padmanabh) instead of email

✅ **Reporting Head** - Added field to backend models, ready to use

✅ **HR Business Partner** - Already working, shows "Vishnuvardhan"

---

## Next Steps

1. **Run the MongoDB script** (`add_reporting_head_field.js`) to add the field to existing documents
2. **Restart the backend** to load the new model fields
3. **Set reporting head values** for employees via MongoDB or admin forms
4. **(Optional)** Add "Reporting Head" input field to employee creation/edit forms

---

## Files Modified

1. `HRMSProject/HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/model/Employee.java`
   - Added `reportingHead` field with getter/setter

2. `HRMSProject/HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/model/User.java`
   - Added `reportingHead` field with getter/setter

3. `HRMSProject/HRMS-Frontend/src/Pages/Profile.jsx`
   - Already configured to display `reportingHead` (no changes needed)

## Files Created

1. `HRMSProject/add_reporting_head_field.js`
   - MongoDB script to add field to existing documents

2. `HRMSProject/REPORTING_HEAD_IMPLEMENTATION_COMPLETE.md`
   - This guide

---

**No hardcoding. No logic changes. Using existing backend structure pattern.**
