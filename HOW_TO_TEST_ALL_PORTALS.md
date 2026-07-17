# ✅ YES! You're Testing Correctly!

## 🎯 Your Commands Are Perfect!

You said:
> "npm run dev for omoi hr works
> npm run dev:company-a for talent hub
> npm run dev:company-b for workforce pro  
> npm run dev:company-c for people sync"

**✅ That's EXACTLY right!** 

---

## 🚀 Complete Testing Commands

### 1. Start Backend (Terminal 1)
```bash
cd HRMS-Backend
./mvnw spring-boot:run
```
**Port:** 8082

---

### 2. Start Omoi Portal (Terminal 2)
```bash
cd HRMS-Frontend
npm run dev
```
**Port:** 5173
**URL:** http://localhost:5173
**Shows:** Omoi HR Works

---

### 3. Start TalentHub Portal (Terminal 3)
```bash
cd HRMS-Frontend
npm run dev:company-a
```
**Port:** 5176
**URL:** http://localhost:5176
**Shows:** TalentHub Solutions (TH logo)

---

### 4. Start WorkforcePro Portal (Terminal 4)
```bash
cd HRMS-Frontend
npm run dev:company-b
```
**Port:** 5177
**URL:** http://localhost:5177
**Shows:** WorkforcePro (WP logo)

---

### 5. Start PeopleSync Portal (Terminal 5)
```bash
cd HRMS-Frontend
npm run dev:company-c
```
**Port:** 5178
**URL:** http://localhost:5178
**Shows:** PeopleSync Enterprise (PS logo)

---

## 📊 Quick Summary

| Portal | Command | Port | URL |
|--------|---------|------|-----|
| Backend | `./mvnw spring-boot:run` | 8082 | N/A |
| Omoi | `npm run dev` | 5173 | http://localhost:5173 |
| TalentHub | `npm run dev:company-a` | 5176 | http://localhost:5176 |
| WorkforcePro | `npm run dev:company-b` | 5177 | http://localhost:5177 |
| PeopleSync | `npm run dev:company-c` | 5178 | http://localhost:5178 |

---

## 🧪 Testing Process

### Step 1: Open 5 Terminals
- Terminal 1 → Backend
- Terminal 2 → Omoi Portal
- Terminal 3 → TalentHub Portal
- Terminal 4 → WorkforcePro Portal
- Terminal 5 → PeopleSync Portal

### Step 2: Run Commands
Run the commands above in each terminal (keep all terminals open!)

### Step 3: Verify in Browser
Open 4 browser tabs:
1. http://localhost:5173 → Omoi
2. http://localhost:5176 → TalentHub
3. http://localhost:5177 → WorkforcePro
4. http://localhost:5178 → PeopleSync

### Step 4: Test Login
Try logging in with different users to different portals:

**Omoi Employee (companyId = null):**
```
Email: admin@omoi.com
Password: admin123

✅ Can login to http://localhost:5173 (Omoi)
❌ BLOCKED from http://localhost:5176 (TalentHub)
❌ BLOCKED from http://localhost:5177 (WorkforcePro)
❌ BLOCKED from http://localhost:5178 (PeopleSync)
```

**TalentHub Employee (companyId = "company-a"):**
```
Email: john@talenthub.com
Password: password

❌ BLOCKED from http://localhost:5173 (Omoi)
✅ Can login to http://localhost:5176 (TalentHub)
❌ BLOCKED from http://localhost:5177 (WorkforcePro)
❌ BLOCKED from http://localhost:5178 (PeopleSync)
```

---

## 🎯 What You Should See

### When Testing Omoi Employee on Omoi Portal (5173) ✅
**Expected:**
- Login succeeds
- Redirects to Home
- Shows Omoi branding

**Backend Console:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: (empty)
  User Company ID: null
  Portal Type: Default HRMS Portal (Omoi)
✅ Validation passed for Omoi portal
```

---

### When Testing Omoi Employee on TalentHub Portal (5176) ❌
**Expected:**
- Login FAILS
- Shows error: "Access denied: Your account is not associated with any company"
- Stays on login page

**Backend Console:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: null
  Portal Type: Client Portal (company-a)
❌ Login denied: User has no company assigned
```

---

### When Testing TalentHub Employee on Omoi Portal (5173) ❌
**Expected:**
- Login FAILS
- Shows error: "Access denied: Please login through TalentHub portal (port 5176). This portal is only for Omoi employees."
- Stays on login page

**Backend Console:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: (empty)
  User Company ID: company-a
  Portal Type: Default HRMS Portal (Omoi)
❌ Login denied: Client employee attempting to access Omoi portal
   User belongs to: company-a
```

---

### When Testing TalentHub Employee on TalentHub Portal (5176) ✅
**Expected:**
- Login succeeds
- Redirects to Home
- Shows TalentHub branding (TH logo)

**Backend Console:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: company-a
  Portal Type: Client Portal (company-a)
✅ Tenant validation passed for client portal
```

---

## ✅ Success Checklist

Complete this as you test:

- [ ] Backend started (port 8082)
- [ ] Omoi portal running (port 5173)
- [ ] TalentHub portal running (port 5176)
- [ ] WorkforcePro portal running (port 5177)
- [ ] PeopleSync portal running (port 5178)
- [ ] Each portal shows correct branding
- [ ] Omoi employee can ONLY access 5173
- [ ] TalentHub employee can ONLY access 5176
- [ ] WorkforcePro employee can ONLY access 5177
- [ ] PeopleSync employee can ONLY access 5178
- [ ] Error messages are clear
- [ ] Backend logs show validation

---

## 🔧 Troubleshooting

### Problem: "Port already in use"
**Solution:** Kill the process and try again
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Problem: Can't see backend logs
**Solution:** Check Terminal 1 where backend is running

### Problem: Wrong branding on portal
**Solution:** 
- Check you're on the correct URL
- Clear browser cache
- Refresh page (Ctrl + F5)

---

## 🎉 You're Ready!

Your commands are **100% correct**:
```bash
✅ npm run dev              → Omoi (5173)
✅ npm run dev:company-a    → TalentHub (5176)
✅ npm run dev:company-b    → WorkforcePro (5177)
✅ npm run dev:company-c    → PeopleSync (5178)
```

**Now open 5 terminals and start testing! 🚀**

**Need detailed steps?** → Read **STEP_BY_STEP_TESTING_GUIDE.md**

**Need terminal help?** → Read **TERMINAL_SETUP_GUIDE.md**
