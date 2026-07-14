# Multi-Tenant HRMS Customization Guide

## Overview

This guide shows you how to customize branding (company names, colors, logos) for each tenant **without changing any code**. All customization is done through configuration files and asset replacement.

---

## Table of Contents

1. [Changing Company Names](#changing-company-names)
2. [Changing Color Schemes](#changing-color-schemes)
3. [Replacing Logo Files](#replacing-logo-files)
4. [Testing Changes Locally](#testing-changes-locally)
5. [Deploying Changes](#deploying-changes)
6. [Troubleshooting](#troubleshooting)

---

## Changing Company Names

### Location
Theme configuration files are located at:
- Company A: `HRMS-Frontend/src/config/themes/company-a.json`
- Company B: `HRMS-Frontend/src/config/themes/company-b.json`
- Company C: `HRMS-Frontend/src/config/themes/company-c.json`

### Steps

1. **Open the theme configuration file** for the company you want to modify

2. **Find the `companyName` property**:
   ```json
   {
     "companyId": "company-a",
     "companyName": "TalentHub Solutions",
     ...
   }
   ```

3. **Change the name** to your desired company name:
   ```json
   {
     "companyId": "company-a",
     "companyName": "Your Company Name Here",
     ...
   }
   ```

4. **Update the initials** (used for placeholder logo):
   ```json
   {
     "companyId": "company-a",
     "companyName": "Your Company Name",
     "initials": "YCN",
     ...
   }
   ```

5. **Save the file**

### Example

**Before:**
```json
{
  "companyId": "company-a",
  "companyName": "TalentHub Solutions",
  "initials": "TH",
  ...
}
```

**After:**
```json
{
  "companyId": "company-a",
  "companyName": "Acme Corporation",
  "initials": "AC",
  ...
}
```

---

## Changing Color Schemes

### Understanding Colors

Each theme has 9 color properties:
- **primary**: Main brand color (buttons, headers, links)
- **secondary**: Secondary actions and accents
- **accent**: Light backgrounds and subtle highlights
- **text**: Main text color
- **background**: Page background color
- **border**: Border color for inputs, cards, etc.
- **hover**: Color when hovering over interactive elements
- **active**: Color when clicking interactive elements
- **disabled**: Color for disabled elements

### Color Format

Use **hexadecimal color codes** (e.g., `#1E40AF`)

### Steps

1. **Open the theme configuration file**

2. **Find the `colors` section**:
   ```json
   "colors": {
     "primary": "#1E40AF",
     "secondary": "#3B82F6",
     "accent": "#DBEAFE",
     ...
   }
   ```

3. **Update colors** with your brand colors:
   ```json
   "colors": {
     "primary": "#FF5733",
     "secondary": "#FFC300",
     "accent": "#FFE5CC",
     ...
   }
   ```

4. **Save the file**

### Professional Color Schemes (Suggestions)

#### Tech/Corporate (Blue)
```json
"colors": {
  "primary": "#2563EB",
  "secondary": "#60A5FA",
  "accent": "#DBEAFE",
  "text": "#1F2937",
  "background": "#FFFFFF",
  "border": "#E5E7EB",
  "hover": "#1D4ED8",
  "active": "#1E3A8A",
  "disabled": "#9CA3AF"
}
```

#### Growth/Nature (Green)
```json
"colors": {
  "primary": "#10B981",
  "secondary": "#34D399",
  "accent": "#D1FAE5",
  "text": "#1F2937",
  "background": "#FFFFFF",
  "border": "#E5E7EB",
  "hover": "#059669",
  "active": "#047857",
  "disabled": "#9CA3AF"
}
```

#### Creative/Premium (Purple)
```json
"colors": {
  "primary": "#8B5CF6",
  "secondary": "#A78BFA",
  "accent": "#EDE9FE",
  "text": "#1F2937",
  "background": "#FFFFFF",
  "border": "#E5E7EB",
  "hover": "#7C3AED",
  "active": "#6D28D9",
  "disabled": "#9CA3AF"
}
```

#### Energy/Bold (Orange)
```json
"colors": {
  "primary": "#F59E0B",
  "secondary": "#FFA500",
  "accent": "#FEF3C7",
  "text": "#1F2937",
  "background": "#FFFFFF",
  "border": "#E5E7EB",
  "hover": "#D97706",
  "active": "#B45309",
  "disabled": "#9CA3AF"
}
```

### Accessibility Guidelines (WCAG 2.1)

**Ensure good contrast for readability:**
- Text on background: Minimum 4.5:1 contrast ratio
- Large text on background: Minimum 3:1 contrast ratio
- Use tools like: https://webaim.org/resources/contrastchecker/

**Tips:**
- Darker primary colors (e.g., #1E40AF) work better than light colors
- Keep text color dark (#1F2937) for readability
- Keep background color light (#FFFFFF) for clarity

---

## Replacing Logo Files

### Logo Requirements

**File Formats:**
- **Preferred**: SVG (scalable vector graphics)
- **Alternative**: PNG with transparent background

**Dimensions:**
- Navigation logo: 48x48 pixels minimum
- Login logo: 120x120 pixels minimum
- Favicon: 16x16, 32x32, 48x48 pixels (ICO file with multiple sizes)

**File Size:**
- Navigation/Login logos: Maximum 500 KB
- Favicon: Maximum 100 KB

### Steps

1. **Prepare your logo files:**
   - `logo.png` or `logo.svg` - Navigation logo
   - `logo-large.png` or `logo-large.svg` - Login screen logo
   - `favicon.ico` - Browser favicon

2. **Place files in the correct directory:**
   - Company A: `HRMS-Frontend/public/logos/company-a/`
   - Company B: `HRMS-Frontend/public/logos/company-b/`
   - Company C: `HRMS-Frontend/public/logos/company-c/`

3. **File names must match exactly:**
   ```
   /public/logos/company-a/
     ├── logo.png (or logo.svg)
     ├── logo-large.png (or logo-large.svg)
     └── favicon.ico
   ```

4. **No code changes needed!** The LogoManager component automatically detects and loads the files.

### Example Directory Structure

```
HRMS-Frontend/
  └── public/
      └── logos/
          ├── company-a/
          │   ├── logo.png
          │   ├── logo-large.png
          │   ├── favicon.ico
          │   └── README.md
          ├── company-b/
          │   ├── logo.svg
          │   ├── logo-large.svg
          │   ├── favicon.ico
          │   └── README.md
          └── company-c/
              ├── logo.png
              ├── logo-large.png
              ├── favicon.ico
              └── README.md
```

### Logo Design Tips

- Use company brand colors
- Keep design simple and recognizable
- Ensure logo works on both light and dark backgrounds
- Add padding/whitespace around the logo design
- Test visibility at different sizes

---

## Testing Changes Locally

### Before Deployment - Test Locally

1. **Start the dev server for the company you modified:**

   **Company A:**
   ```bash
   cd HRMS-Frontend
   npm run dev:company-a
   ```

   **Company B:**
   ```bash
   cd HRMS-Frontend
   npm run dev:company-b
   ```

   **Company C:**
   ```bash
   cd HRMS-Frontend
   npm run dev:company-c
   ```

2. **Open browser**: http://localhost:5173

3. **Verify changes:**
   - ✅ Company name appears correctly in header, login, footer
   - ✅ Colors are applied throughout the app
   - ✅ Logo displays correctly (or initials if logo not yet added)
   - ✅ Browser tab title shows company name
   - ✅ Favicon displays in browser tab

4. **Test on different screen sizes:**
   - Open browser DevTools (F12)
   - Click device toolbar icon (toggle device toolbar)
   - Test on: Mobile (375px), Tablet (768px), Desktop (1920px)

5. **Test business logic (ensure unchanged):**
   - ✅ Login works
   - ✅ Navigation works
   - ✅ Data loads correctly
   - ✅ Forms submit properly
   - ✅ All features function as expected

---

## Deploying Changes

### Step 1: Commit and Push to GitHub

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Update Company A branding: Change name to Acme Corp and update colors"

# Push to GitHub
git push origin main
```

### Step 2: Deploy to Vercel (Frontend)

**Automatic Deployment:**
- Vercel automatically detects the push and redeploys
- Wait 2-5 minutes
- Check deployment status on Vercel dashboard

**Manual Deployment:**
1. Go to Vercel dashboard
2. Select the project (e.g., `hrms-frontend-company-a`)
3. Go to "Deployments" tab
4. Click "..." menu → "Redeploy"

### Step 3: Verify Production Deployment

1. **Open production URL**
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Verify all changes applied:**
   - Company name
   - Colors
   - Logo (if replaced)

---

## Deployment Without Code Changes

### Updating Just Logo Files

If you only need to update logo files (no JSON changes):

1. **Replace logo files** in `public/logos/company-x/` directory
2. **Commit and push** to GitHub
3. **Vercel will redeploy** automatically
4. **Clear browser cache** to see new logos

### Updating Environment Variables (Vercel)

If you need to change API URLs or tenant IDs:

1. Go to **Vercel dashboard**
2. Select project
3. Go to **Settings** → **Environment Variables**
4. Update variables
5. Click **Save**
6. Go to **Deployments** tab
7. Click **"Redeploy"** (required for env var changes)

---

## Troubleshooting

### Changes Not Showing After Deployment

**Solution:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Open in incognito/private window
3. Wait 5-10 minutes for CDN propagation
4. Check Vercel deployment logs for errors

### Colors Not Applying

**Solution:**
1. Verify hex color codes are valid (e.g., `#1E40AF`, not `1E40AF`)
2. Check console for theme loader errors (F12 → Console)
3. Ensure JSON file is valid (use online JSON validator)
4. Redeploy after fixing

### Logo Not Displaying

**Solution:**
1. Check file names match exactly: `logo.png`, `logo-large.png`, `favicon.ico`
2. Verify file paths in theme JSON: `"/logos/company-a/logo.png"`
3. Check file sizes (max 500 KB for logos)
4. Check browser console for 404 errors
5. Clear browser cache

### Company Name Too Long

**Solution:**
1. The system truncates names over 30 characters with ellipsis
2. Consider shorter name or abbreviation
3. Full name shown on hover

### Theme Validation Errors

**Solution:**
1. Open browser console (F12)
2. Look for `[ThemeLoader]` error messages
3. Common issues:
   - Missing required property (companyName, colors, logos)
   - Invalid hex color code
   - Malformed JSON syntax
4. Fix errors in theme JSON file
5. Redeploy

---

## Quick Reference

### File Locations

| Item | Location |
|------|----------|
| Company A theme | `HRMS-Frontend/src/config/themes/company-a.json` |
| Company B theme | `HRMS-Frontend/src/config/themes/company-b.json` |
| Company C theme | `HRMS-Frontend/src/config/themes/company-c.json` |
| Company A logos | `HRMS-Frontend/public/logos/company-a/` |
| Company B logos | `HRMS-Frontend/public/logos/company-b/` |
| Company C logos | `HRMS-Frontend/public/logos/company-c/` |

### npm Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev:company-a` | Run Company A locally |
| `npm run dev:company-b` | Run Company B locally |
| `npm run dev:company-c` | Run Company C locally |
| `npm run build:company-a` | Build Company A for production |
| `npm run build:company-b` | Build Company B for production |
| `npm run build:company-c` | Build Company C for production |

### Common Hex Colors

| Color | Hex Code | Use Case |
|-------|----------|----------|
| Blue (Professional) | `#2563EB` | Corporate, Tech |
| Green (Growth) | `#10B981` | Finance, Health |
| Purple (Premium) | `#8B5CF6` | Creative, Luxury |
| Orange (Energy) | `#F59E0B` | Retail, Food |
| Red (Bold) | `#EF4444` | Entertainment, Media |
| Teal (Modern) | `#14B8A6` | Startups, Innovation |

---

## Need Help?

1. Check browser console for errors (F12 → Console)
2. Review deployment logs on Vercel/Render
3. Verify environment variables are set correctly
4. Test changes locally before deploying
5. Ensure JSON files are valid (no syntax errors)

---

**Remember**: All customizations are configuration-only. No code changes needed!
