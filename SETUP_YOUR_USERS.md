# Setup Your Users - Exact Commands

## 🎯 Quick Setup for Your Current Users

Based on your screenshot and description, here are the EXACT commands to run:

## 📋 Step 1: Connect to MongoDB

```bash
# Connect to MongoDB (adjust connection string if needed)
mongosh

# Or with connection string:
mongosh "mongodb://localhost:27017"
```

## 📋 Step 2: Select Your Database

```bash
# Use your HRMS database (adjust name if different)
use hrms_db

# Or check available databases:
show dbs
```

## 📋 Step 3: Check Current Users

```javascript
// See what users you currently have
db.users.find({}, { email: 1, name: 1, companyId: 1, _id: 0 }).pretty()
```

## 📋 Step 4: Assign Companies

### Option A: Assign Specific Users (Recommended)

```javascript
// ============================================
// OMOIKANEINNOVATIONS EMPLOYEES
// (These should NOT access TalentHub/WorkForce/PeopleSync portals)
// ============================================
db.users.updateMany(
  { email: { $in: [
    "Aishwarya@company.com",
    "aishwarya@omoi.com",
    "Aishmanager@omoi.com",
    "nikita@omoi.com",
    "nikitaadigennavar@gmail.com",
    "mahesh@omoi.com",
    "vishnu@omoi.com",
    "padmanabh@omoi.com",
    "shambuling@omoi.com",
    "lata@omoi.com",
    // Add any other Omoikaneinnovations employees here
  ]}},
  { $set: { companyId: "omoikaneinnovations" }}
)

// Check how many were updated
db.users.find(
  { companyId: "omoikaneinnovations" },
  { email: 1, _id: 0 }
).pretty()


// ============================================
// TALENTHUB SOLUTIONS EMPLOYEES
// (company-a portal on localhost:5176)
// ============================================
db.users.updateMany(
  { email: { $in: [
    // Add TalentHub employee emails here
    "talentemployee1@talenthub.com",
    "talentemployee2@talenthub.com",
    "talentmanager@talenthub.com",
    "talentadmin@talenthub.com",
  ]}},
  { $set: { companyId: "company-a" }}
)


// ============================================
// WORKFORCE PRO EMPLOYEES  
// (company-b portal on localhost:5177)
// ============================================
db.users.updateMany(
  { email: { $in: [
    // Add WorkForce Pro employee emails here
    "workforceemployee@workforce.com",
    "workforcemanager@workforce.com",
  ]}},
  { $set: { companyId: "company-b" }}
)


// ============================================
// PEOPLESYNC ENTERPRISE EMPLOYEES
// (company-c portal on localhost:5178)
// ============================================
db.users.updateMany(
  { email: { $in: [
    // Add PeopleSync employee emails here
    "peoplesyncemployee@peoplesync.com",
    "peoplesyncmanager@peoplesync.com",
  ]}},
  { $set: { companyId: "company-c" }}
)
```

### Option B: Assign by Email Domain (If you have many users)

```javascript
// All @omoi.com or @company.com → Omoikaneinnovations
db.users.updateMany(
  { email: { $regex: "@(omoi|company)\\.com$", $options: "i" }},
  { $set: { companyId: "omoikaneinnovations" }}
)

// All @talenthub.com → TalentHub Solutions
db.users.updateMany(
  { email: { $regex: "@talenthub\\.com$", $options: "i" }},
  { $set: { companyId: "company-a" }}
)

// All @workforce.com → WorkForce Pro
db.users.updateMany(
  { email: { $regex: "@workforce\\.com$", $options: "i" }},
  { $set: { companyId: "company-b" }}
)

// All @peoplesync.com → PeopleSync Enterprise
db.users.updateMany(
  { email: { $regex: "@peoplesync\\.com$", $options: "i" }},
  { $set: { companyId: "company-c" }}
)
```

## 📋 Step 5: Verify Setup

```javascript
// Count users per company
db.users.aggregate([
  { $group: { _id: "$companyId", count: { $sum: 1 }, emails: { $push: "$email" }}},
  { $sort: { _id: 1 }}
])

// Should output something like:
// {
//   _id: "omoikaneinnovations",
//   count: 8,
//   emails: ["Aishwarya@company.com", "nikita@omoi.com", ...]
// }
// {
//   _id: "company-a",
//   count: 3,
//   emails: ["talentemployee@talenthub.com", ...]
// }
```

## 📋 Step 6: Check Specific Users

```javascript
// Check Aishwarya (should be omoikaneinnovations)
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, name: 1, companyId: 1, _id: 0 }
)
// Expected: { email: "Aishwarya@company.com", companyId: "omoikaneinnovations" }

// Check Nikita (should be omoikaneinnovations)
db.users.findOne(
  { email: { $regex: "nikita", $options: "i" }},
  { email: 1, name: 1, companyId: 1, _id: 0 }
)

// Check Mahesh (should be omoikaneinnovations)
db.users.findOne(
  { email: { $regex: "mahesh", $options: "i" }},
  { email: 1, name: 1, companyId: 1, _id: 0 }
)
```

