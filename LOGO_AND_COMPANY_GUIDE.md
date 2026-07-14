# 🎨 Logo & Company Management Guide

## Complete Guide for Managing Multi-Tenant Companies

---

## 📍 **WHERE EVERYTHING IS LOCATED**

### **1. Company Configurations (Theme Files)**

**Location:**
```
HRMS-Frontend/src/config/themes/
├── company-a.json  ← TalentHub Solutions (Blue)
├── company-b.json  ← WorkForce Pro (Green)
└── company-c.json  ← PeopleSync Enterprise (Purple)
```

**What's Inside Each File:**
```json
{
  "companyId": "company-a",
  "companyName": "TalentHub Solutions",  ← Company name shown everywhere
  "initials": "TH",                      ← Logo placeholder (TH/WP/PS)
  "colors": {
    "primary": "#1E40AF",                ← Main brand color
    "secondary": "#3B82F6",
    "accent": "#DBEAFE",
    ...
  },
  "logos": {
    "navigationLogo": "/logos/company-a/logo.png",     ← Nav bar logo
    "loginLogo": "/logos/company-a/logo-large.png",    ← Login screen logo
    "faviconPath": "/logos/company-a/favicon.ico"      ← Browser tab icon
  }
}
```

---

## 🏢 **HOW TO CHANGE COMPANY NAME**

### **Step 1: Edit Theme JSON File**

**For TalentHub Solutions (Company A):**
```bash
Open: HRMS-Frontend/src/config/themes/company-a.json
```

**Change this:**
```json
{
  "companyName": "TalentHub Solutions",  ← OLD NAME
  "initials": "TH"                       ← OLD INITIALS
}
```

**To this:**
```json
{
  "companyName": "Your Client Name Here",  ← NEW NAME
  "initials": "YCN"                        ← NEW INITIALS
}
```

### **Step 2: Save and Test**
```bash
npm run dev:company-a
```

### **Where the Name Appears:**
✅ Browser tab title: "Your Client Name Here - HRMS"
✅ Login screen: "Your Client Name Here"
✅ Navigation header: "Your Client Name Here"
✅ Footer: "Your Client Name Here"

---

## 🎨 **HOW TO CHANGE COMPANY LOGO**

### **Current Status:**
- Right now showing: **"TH"** (TalentHub), **"WP"** (WorkForce), **"PS"** (PeopleSync) initials
- Background: Blue/Green/Purple (based on primary color)

### **To Add Real Logo:**

#### **Step 1: Prepare Logo Files**

**Required Files:**
- `logo.png` or `logo.svg` - Navigation bar logo (48x48px minimum)
- `logo-large.png` or `logo-large.svg` - Login screen logo (120x120px minimum)
- `favicon.ico` - Browser tab icon (16x16, 32x32 pixels)

**File Requirements:**
- Format: PNG with transparent background OR SVG
- Max size: 500 KB for logos, 100 KB for favicon
- Aspect ratio: Square (1:1) recommended

#### **Step 2: Place Logo Files**

**For Company A (TalentHub):**
```
Copy files to: HRMS-Frontend/public/logos/company-a/
```

**File structure:**
```
HRMS-Frontend/public/logos/company-a/
├── logo.png              ← Navigation logo
├── logo-large.png        ← Login logo (larger version)
└── favicon.ico           ← Browser tab icon
```

**For Company B (WorkForce):**
```
HRMS-Frontend/public/logos/company-b/
├── logo.png
├── logo-large.png
└── favicon.ico
```

**For Company C (PeopleSync):**
```
HRMS-Frontend/public/logos/company-c/
├── logo.png
├── logo-large.png
└── favicon.ico
```

#### **Step 3: No Code Changes Needed!**

The `LogoManager` component automatically:
1. Tries to load logo from `/public/logos/company-x/logo.png`
2. If logo exists → Shows the logo
3. If logo missing → Shows initials (TH/WP/PS) as fallback

#### **Step 4: Test**
```bash
npm run dev:company-a
```

Open browser → You should see your logo instead of "TH" initials!

---

## 🎯 **WHERE LOGO APPEARS**

### **Login Screen:**
- Logo: `logo-large.png` (120x120px)
- Location: Above login form
- Fallback: Shows "TH" initials if logo missing

### **Navigation Bar:**
- Logo: `logo.png` (48x48px)
- Location: Top-left corner of navbar
- Fallback: Shows "TH" initials if logo missing

