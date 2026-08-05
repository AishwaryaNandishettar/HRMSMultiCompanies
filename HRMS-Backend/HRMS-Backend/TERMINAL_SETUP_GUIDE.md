# 💻 Terminal Setup Guide: Running All 4 Portals

## 🎯 Goal

Run all 4 portals simultaneously to test company isolation.

---

## 📋 You Need 5 Terminals Total

```
Terminal 1: Backend (Port 8082)
Terminal 2: Omoi Portal (Port 5173)
Terminal 3: TalentHub Portal (Port 5176)
Terminal 4: WorkforcePro Portal (Port 5177)
Terminal 5: PeopleSync Portal (Port 5178)
```

---

## 🖥️ Visual Terminal Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR SCREEN                             │
├──────────────────────┬──────────────────────────────────────┤
│  Terminal 1          │  Terminal 2                          │
│  Backend (8082)      │  Omoi Portal (5173)                  │
│                      │                                      │
│  cd HRMS-Backend     │  cd HRMS-Frontend                    │
│  ./mvnw spring-boot  │  npm run dev                         │
│  :run                │                                      │
├──────────────────────┼──────────────────────────────────────┤
│  Terminal 3          │  Terminal 4                          │
│  TalentHub (5176)    │  WorkforcePro (5177)                │
│                      │                                      │
│  cd HRMS-Frontend    │  cd HRMS-Frontend                    │
│  npm run dev:        │  npm run dev:                        │
│  company-a           │  company-b                           │
├──────────────────────┴──────────────────────────────────────┤
│  Terminal 5                                                 │
│  PeopleSync Portal (5178)                                   │
│                                                             │
│  cd HRMS-Frontend                                           │
│  npm run dev:company-c                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step Setup

### Terminal 1: Backend 🔧

```bash
# Open first terminal
cd HRMS-Backend
./mvnw spring-boot:run
```

**Wait for:**
```
Started HmrsBackendApplication in X.XXX seconds

✅ Reset Omoi User to null companyId: admin@omoi.com
✅ Client user preserved: john@talenthub.com → company-a
```

**Status:** ✅ Backend running on http://localhost:8082

---

### Terminal 2: Omoi Portal 🏢

```bash
# Open second terminal (NEW terminal, don't close Terminal 1!)
cd HRMS-Frontend
npm run dev
```

**Wait for:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Status:** ✅ Omoi portal running on http://localhost:5173

---

### Terminal 3: TalentHub Portal 🎯

```bash
# Open third terminal (NEW terminal!)
cd HRMS-Frontend
npm run dev:company-a
```

**Wait for:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5176/
  ➜  Network: use --host to expose
```

**Status:** ✅ TalentHub portal running on http://localhost:5176

---

### Terminal 4: WorkforcePro Portal 💼

```bash
# Open fourth terminal (NEW terminal!)
cd HRMS-Frontend
npm run dev:company-b
```

**Wait for:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5177/
  ➜  Network: use --host to expose
```

**Status:** ✅ WorkforcePro portal running on http://localhost:5177

---

### Terminal 5: PeopleSync Portal 👥

```bash
# Open fifth terminal (NEW terminal!)
cd HRMS-Frontend
npm run dev:company-c
```

**Wait for:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5178/
  ➜  Network: use --host to expose
```

**Status:** ✅ PeopleSync portal running on http://localhost:5178

---

## ✅ Verification Checklist

Open your browser and check all portals are accessible:

```
[ ] http://localhost:5173 → Shows "Omoi HR Works"
[ ] http://localhost:5176 → Shows "TalentHub Solutions" with TH logo
[ ] http://localhost:5177 → Shows "WorkforcePro" with WP logo
[ ] http://localhost:5178 → Shows "PeopleSync Enterprise" with PS logo
[ ] http://localhost:8082 → Backend running (you won't see UI, just check no errors in terminal)
```

---

## 📊 Port Summary

| Service | Port | Command | Logo/Name |
|---------|------|---------|-----------|
| Backend | 8082 | `./mvnw spring-boot:run` | N/A |
| Omoi | 5173 | `npm run dev` | Omoi HR Works |
| TalentHub | 5176 | `npm run dev:company-a` | TH (TalentHub Solutions) |
| WorkforcePro | 5177 | `npm run dev:company-b` | WP (WorkforcePro) |
| PeopleSync | 5178 | `npm run dev:company-c` | PS (PeopleSync Enterprise) |

---

## 🔍 How to Check Each Portal

### Check Omoi Portal (5173)
```bash
# In browser:
http://localhost:5173