## 📋 Step 7: Find Users Without Company (These need to be assigned)

```javascript
// Find users without companyId
db.users.find({
  $or: [
    { companyId: { $exists: false }},
    { companyId: null },
    { companyId: "" }
  ]
}, { email: 1, name: 1, _id: 0 }).pretty()

// If any users are found, assign them to the appropriate company
// Example:
// db.users.updateOne(
//   { email: "founduser@example.com" },
//   { $set: { companyId: "company-a" }}
// )
```

## 📋 Step 8: Final Verification

```javascript
// List all users with their companies
db.users.find(
  {},
  { email: 1, name: 1, companyId: 1, role: 1, _id: 0 }
).sort({ companyId: 1, email: 1 }).pretty()
```

## 🎯 Expected Output

After running these commands, you should see:

```javascript
// Omoikaneinnovations employees
{ email: "Aishwarya@company.com", companyId: "omoikaneinnovations", role: "admin" }
{ email: "nikita@omoi.com", companyId: "omoikaneinnovations", role: "employee" }
{ email: "mahesh@omoi.com", companyId: "omoikaneinnovations", role: "employee" }
{ email: "vishnu@omoi.com", companyId: "omoikaneinnovations", role: "employee" }
{ email: "padmanabh@omoi.com", companyId: "omoikaneinnovations", role: "manager" }
{ email: "shambuling@omoi.com", companyId: "omoikaneinnovations", role: "employee" }
{ email: "lata@omoi.com", companyId: "omoikaneinnovations", role: "employee" }

// TalentHub Solutions employees (if any)
{ email: "talentemployee@talenthub.com", companyId: "company-a", role: "employee" }
// ... etc
```

## 🧪 Test After Setup

### Test 1: Aishwarya CANNOT access TalentHub ❌
1. Go to: `http://localhost:5176` (TalentHub Solutions)
2. Login with: `Aishwarya@company.com`
3. Expected: **"Access denied: You do not have permission to access this company portal"**

### Test 2: TalentHub employee CAN access TalentHub ✅
1. Go to: `http://localhost:5176` (TalentHub Solutions)
2. Login with: `talentemployee@talenthub.com`
3. Expected: **Login successful**

### Test 3: Nikita CANNOT access TalentHub ❌
1. Go to: `http://localhost:5176` (TalentHub Solutions)
2. Login with: `nikita@omoi.com`
3. Expected: **"Access denied"**

### Test 4: Mahesh CANNOT access WorkForce Pro ❌
1. Go to: `http://localhost:5177` (WorkForce Pro)
2. Login with: `mahesh@omoi.com`
3. Expected: **"Access denied"**

## 🔧 Troubleshooting

### If Aishwarya can still login to TalentHub:

```javascript
// 1. Check her companyId
db.users.findOne({ email: "Aishwarya@company.com" }, { email: 1, companyId: 1 })

// 2. If it's not "omoikaneinnovations", fix it:
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: "omoikaneinnovations" }}
)

// 3. Verify the change:
db.users.findOne({ email: "Aishwarya@company.com" }, { email: 1, companyId: 1 })
// Should show: { email: "Aishwarya@company.com", companyId: "omoikaneinnovations" }
```

### If a user needs to be moved to a different company:

```javascript
// Example: Move user from company-a to company-b
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { companyId: "company-b" }}
)
```

### If you need to remove company assignment (for testing):

```javascript
// Remove companyId from a user
db.users.updateOne(
  { email: "testuser@example.com" },
  { $unset: { companyId: "" }}
)
```

## 📊 Useful Queries

```javascript
// Find all Omoikaneinnovations employees
db.users.find(
  { companyId: "omoikaneinnovations" },
  { email: 1, name: 1, role: 1, _id: 0 }
).pretty()

// Find all employees in a specific company
db.users.find(
  { companyId: "company-a" },
  { email: 1, name: 1, role: 1, _id: 0 }
).pretty()

// Count employees per company
db.users.aggregate([
  { $group: { _id: "$companyId", total: { $sum: 1 }}}
])

// Find users with email containing specific text
db.users.find(
  { email: { $regex: "aish", $options: "i" }},
  { email: 1, companyId: 1, _id: 0 }
)
```

## ✅ Success Checklist

- [ ] All Omoi employees have `companyId: "omoikaneinnovations"`
- [ ] Aishwarya has `companyId: "omoikaneinnovations"`
- [ ] Nikita has `companyId: "omoikaneinnovations"`  
- [ ] Mahesh has `companyId: "omoikaneinnovations"`
- [ ] All TalentHub employees have `companyId: "company-a"`
- [ ] No users have null or empty companyId
- [ ] Tested: Omoi users CANNOT login to TalentHub
- [ ] Tested: TalentHub users CAN login to TalentHub

## 🚀 Ready to Test!

After running these commands:

1. **Restart backend** (just to be safe, not required)
2. **Open TalentHub portal**: `http://localhost:5176`
3. **Try logging in with Aishwarya's account**
4. **Should see**: "Access denied" message ✅
5. **Success!** Tenant isolation is working!

---

**Need help?** Check the backend console logs for detailed tenant validation messages.