### **Browser Tab:**
- Icon: `favicon.ico`
- Location: Browser tab next to page title
- Fallback: Default browser icon

---

## 🚀 **HOW TO ADD NEW COMPANIES (Company D, E, F)**

### **Step 1: Create Theme JSON File**

```bash
Copy: HRMS-Frontend/src/config/themes/company-a.json
To: HRMS-Frontend/src/config/themes/company-d.json
```

**Edit `company-d.json`:**
```json
{
  "companyId": "company-d",                    ← Change this
  "companyName": "New Company Name",           ← Change this
  "initials": "NC",                            ← Change this
  "colors": {
    "primary": "#F59E0B",                      ← Choose new color
    "secondary": "#FFA500",
    "accent": "#FEF3C7",
    "text": "#1F2937",
    "background": "#FFFFFF",
    "border": "#E5E7EB",
    "hover": "#D97706",
    "active": "#B45309",
    "disabled": "#9CA3AF"
  },
  "logos": {
    "navigationLogo": "/logos/company-d/logo.png",      ← Update path
    "loginLogo": "/logos/company-d/logo-large.png",     ← Update path
    "faviconPath": "/logos/company-d/favicon.ico"       ← Update path
  }
}
```

### **Step 2: Update Theme Loader**

**Open:** `HRMS-Frontend/src/utils/themeLoader.js`

**Find this section:**
```javascript
import companyATheme from '../config/themes/company-a.json';
import companyBTheme from '../config/themes/company-b.json';
import companyCTheme from '../config/themes/company-c.json';
```

**Add your new company:**
```javascript
import companyATheme from '../config/themes/company-a.json';
import companyBTheme from '../config/themes/company-b.json';
import companyCTheme from '../config/themes/company-c.json';
import companyDTheme from '../config/themes/company-d.json';  // ✅ ADD THIS
```

**Find the theme mapping:**
```javascript
const themeMap = {
  'company-a': companyATheme,
  'company-b': companyBTheme,
  'company-c': companyCTheme
};
```

**Add your new company:**
```javascript
const themeMap = {
  'company-a': companyATheme,
  'company-b': companyBTheme,
  'company-c': companyCTheme,
  'company-d': companyDTheme  // ✅ ADD THIS
};
```

### **Step 3: Create Environment File**

**Copy:**
```bash
cp HRMS-Frontend/.env.company-a HRMS-Frontend/.env.company-d
```

