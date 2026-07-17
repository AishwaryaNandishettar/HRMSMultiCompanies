# 🚀 Quick Reference: Company Isolation

## TL;DR - The Rule

**ONE Employee → ONE Portal ONLY**

- Omoi → Port 5173 ✅
- TalentHub → Port 5176 ✅
- WorkforcePro → Port 5177 ✅
- PeopleSync → Port 5178 ✅

**No cross-access allowed! 🔒**

---

## Employee Types

| Employee | companyId | Portal |
|----------|-----------|--------|
| Omoi | `null` | 5173 |
| TalentHub | `"company-a"` | 5176 |
| WorkforcePro | `"company-b"` | 5177 |
| PeopleSync | `"company-c"` | 5178 |

---

## Files Changed

1. `src/main/java/com/omoikaneinnovation/hmrsbackend/controller/AuthController.java`
   - Added strict two-way validation
   - Client portals: Check `companyId` matches `tenantId`
   - Omoi portal: Check `companyId` is `null`

2. `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/model/DataLoader.java`
   - Remove `"omoi"` string from companyId
   - Set Omoi employees to `null` companyId
   - Preserve client companyIds

---

## Quick Test

### Test Omoi Employee
```bash
# User: admin@omoi.com (companyId = null)
✅ http://localhost:5173 → SUCCESS
❌ http://localhost:5176 → BLOCKED
❌ http://localhost:5177 → BLOCKED
❌ http://localhost:5178 → BLOCKED
```

### Test TalentHub Employee
```bash
# User: john@talenthub.com (companyId = "company-a")
❌ http://localhost:5173 → BLOCKED
✅ http://localhost:5176 → SUCCESS
❌ http://localhost:5177 → BLOCKED
❌ http://localhost:5178 → BLOCKED
```

---

## Validation Logic

### Client Portal (5176, 5177, 5178)
```
if (tenantId exists) {
  if (user.companyId == null) → ❌ BLOCK
  if (user.companyId != tenantId) → ❌ BLOCK
  else → ✅ ALLOW
}
```

### Omoi Portal (5173)
```
if (tenantId is empty) {
  if (user.companyId != null) → ❌ BLOCK (redirect to correct portal)
  else → ✅ ALLOW
}
```

---

## Error Messages

### Wrong Client Portal
```
Access denied: You do not have permission to access this company portal. 
Please login through your company's portal.
```

### Client → Omoi Portal
```
Access denied: Please login through [Company] portal (port XXXX). 
This portal is only for Omoi employees.
```

### Omoi → Client Portal
```
Access denied: Your account is not associated with any company. 
Please contact your administrator.
```

---

## Backend Console Logs

### Success
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: company-a
  Portal Type: Client Portal (company-a)
✅ Tenant validation passed for client portal
```

### Failure
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-b
  User Company ID: company-a
  Portal Type: Client Portal (company-b)
❌ Login denied: Tenant mismatch
   Expected: company-a
   Attempted: company-b
```

---

## Data Migration (Automatic)

On backend startup:
```
✅ Reset Omoi User to null companyId: admin@omoi.com
✅ Client user preserved: john@talenthub.com → company-a
ℹ️  User already has null companyId (Omoi): test@omoi.com
```

---

## Troubleshooting

### User can't login to correct portal
**Check companyId in MongoDB:**
```javascript
db.users.find({ email: "user@email.com" }, { email: 1, companyId: 1 })
```

**Expected values:**
- Omoi: `companyId: null` or `companyId: ""`
- TalentHub: `companyId: "company-a"`
- WorkforcePro: `companyId: "company-b"`
- PeopleSync: `companyId: "company-c"`

### User has "omoi" string instead of null
**Fix:**
```javascript
db.users.updateMany(
  { companyId: "omoi" },
  { $set: { companyId: null } }
)
```

---

## ✅ Success Criteria

- [ ] Omoi employees can ONLY access port 5173
- [ ] TalentHub employees can ONLY access port 5176
- [ ] WorkforcePro employees can ONLY access port 5177
- [ ] PeopleSync employees can ONLY access port 5178
- [ ] Clear error messages guide users to correct portal
- [ ] Backend logs show validation process
- [ ] No cross-company access possible

---

## 🎉 Result

**Perfect isolation:**
- Omoi → ONLY Omoi ✅
- TalentHub → ONLY TalentHub ✅
- WorkforcePro → ONLY WorkforcePro ✅
- PeopleSync → ONLY PeopleSync ✅

**No logic changed - just added validation! 🔒**
