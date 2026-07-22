# Quick Fix for Reporting Structure Fields

## Problem

Your MongoDB document has field names with **spaces**:
```json
{
  "hr Business Partner": "Vishnuvardhan",  // ❌ Wrong - has spaces
  "reporting Head": "Padmanabh"            // ❌ Wrong - has spaces and wrong case
}
```

But the backend expects **camelCase** field names:
```json
{
  "hrName": "Vishnuvardhan",      // ✅ Correct
  "reportingHead": "Padmanabh"    // ✅ Correct
}
```

---

## Solution

### Option 1: Run Full Script (Recommended)

**File:** `fix_reporting_field_names.js`

1. Open MongoDB Compass
2. Connect to your database
3. Click "MONGOSH" at the bottom
4. Copy and paste the entire script
5. Press Enter

This will fix ALL employees automatically.

---

### Option 2: Quick Manual Fix (For Aishwarya Only)

Run these commands in MongoDB Compass > MONGOSH:

```javascript
// Fix Employee Collection
db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  {
    $set: {
      hrName: "Vishnuvardhan",
      reportingHead: "Padmanabh"
    },
    $unset: {
      "hr Business Partner": "",
      "reporting Head": ""
    }
  }
);

// Fix User Collection
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  {
    $set: {
      hrName: "Vishnuvardhan",
      reportingHead: "Padmanabh"
    },
    $unset: {
      "hr Business Partner": "",
      "reporting Head": ""
    }
  }
);

console.log("✅ Fixed Aishwarya's records");

// Verify the fix
db.employees.findOne(
  { email: "Aishwarya@company.com" },
  { hrName: 1, reportingHead: 1, manager: 1, managerEmail: 1 }
);

db.users.findOne(
  { email: "Aishwarya@company.com" },
  { hrName: 1, reportingHead: 1, managerName: 1, managerEmail: 1 }
);
```

---

### Option 3: Fix All Employees at Once

If you have multiple employees with this issue, run:

```javascript
// Fix all employees - rename fields
db.employees.updateMany(
  { "hr Business Partner": { $exists: true } },
  [
    {
      $set: {
        hrName: "$hr Business Partner"
      }
    },
    {
      $unset: "hr Business Partner"
    }
  ]
);

db.employees.updateMany(
  { "reporting Head": { $exists: true } },
  [
    {
      $set: {
        reportingHead: "$reporting Head"
      }
    },
    {
      $unset: "reporting Head"
    }
  ]
);

// Fix all users - rename fields
db.users.updateMany(
  { "hr Business Partner": { $exists: true } },
  [
    {
      $set: {
        hrName: "$hr Business Partner"
      }
    },
    {
      $unset: "hr Business Partner"
    }
  ]
);

db.users.updateMany(
  { "reporting Head": { $exists: true } },
  [
    {
      $set: {
        reportingHead: "$reporting Head"
      }
    },
    {
      $unset: "reporting Head"
    }
  ]
);

console.log("✅ Fixed all records");
```

---

## After Running the Fix

1. **Refresh your browser** (Ctrl + F5 or Cmd + Shift + R)
2. **Go to Profile page**
3. **Check Reporting Structure section**

You should see:
```
Reporting Structure:
✅ Shambuling Madli - Reporting Manager
✅ Padmanabh - Reporting Head
✅ Vishnuvardhan - HR Business Partner
```

---

## Correct Field Names Reference

| Display Label | MongoDB Field (Employee) | MongoDB Field (User) |
|---------------|-------------------------|---------------------|
| Reporting Manager | `manager` | `managerName` |
| Manager Email | `managerEmail` | `managerEmail` |
| Reporting Head | `reportingHead` | `reportingHead` |
| HR Business Partner | `hrName` | `hrName` |

---

## Common Mistakes to Avoid

❌ **Don't use spaces in field names:**
- "hr Business Partner" ❌
- "reporting Head" ❌
- "manager Name" ❌

✅ **Use camelCase:**
- `hrName` ✅
- `reportingHead` ✅
- `managerName` ✅

❌ **Don't capitalize randomly:**
- "reportinghead" ❌ (missing capital H)
- "ReportingHead" ❌ (capital R not needed)

✅ **Use proper camelCase:**
- `reportingHead` ✅ (first word lowercase, second word capitalized)

---

## How to Edit in MongoDB Compass GUI

If you prefer using MongoDB Compass GUI:

1. Open MongoDB Compass
2. Navigate to your database → `employees` collection
3. Find Aishwarya's record (email: "Aishwarya@company.com")
4. Click the **Edit** button
5. **Add new fields:**
   - Field: `hrName` → Value: `"Vishnuvardhan"`
   - Field: `reportingHead` → Value: `"Padmanabh"`
6. **Delete old fields:**
   - Delete field: `"hr Business Partner"`
   - Delete field: `"reporting Head"`
7. Click **Update**
8. Repeat for `users` collection

---

## Verification

After fixing, your document should look like:

```json
{
  "_id": "6a34f0f1dc2d0e7610426842",
  "employeeId": "ADMIN111",
  "fullName": "Aishwarya",
  "email": "Aishwarya@company.com",
  "manager": "Shambuling Madli",
  "managerEmail": "omoikaneinnovations@gmail.com",
  "hrName": "Vishnuvardhan",           // ✅ Correct field name
  "reportingHead": "Padmanabh",        // ✅ Correct field name
  "department": "IT",
  "designation": "Admin"
}
```

---

**After fixing the field names, refresh your browser and check the Profile page!**