**Edit `.env.company-d`:**
```
# Company D Configuration
VITE_TENANT_ID=company-d

VITE_API_BASE_URL=http://localhost:8082
VITE_API_URL=http://localhost:8082/api
VITE_WS_URL=http://localhost:8082/ws

VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

### **Step 4: Add npm Script**

**Open:** `HRMS-Frontend/package.json`

**Find scripts section:**
```json
"scripts": {
  "dev": "vite",
  "dev:company-a": "vite --mode company-a",
  "dev:company-b": "vite --mode company-b",
  "dev:company-c": "vite --mode company-c",
```

**Add new company:**
```json
"scripts": {
  "dev": "vite",
  "dev:company-a": "vite --mode company-a",
  "dev:company-b": "vite --mode company-b",
  "dev:company-c": "vite --mode company-c",
  "dev:company-d": "vite --mode company-d",        // ✅ ADD THIS
  "build:company-a": "vite build --mode company-a",
  "build:company-b": "vite build --mode company-b",
  "build:company-c": "vite build --mode company-c",
  "build:company-d": "vite build --mode company-d"  // ✅ ADD THIS
},
```

### **Step 5: Create Logo Directory**

```bash
mkdir HRMS-Frontend/public/logos/company-d
```

**Add README:**
```bash
cp HRMS-Frontend/public/logos/company-a/README.md HRMS-Frontend/public/logos/company-d/README.md
```

**Edit the README to reflect Company D details**

### **Step 6: Test New Company**

```bash
npm run dev:company-d
```

Open: http://localhost:5173

---

## 📝 **SUMMARY: Files to Edit for New Company**

| File | Action | Purpose |
|------|--------|---------|
| `src/config/themes/company-d.json` | Create | Company configuration |
| `src/utils/themeLoader.js` | Edit | Add import & mapping |
| `.env.company-d` | Create | Environment config |
| `package.json` | Edit | Add npm scripts |
| `public/logos/company-d/` | Create | Logo directory |

---

## 🎨 **CHANGING COLORS (Without Logo)**

Even without a logo, you can customize colors:

**Edit:** `HRMS-Frontend/src/config/themes/company-a.json`

```json
{
  "colors": {
    "primary": "#FF5733",      ← Main buttons, links
    "secondary": "#FFC300",    ← Secondary buttons
    "accent": "#FFE5CC",       ← Backgrounds, cards
    "text": "#1F2937",         ← Text color (keep dark)
    "background": "#FFFFFF",   ← Page background (keep light)
    "border": "#E5E7EB",       ← Borders
    "hover": "#CC4629",        ← Hover state (auto-calculated if omitted)
    "active": "#993018",       ← Active/pressed state
    "disabled": "#9CA3AF"      ← Disabled elements
  }
}
```

**Save and test:**
```bash
npm run dev:company-a
```

All colors update instantly!

---

## 🔍 **WHERE CHANGES ARE APPLIED**

### **Login Page:**
- ✅ Logo (or initials)
- ✅ Company name
- ✅ Button colors

### **After Login - Navbar:**
- ✅ Logo (or initials)
- ✅ Company name
- ✅ Background color

### **Throughout App:**
- ✅ All buttons (primary color)
- ✅ All links (primary color)
- ✅ Headers (themed colors)
- ✅ Hover effects (darker shade)

---

## 🚨 **IMPORTANT NOTES**

### **Logo Fallback System:**
1. **First**: Tries to load actual logo file
2. **Fallback**: Shows initials (TH/WP/PS) if logo missing
3. **No Error**: System handles missing logos gracefully

### **No Code Changes for Logos:**
- Just drop logo files in `/public/logos/company-x/`
- System automatically detects and loads them
- No need to edit React components

### **Business Logic Unchanged:**
- All features work identically
- Same database, same APIs
- Only visual branding changes

---

## 📂 **COMPLETE FILE STRUCTURE**

```
HRMS-Frontend/
├── src/
│   ├── config/
│   │   └── themes/
│   │       ├── company-a.json  ← TalentHub config
│   │       ├── company-b.json  ← WorkForce config
│   │       └── company-c.json  ← PeopleSync config
│   ├── utils/
│   │   └── themeLoader.js      ← Loads theme based on VITE_TENANT_ID
│   ├── components/
│   │   ├── InitialLogo.jsx     ← Displays "TH/WP/PS" initials
│   │   └── LogoManager.jsx     ← Manages logo loading with fallback
│   └── context/
│       └── ThemeContext.jsx    ← Provides theme to entire app
├── public/
│   └── logos/
│       ├── company-a/
│       │   ├── logo.png        ← TalentHub logo files (add yours here)
│       │   ├── logo-large.png
│       │   └── favicon.ico
│       ├── company-b/
│       │   ├── logo.png        ← WorkForce logo files (add yours here)
│       │   ├── logo-large.png
│       │   └── favicon.ico
│       └── company-c/
│           ├── logo.png        ← PeopleSync logo files (add yours here)
│           ├── logo-large.png
│           └── favicon.ico
├── .env.company-a              ← Company A environment
├── .env.company-b              ← Company B environment
└── .env.company-c              ← Company C environment
```

---

## ✅ **QUICK CHECKLIST**

### **To Change Company Name:**
- [ ] Edit `src/config/themes/company-x.json`
- [ ] Update `companyName` and `initials` fields
- [ ] Test with `npm run dev:company-x`

### **To Add Company Logo:**
- [ ] Prepare logo files (PNG/SVG, transparent background)
- [ ] Create 3 files: `logo.png`, `logo-large.png`, `favicon.ico`
- [ ] Place in `public/logos/company-x/` directory
- [ ] Test - logo should appear automatically!

### **To Change Colors:**
- [ ] Edit `src/config/themes/company-x.json`
- [ ] Update `colors` object with new hex codes
- [ ] Test with `npm run dev:company-x`

### **To Add New Company:**
- [ ] Create new theme JSON file
- [ ] Update `themeLoader.js` (import + mapping)
- [ ] Create environment file
- [ ] Add npm scripts to `package.json`
- [ ] Create logo directory
- [ ] Test with `npm run dev:company-x`

---

## 🎉 **YOU'RE DONE!**

Now you know:
- ✅ Where to change company names
- ✅ How to add/replace logos
- ✅ How to change colors
- ✅ How to add new companies
- ✅ Where everything is located

**Test it now:**
```bash
npm run dev:company-a
```

Your TalentHub Solutions (blue theme with "TH" logo) should load!