# Should show:
- Company Name: "Omoi HR Works"
- Logo: Omoi logo (or "OH" initials)
```

---

### Check TalentHub Portal (5176)
```bash
# In browser:
http://localhost:5176

# Should show:
- Company Name: "TalentHub Solutions"
- Logo: "TH" initials with custom color
```

---

### Check WorkforcePro Portal (5177)
```bash
# In browser:
http://localhost:5177

# Should show:
- Company Name: "WorkforcePro"
- Logo: "WP" initials with custom color
```

---

### Check PeopleSync Portal (5178)
```bash
# In browser:
http://localhost:5178

# Should show:
- Company Name: "PeopleSync Enterprise"
- Logo: "PS" initials with custom color
```

---

## 🛑 How to Stop All Services

### Stop Frontend Portals
In each frontend terminal (2, 3, 4, 5), press:
```
Ctrl + C
```

### Stop Backend
In backend terminal (1), press:
```
Ctrl + C
```

---

## 🔄 Restart Individual Portal

If you need to restart just one portal:

```bash
# The portal will keep running in the terminal
# To restart:
1. Press Ctrl + C to stop
2. Run the command again:
   - npm run dev (for Omoi)
   - npm run dev:company-a (for TalentHub)
   - npm run dev:company-b (for WorkforcePro)
   - npm run dev:company-c (for PeopleSync)
```

---

## 🚨 Common Issues

### Issue 1: "Port already in use"
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution:**
```bash
# Windows - Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Then run the command again
```

---

### Issue 2: "Module not found"
```
Error: Cannot find module 'vite'
```

**Solution:**
```bash
# Install dependencies
cd HRMS-Frontend
npm install

# Then run the portal command again
```

---

### Issue 3: Terminal closes when you run command
**Reason:** Command finished immediately (might be an error)

**Solution:**
1. Check if you're in the correct directory
2. Check if `package.json` exists
3. Make sure dependencies are installed: `npm install`

---

## 📝 Quick Commands Reference

```bash
# ========== BACKEND ==========
cd HRMS-Backend
./mvnw spring-boot:run

# ========== OMOI PORTAL ==========
cd HRMS-Frontend
npm run dev

# ========== TALENTHUB PORTAL ==========
cd HRMS-Frontend
npm run dev:company-a

# ========== WORKFORCEPRO PORTAL ==========
cd HRMS-Frontend
npm run dev:company-b

# ========== PEOPLESYNC PORTAL ==========
cd HRMS-Frontend
npm run dev:company-c
```

---

## 🎯 What's Next?

Once all 5 terminals are running:

1. ✅ All terminals show "ready" or "started" messages
2. ✅ All 4 portals are accessible in browser
3. ✅ Each portal shows correct branding

**→ Go to STEP_BY_STEP_TESTING_GUIDE.md to start testing! 🚀**

---

## 💡 Pro Tips

### Tip 1: Use Terminal Tabs
Most terminals support tabs. Use tabs instead of separate windows:
- Tab 1: Backend
- Tab 2: Omoi Portal  
- Tab 3: TalentHub Portal
- Tab 4: WorkforcePro Portal
- Tab 5: PeopleSync Portal

### Tip 2: Name Your Tabs
Rename each tab for easy identification:
- "Backend 8082"
- "Omoi 5173"
- "TalentHub 5176"
- "WorkforcePro 5177"
- "PeopleSync 5178"

### Tip 3: Browser Tabs
Arrange your browser tabs in the same order:
```
Tab 1: http://localhost:5173 (Omoi)
Tab 2: http://localhost:5176 (TalentHub)
Tab 3: http://localhost:5177 (WorkforcePro)
Tab 4: http://localhost:5178 (PeopleSync)
```

---

## ✅ Ready to Test!

Once all terminals show "ready" or "started":

```
✅ Terminal 1: Backend running on port 8082
✅ Terminal 2: Omoi portal on http://localhost:5173
✅ Terminal 3: TalentHub portal on http://localhost:5176
✅ Terminal 4: WorkforcePro portal on http://localhost:5177
✅ Terminal 5: PeopleSync portal on http://localhost:5178
```

**→ Start testing with STEP_BY_STEP_TESTING_GUIDE.md! 🎉**
