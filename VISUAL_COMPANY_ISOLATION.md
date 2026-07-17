# 🎨 Visual Guide: Company Isolation

## 🔒 The Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    STRICT COMPANY ISOLATION                  │
│                   ONE Employee → ONE Portal                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  OMOI        │     │  TALENTHUB   │     │ WORKFORCEPRO │     │ PEOPLESYNC   │
│  Portal      │     │  Portal      │     │  Portal      │     │  Portal      │
│  Port 5173   │     │  Port 5176   │     │  Port 5177   │     │  Port 5178   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │ ONLY               │ ONLY               │ ONLY               │ ONLY
       ↓                    ↓                    ↓                    ↓
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Omoi         │     │ TalentHub    │     │ WorkforcePro │     │ PeopleSync   │
│ Employees    │     │ Employees    │     │ Employees    │     │ Employees    │
│              │     │              │     │              │     │              │
│ companyId:   │     │ companyId:   │     │ companyId:   │     │ companyId:   │
│   null       │     │  "company-a" │     │  "company-b" │     │  "company-c" │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘

       ❌                   ❌                   ❌                   ❌
    Cannot              Cannot              Cannot              Cannot
     Access             Access              Access              Access
   Other Portals      Other Portals      Other Portals      Other Portals
```

---

## 🚫 Access Denial Matrix

```
                     ┌─────────────────────────────────────────┐
                     │          ATTEMPTED ACCESS               │
┌────────────────────┼──────────┬──────────┬──────────┬───────┤
│                    │  Omoi    │ TalentHub│WorkForce │People │
│   USER TYPE        │  (5173)  │  (5176)  │ Pro(5177)│Sync   │
│                    │          │          │          │(5178) │
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ Omoi               │    ✅     │    ❌     │    ❌     │   ❌   │
│ (companyId=null)   │  SUCCESS │  BLOCKED │  BLOCKED │BLOCKED│
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ TalentHub          │    ❌     │    ✅     │    ❌     │   ❌   │
│ (company-a)        │  BLOCKED │  SUCCESS │  BLOCKED │BLOCKED│
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ WorkforcePro       │    ❌     │    ❌     │    ✅     │   ❌   │
│ (company-b)        │  BLOCKED │  BLOCKED │  SUCCESS │BLOCKED│
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ PeopleSync         │    ❌     │    ❌     │    ❌     │   ✅   │
│ (company-c)        │  BLOCKED │  BLOCKED │  BLOCKED │SUCCESS│
└────────────────────┴──────────┴──────────┴──────────┴───────┘
```

---

## 🔄 Login Flow Diagram

### Scenario 1: Omoi Employee → Omoi Portal ✅

```
User: admin@omoi.com (companyId = null)
Portal: http://localhost:5173 (Omoi)

┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Frontend sends │
│  email, password│
│  tenantId: ""   │  ← Empty for Omoi portal
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend: AuthController            │
│                                     │
│  1. Authenticate user               │
│  2. Check: requestTenantId empty?   │
│     ✅ YES (Omoi portal)             │
│  3. Check: userCompanyId null?      │
│     ✅ YES (Omoi employee)           │
│  4. Result: ALLOW LOGIN             │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────┐
│  ✅ LOGIN        │
│   SUCCESS       │
└─────────────────┘
```

---

### Scenario 2: Omoi Employee → TalentHub Portal ❌

```
User: admin@omoi.com (companyId = null)
Portal: http://localhost:5176 (TalentHub)

┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Frontend sends │
│  email, password│
│  tenantId:      │
│  "company-a"    │  ← TalentHub tenant
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend: AuthController            │
│                                     │
│  1. Authenticate user               │
│  2. Check: requestTenantId exists?  │
│     ✅ YES (company-a)               │
│  3. Check: userCompanyId exists?    │
│     ❌ NO (null)                     │
│  4. Result: BLOCK LOGIN             │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  ❌ ACCESS DENIED                    │
│  "Your account is not associated    │
│   with any company"                 │
└─────────────────────────────────────┘
```

---

### Scenario 3: TalentHub Employee → TalentHub Portal ✅

```
User: john@talenthub.com (companyId = "company-a")
Portal: http://localhost:5176 (TalentHub)

┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Frontend sends │
│  email, password│
│  tenantId:      │
│  "company-a"    │  ← TalentHub tenant
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend: AuthController            │
│                                     │
│  1. Authenticate user               │
│  2. Check: requestTenantId exists?  │
│     ✅ YES (company-a)               │
│  3. Check: userCompanyId exists?    │
│     ✅ YES (company-a)               │
│  4. Check: tenantId == companyId?   │
│     ✅ YES (company-a == company-a)  │
│  5. Result: ALLOW LOGIN             │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────┐
│  ✅ LOGIN        │
│   SUCCESS       │
└─────────────────┘
```

---

### Scenario 4: TalentHub Employee → Omoi Portal ❌

```
User: john@talenthub.com (companyId = "company-a")
Portal: http://localhost:5173 (Omoi)

┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Frontend sends │
│  email, password│
│  tenantId: ""   │  ← Empty for Omoi portal
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend: AuthController            │
│                                     │
│  1. Authenticate user               │
│  2. Check: requestTenantId empty?   │
│     ✅ YES (Omoi portal)             │
│  3. Check: userCompanyId null?      │
│     ❌ NO (company-a)                │
│  4. Identify user's company         │
│     → company-a = TalentHub         │
│  5. Result: BLOCK LOGIN             │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  ❌ ACCESS DENIED                    │
│  "Please login through TalentHub    │
│   portal (port 5176). This portal   │
│   is only for Omoi employees."      │
└─────────────────────────────────────┘
```

---

### Scenario 5: TalentHub Employee → WorkforcePro Portal ❌

```
User: john@talenthub.com (companyId = "company-a")
Portal: http://localhost:5177 (WorkforcePro)

┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Frontend sends │
│  email, password│
│  tenantId:      │
│  "company-b"    │  ← WorkforcePro tenant
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  Backend: AuthController            │
│                                     │
│  1. Authenticate user               │
│  2. Check: requestTenantId exists?  │
│     ✅ YES (company-b)               │
│  3. Check: userCompanyId exists?    │
│     ✅ YES (company-a)               │
│  4. Check: tenantId == companyId?   │
│     ❌ NO (company-b != company-a)   │
│  5. Result: BLOCK LOGIN             │
└────────┬────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  ❌ ACCESS DENIED                    │
│  "You do not have permission to     │
│   access this company portal.       │
│   Please login through your         │
│   company's portal."                │
└─────────────────────────────────────┘
```

---

## 🎯 Validation Decision Tree

```
                    ┌─────────────────────┐
                    │   Login Request     │
                    │   Received          │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │  Authenticate User  │
                    │  (Email + Password) │
                    └──────────┬──────────┘
                               │
                               ↓
                    ┌─────────────────────┐
                    │  Is tenantId        │
                    │  provided?          │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
           YES (Client Portal)           NO (Omoi Portal)
                │                             │
                ↓                             ↓
    ┌───────────────────────┐     ┌───────────────────────┐
    │ User has companyId?   │     │ User has companyId?   │
    └───────────┬───────────┘     └───────────┬───────────┘
                │                             │
        ┌───────┴───────┐             ┌───────┴───────┐
       YES             NO             YES             NO
        │               │               │               │
        ↓               ↓               ↓               ↓
    ┌───────┐      ┌───────┐      ┌───────┐      ┌───────┐
    │tenantId│      │ ❌     │      │ ❌     │      │ ✅     │
    │matches │      │BLOCK  │      │BLOCK  │      │ALLOW  │
    │companyId│     │       │      │       │      │       │
    └───┬───┘      └───────┘      └───────┘      └───────┘
        │
    ┌───┴───┐
   YES     NO
    │       │
    ↓       ↓
┌───────┐ ┌───────┐
│ ✅     │ │ ❌     │
│ALLOW  │ │BLOCK  │
└───────┘ └───────┘
```

---

## 📊 Data Structure

### Omoi Employee
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@omoi.com",
  "name": "Omoi Admin",
  "password": "$2a$10$...",
  "role": "ADMIN",
  "companyId": null,           ← NULL for Omoi
  "department": "IT"
}
```

### TalentHub Employee
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "email": "john@talenthub.com",
  "name": "John Doe",
  "password": "$2a$10$...",
  "role": "EMPLOYEE",
  "companyId": "company-a",    ← "company-a" for TalentHub
  "department": "HR"
}
```

### WorkforcePro Employee
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "email": "jane@workforcepro.com",
  "name": "Jane Smith",
  "password": "$2a$10$...",
  "role": "MANAGER",
  "companyId": "company-b",    ← "company-b" for WorkforcePro
  "department": "Finance"
}
```

### PeopleSync Employee
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "email": "bob@peoplesync.com",
  "name": "Bob Johnson",
  "password": "$2a$10$...",
  "role": "EMPLOYEE",
  "companyId": "company-c",    ← "company-c" for PeopleSync
  "department": "Operations"
}
```

---

## 🔑 Key Concepts

### 1. Tenant ID (Portal Identifier)
```
┌──────────────────────────────────────┐
│  Portal URL            tenantId      │
├──────────────────────────────────────┤
│  localhost:5173        (empty)       │  ← Omoi
│  localhost:5176        "company-a"   │  ← TalentHub
│  localhost:5177        "company-b"   │  ← WorkforcePro
│  localhost:5178        "company-c"   │  ← PeopleSync
└──────────────────────────────────────┘
```

### 2. Company ID (User Assignment)
```
┌──────────────────────────────────────┐
│  Employee Type         companyId     │
├──────────────────────────────────────┤
│  Omoi                  null          │
│  TalentHub             "company-a"   │
│  WorkforcePro          "company-b"   │
│  PeopleSync            "company-c"   │
└──────────────────────────────────────┘
```

### 3. Validation Rules
```
┌──────────────────────────────────────────────────────────┐
│  Portal Type    │  Validation Rule                       │
├─────────────────┼────────────────────────────────────────┤
│  Client Portal  │  tenantId MUST EQUAL user.companyId   │
│  (5176/77/78)   │  Example: "company-a" == "company-a"  │
├─────────────────┼────────────────────────────────────────┤
│  Omoi Portal    │  user.companyId MUST BE null          │
│  (5173)         │  Example: null == null                │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Result: Perfect Isolation

```
╔═══════════════════════════════════════════════════════════╗
║                  COMPANY ISOLATION ACHIEVED               ║
╠═══════════════════════════════════════════════════════════╣
║  ✅ Omoi          → ONLY Port 5173                        ║
║  ✅ TalentHub     → ONLY Port 5176                        ║
║  ✅ WorkforcePro  → ONLY Port 5177                        ║
║  ✅ PeopleSync    → ONLY Port 5178                        ║
║                                                           ║
║  🔒 No cross-company access possible                     ║
║  🔒 Clear error messages guide users                     ║
║  🔒 Backend logs show all validation                     ║
╚═══════════════════════════════════════════════════════════╝
```
