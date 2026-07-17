# Deploy 4 Vercel Portals (Multi-Tenant HRMS)

## Overview
You'll create **4 separate Vercel deployments** from the same GitHub repository:

1. **Omoi HRMS** - Main company portal (no tenantId)
2. **TalentHub Solutions** - Client portal (tenantId: company-a)
3. **Workforce Pro** - Client portal (tenantId: company-b)
4. **PeopleSync Solution** - Client portal (tenantId: company-c)

## Prerequisites
✅ Code pushed to GitHub: https://github.com/AishwaryaNandishettar/HRMSMultiCompanies
✅ Backend on Render: https://finalhrmsapplication.onrender.com

## Step-by-Step Deployment

### Portal 1: Omoi HRMS (Main Portal)

#### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click **"Add New"** → **"Project"**

#### 2. Import Repository
- Select **"Import Git Repository"**
- Choose: `AishwaryaNandishettar/HRMSMultiCompanies`
- Click **"Import"**

#### 3. Configure Project
- **Project Name**: `hrms-omoi` (or `omoi-hrms-portal`)
- **Framework Preset**: Vite
- **Root Directory**: `HRMS-Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 4. Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL=https://finalhrmsapplication.onrender.com
VITE_TENANT_ID=
VITE_COMPANY_NAME=OMOI HRMS
```

**Important**: Leave `VITE_TENANT_ID` empty (no value)

#### 5. Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- You'll get a URL like: `https://hrms-omoi.vercel.app`

---

### Portal 2: TalentHub Solutions

#### 1. Create New Project
- Go back to Vercel dashboard
- Click **"Add New"** → **"Project"**

#### 2. Import Same Repository
- Select: `AishwaryaNandishettar/HRMSMultiCompanies`
- Click **"Import"**

#### 3. Configure Project
- **Project Name**: `talenthub-solutions` (or `hrms-talenthub`)
- **Framework Preset**: Vite
- **Root Directory**: `HRMS-Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 4. Environment Variables
```
VITE_API_BASE_URL=https://finalhrmsapplication.onrender.com
VITE_TENANT_ID=company-a
VITE_COMPANY_NAME=TalentHub Solutions
```

#### 5. Deploy
- Click **"Deploy"**
- You'll get: `https://talenthub-solutions.vercel.app`

---

### Portal 3: Workforce Pro

#### 1. Create New Project
- Click **"Add New"** → **"Project"**
- Import: `AishwaryaNandishettar/HRMSMultiCompanies`

#### 2. Configure Project
- **Project Name**: `workforce-pro` (or `hrms-workforce`)
- **Framework Preset**: Vite
- **Root Directory**: `HRMS-Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 3. Environment Variables
```
VITE_API_BASE_URL=https://finalhrmsapplication.onrender.com
VITE_TENANT_ID=company-b
VITE_COMPANY_NAME=Workforce Pro
```

#### 4. Deploy
- You'll get: `https://workforce-pro.vercel.app`

---

### Portal 4: PeopleSync Solution

#### 1. Create New Project
- Click **"Add New"** → **"Project"**
- Import: `AishwaryaNandishettar/HRMSMultiCompanies`

#### 2. Configure Project
- **Project Name**: `peoplesync-solution` (or `hrms-peoplesync`)
- **Framework Preset**: Vite
- **Root Directory**: `HRMS-Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 3. Environment Variables
```
VITE_API_BASE_URL=https://finalhrmsapplication.onrender.com
VITE_TENANT_ID=company-c
VITE_COMPANY_NAME=PeopleSync Solution
```

#### 4. Deploy
- You'll get: `https://peoplesync-solution.vercel.app`

---

## Final Deployment URLs

After all deployments complete, you'll have:

| Portal | Vercel URL | Tenant ID | Users |
|--------|-----------|-----------|-------|
| **Omoi HRMS** | https://hrms-omoi.vercel.app | (none) | Omoi employees only |
| **TalentHub Solutions** | https://talenthub-solutions.vercel.app | company-a | TalentHub employees only |
| **Workforce Pro** | https://workforce-pro.vercel.app | company-b | Workforce employees only |
| **PeopleSync Solution** | https://peoplesync-solution.vercel.app | company-c | PeopleSync employees only |

## Backend Configuration

Your Render backend already handles multi-tenancy! No changes needed.

**Backend URL**: https://finalhrmsapplication.onrender.com

## Testing After Deployment

### Test Omoi Portal
1. Go to: `https://hrms-omoi.vercel.app`
2. Login: `lata.b@omoikaneinnovations.com`
3. Should work ✅

### Test TalentHub Portal
1. Go to: `https://talenthub-solutions.vercel.app`
2. Login: `Aishwarya@company.com` (if companyId = company-a)
3. Should work ✅

### Test Portal Isolation
1. Try logging into **TalentHub** with `lata.b@omoikaneinnovations.com`
2. Should get: **"Access denied. Omoi employees can only access Omoi portal."** ✅

## Vercel Dashboard Management

Each portal will appear as a separate project in your Vercel dashboard:
- `hrms-omoi`
- `talenthub-solutions`
- `workforce-pro`
- `peoplesync-solution`

You can manage them independently:
- View logs
- Redeploy
- Update environment variables
- Configure custom domains

## Custom Domains (Optional)

If you have domains, you can add them in Vercel:
- `hrms.omoikaneinnovations.com` → Omoi portal
- `app.talenthub.com` → TalentHub portal
- `app.workforcepro.com` → Workforce Pro
- `app.peoplesync.com` → PeopleSync

## Auto-Deployment

Vercel will automatically redeploy when you push to GitHub main branch!

## Troubleshooting

### Build Fails
- Check that `HRMS-Frontend` is set as Root Directory
- Verify `package.json` exists in HRMS-Frontend
- Check build logs for errors

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check browser console for loaded values

### CORS Errors
- Verify backend allows Vercel URLs
- Check `@CrossOrigin` in backend controllers
- Add new Vercel URLs to CORS config if needed

## Status
Ready to deploy! Follow the steps above to create all 4 portals.
