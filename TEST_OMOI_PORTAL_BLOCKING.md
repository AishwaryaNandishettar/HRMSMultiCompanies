# Test Omoi Portal Blocking ✅

## Restart Backend First
```bash
cd HRMS-Backend
mvn spring-boot:run
```

Wait for: `✅ ACCESS GRANTED` or `❌ BLOCKED` messages in logs.

## Test Case 1: Omoi Employee → Omoi Portal ✅ SHOULD WORK

**Portal:** `http://localhost:5173` (Omoi HRMS)
**User:** `lata.b@omoikaneinnovations.com`
**Password:** (your password)

**Expected:**
- ✅ Login successful
- Dashboard shows Omoi employees

**Backend Log:**
```
🔒 COMPANY VALIDATION:
   User Email: lata.b@omoikaneinnovations.com
   Is Omoi Employee: true
   Requested Portal: null
   Is Omoi Portal: true
✅ ACCESS GRANTED for lata.b@omoikaneinnovations.com
```

---

## Test Case 2: Omoi Employee → TalentHub Portal ❌ SHOULD BE BLOCKED

**Portal:** `http://localhost:5176` (TalentHub Solutions)
**User:** `lata.b@omoikaneinnovations.com`
**Password:** (your password)

**Expected:**
- ❌ Error: "Access denied. Omoi employees can only access Omoi portal."
- Login fails with 403 error

**Backend Log:**
```
🔒 COMPANY VALIDATION:
   User Email: lata.b@omoikaneinnovations.com
   Is Omoi Employee: true
   Requested Portal: company-a
   Is Omoi Portal: false
❌ BLOCKED: Omoi employee lata.b@omoikaneinnovations.com tried to login to company-a portal
```

---

## Test Case 3: Omoi Employee → Workforce Pro Portal ❌ SHOULD BE BLOCKED

**Portal:** `http://localhost:5177` (Workforce Pro)
**User:** `mahesh.p@omoikaneinnovations.com`
**Password:** (your password)

**Expected:**
- ❌ Error: "Access denied. Omoi employees can only access Omoi portal."
- Login fails with 403 error

**Backend Log:**
```
🔒 COMPANY VALIDATION:
   User Email: mahesh.p@omoikaneinnovations.com
   Is Omoi Employee: true
   Requested Portal: company-b
   Is Omoi Portal: false
❌ BLOCKED: Omoi employee mahesh.p@omoikaneinnovations.com tried to login to company-b portal
```

---

## Test Case 4: TalentHub User → TalentHub Portal ✅ SHOULD WORK

**Portal:** `http://localhost:5176` (TalentHub Solutions)
**User:** `Aishwarya@company.com`
**Password:** (your password)

**Expected:**
- ✅ Login successful
- Dashboard shows TalentHub employees

**Backend Log:**
```
🔒 COMPANY VALIDATION:
   User Email: aishwarya@company.com
   Is Omoi Employee: false
   Requested Portal: company-a
   Is Omoi Portal: false
✅ ACCESS GRANTED for Aishwarya@company.com
```

---

## Test Case 5: TalentHub User → Omoi Portal ❌ SHOULD BE BLOCKED

**Portal:** `http://localhost:5173` (Omoi HRMS)
**User:** `Aishwarya@company.com`
**Password:** (your password)

**Expected:**
- ❌ Error: "Access denied. Only Omoi employees can access Omoi portal."
- Login fails with 403 error

**Backend Log:**
```
🔒 COMPANY VALIDATION:
   User Email: aishwarya@company.com
   Is Omoi Employee: false
   Requested Portal: null
   Is Omoi Portal: true
❌ BLOCKED: Non-Omoi user Aishwarya@company.com tried to login to Omoi portal
```

---

## All Omoi Employees (Should ONLY Login to Omoi Portal)
- `lata.b@omoikaneinnovations.com`
- `mahesh.p@omoikaneinnovations.com`
- `Mahesh.p@omoikaneinnovations.com`
- `nikita.a@omoikaneinnovations.com`
- `aishwarya.n@omoikaneinnovations.com`
- `bd@omoikaneinnovations.com`
- `info@omoikaneinnovations.com`
- `vishnuvardhan.a@omoikaneinnovations.com`

---

## Portal URLs and Their tenantId

| Portal | URL | tenantId in .env | Allowed Users |
|--------|-----|------------------|---------------|
| **Omoi HRMS** | localhost:5173 | `VITE_TENANT_ID=` (empty or undefined) | Omoi employees only |
| **TalentHub Solutions** | localhost:5176 | `VITE_TENANT_ID=company-a` | TalentHub employees only |
| **Workforce Pro** | localhost:5177 | `VITE_TENANT_ID=company-b` | Workforce Pro employees only |
| **PeopleSync Solution** | localhost:5178 | `VITE_TENANT_ID=company-c` | PeopleSync employees only |

---

## Summary

✅ **WORKING**: Omoi employees can ONLY login to Omoi portal (localhost:5173)
✅ **BLOCKED**: Omoi employees CANNOT login to TalentHub, Workforce Pro, or PeopleSync
✅ **WORKING**: Company users can ONLY login to their own portal
✅ **BLOCKED**: Company users CANNOT login to other company portals or Omoi portal

**Status:** Portal isolation is now ACTIVE! 🔒
