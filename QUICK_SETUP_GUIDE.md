# Quick Setup Guide for Multi-Tenant Login Isolation

## ⚡ Quick Summary

**Problem**: Omoikaneinnovations employees (Aishwarya, Nikita, Mahesh) can login to TalentHub Solutions portal, but they shouldn't.

**Solution**: Each user must have a `companyId` field that matches the portal they're accessing.

## 🚀 Step-by-Step Setup

### Step 1: Connect to MongoDB

```bash
# Connect to your MongoDB
mongosh

# Or with connection string
mongosh "mongodb://localhost:27017/hrms_db"
```

### Step 2: Check Current User Data

```javascript
// Use your database
use hrms_db

// See all users and their current companyId
db.users.find({}, { email: 1, companyId: 1, name: 1 }).pretty()
```

### Step 3: Assign Company IDs

Choose the method that fits your data:

#### Method A: Assign by Specific Emails

```javascript
// TalentHub Solutions employees
db.users.updateMany(
  { email: { $in: [
    "talentemployee@talenthub.com",
    "talentmanager@talenthub.com"
  ]}},
  { $set: { companyId: "company-a" }}
)

// WorkForce Pro employees
db.users.updateMany(
  { email: { $in: [
    "workforceemployee@workforce.com"
  ]}},
  { $set: { companyId: "company-b" }}
)

// PeopleSync Enterprise employees
db.users.updateMany(
  { email: { $in: [
    "peoplesyncemp@peoplesync.com"
  ]}},
  { $set: { companyId: "company-c" }}
)

// Omoikaneinnovations employees (SHOULD NOT ACCESS OTHER PORTALS)
db.users.updateMany(
  { email: { $in: [
    "Aishwarya@company.com",
    "aishwarya@omoi.com",
    "nikita@omoi.com",
    "nikitaadigennavar@gmail.com",
    "mahesh@omoi.com"
  ]}},
  { $set: { companyId: "omoikaneinnovations" }}
)
```

#### Method B: Assign by Email Domain (Faster)

```javascript
// All @talenthub.com → company-a
db.users.updateMany(
  { email: { $regex: "@talenthub\\.com$", $options: "i" }},
  { $set: { companyId: "company-a" }}
)

// All @workforce.com → company-b
db.users.updateMany(
  { email: { $regex: "@workforce\\.com$", $options: "i" }},
  { $set: { companyId: "company-b" }}
)

// All @peoplesync.com → company-c
db.users.updateMany(
  { email: { $regex: "@peoplesync\\.com$", $options: "i" }},
  { $set: { companyId: "company-c" }}
)

// All @omoi.com or @company.com → omoikaneinnovations
db.users.updateMany(
  { email: { $regex: "@(omoi|company)\\.com$", $options: "i" }},
  { $set: { companyId: "omoikaneinnovations" }}
)
```

### Step 4: Verify Setup

```javascript
// Count users per company
db.users.aggregate([
  { $group: { _id: "$companyId", count: { $sum: 1 } }},
  { $sort: { _id: 1 }}
])

// Check specific user
db.users.findOne({ email: "Aishwarya@company.com" }, { email: 1, companyId: 1 })
```

Expected output:
```javascript
{
  email: "Aishwarya@company.com",
  companyId: "omoikaneinnovations"  // ✅ Should be this
}
```

### Step 5: Test Login

#### Test 1: Correct Portal ✅
1. Go to **localhost:5176** (TalentHub Solutions)
2. Login with **talentemployee@talenthub.com**
3. Result: **Login successful** ✅

#### Test 2: Wrong Portal ❌
1. Go to **localhost:5176** (TalentHub Solutions)
2. Login with **Aishwarya@company.com** (Omoikaneinnovations)
3. Result: **"Access denied: You do not have permission to access this company portal"** ❌

## 📋 Company Portal URLs

| Company | Tenant ID | Local URL | Port |
|---------|-----------|-----------|------|
| TalentHub Solutions | company-a | localhost:5176 | 5176 |
| WorkForce Pro | company-b | localhost:5177 | 5177 |
| PeopleSync Enterprise | company-c | localhost:5178 | 5178 |
| Omoikaneinnovations | omoikaneinnovations | localhost:5173 | 5173 |

## 🔍 Troubleshooting

### Issue: User gets "Access denied"
**Solution**: Check their companyId matches the portal

```javascript
// Check user's companyId
db.users.findOne(
  { email: "user@example.com" },
  { email: 1, companyId: 1 }
)

// Fix it if wrong
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { companyId: "company-a" }}
)
```

### Issue: User gets "No company assigned"
**Solution**: User has null or missing companyId

```javascript
// Assign company
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { companyId: "company-a" }}
)
```

### Issue: All users can access any portal
**Solution**: Check backend is receiving tenantId

1. Check browser console for login request
2. Should see: `tenantId: "company-a"`
3. Check backend logs for: `TENANT ID: company-a`

## 📝 Quick Reference Commands

```javascript
// 1. List all users without companyId
db.users.find({ companyId: { $exists: false }}, { email: 1 })

// 2. List all users with null companyId
db.users.find({ companyId: null }, { email: 1 })

// 3. List all users with empty companyId
db.users.find({ companyId: "" }, { email: 1 })

// 4. Count users per company
db.users.aggregate([
  { $group: { _id: "$companyId", count: { $sum: 1 }}}
])

// 5. Fix a specific user
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { companyId: "company-a" }}
)

// 6. Remove companyId (for testing)
db.users.updateOne(
  { email: "test@example.com" },
  { $unset: { companyId: "" }}
)
```

## ✅ Verification Checklist

- [ ] All TalentHub employees have `companyId: "company-a"`
- [ ] All WorkForce Pro employees have `companyId: "company-b"`
- [ ] All PeopleSync employees have `companyId: "company-c"`
- [ ] All Omoikaneinnovations employees have `companyId: "omoikaneinnovations"`
- [ ] Omoikaneinnovations users CANNOT login to TalentHub portal
- [ ] Each company's users can ONLY login to their portal
- [ ] Backend logs show tenant validation messages

## 🎯 Expected Behavior After Setup

| User | Portal | Result |
|------|--------|--------|
| talentemployee@talenthub.com | TalentHub (5176) | ✅ Success |
| talentemployee@talenthub.com | WorkForce (5177) | ❌ Access Denied |
| Aishwarya@company.com | TalentHub (5176) | ❌ Access Denied |
| Aishwarya@company.com | Omoi (5173) | ✅ Success |
| workforceemployee@workforce.com | WorkForce (5177) | ✅ Success |
| workforceemployee@workforce.com | TalentHub (5176) | ❌ Access Denied |

## 🚨 Important Notes

1. **Case Sensitive**: Email matching is case-sensitive in MongoDB by default
2. **Regex Patterns**: Use `$options: "i"` for case-insensitive email matching
3. **Backend Restart**: Not needed - changes take effect immediately
4. **Frontend Restart**: Not needed - tenantId is read from .env file at build time
5. **Database Backup**: Consider backing up before bulk updates

## 💡 Pro Tips

1. **Use email domains** for bulk assignment when possible
2. **Keep a list** of which emails belong to which company
3. **Test with one user** from each company first
4. **Check backend logs** for detailed validation messages
5. **Document company assignments** for future reference

## 🆘 Need Help?

1. Check backend console for detailed logs
2. Verify .env file has correct `VITE_TENANT_ID`
3. Ensure MongoDB updates were successful
4. Test with a known working user first
5. Review `MULTI_TENANT_LOGIN_FIX.md` for detailed explanation
