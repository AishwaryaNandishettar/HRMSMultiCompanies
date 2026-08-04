# Push Multi-Tenant HRMS to GitHub

## Your GitHub Repository
**URL**: https://github.com/AishwaryaNandishettar/HRMSMultiCompanies

## Step 1: Initialize Git (if not already done)

```bash
cd E:/HRMSProject
git init
```

## Step 2: Add Remote Repository

```bash
git remote add origin https://github.com/AishwaryaNandishettar/HRMSMultiCompanies.git
```

If remote already exists, update it:
```bash
git remote set-url origin https://github.com/AishwaryaNandishettar/HRMSMultiCompanies.git
```

## Step 3: Create .gitignore

Create a `.gitignore` file in the root directory:

```gitignore
# Node modules
node_modules/
HRMS-Frontend/node_modules/

# Build outputs
HRMS-Backend/target/
HRMS-Frontend/dist/
HRMS-Frontend/build/

# IDE files
.vscode/
.idea/
*.iml

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Environment files (IMPORTANT!)
.env
.env.local
.env.production
HRMS-Frontend/.env
HRMS-Frontend/.env.local
HRMS-Frontend/.env.production

# Logs
*.log
npm-debug.log*

# Temporary files
*.tmp
*.temp

# Maven
.mvn/wrapper/maven-wrapper.jar
```

## Step 4: Stage All Files

```bash
git add .
```

## Step 5: Commit Changes

```bash
git commit -m "Initial commit: Multi-tenant HRMS with 4 portals (Omoi, TalentHub, Workforce Pro, PeopleSync)"
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If you get authentication error, you'll need to use a Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when prompted

## Step 7: Verify on GitHub

Go to: https://github.com/AishwaryaNandishettar/HRMSMultiCompanies

You should see all your files uploaded!

## Project Structure That Will Be Pushed

```
HRMSMultiCompanies/
├── HRMS-Backend/           # Spring Boot backend
├── HRMS-Frontend/          # React frontend (multi-tenant)
│   ├── .env               # Omoi portal config (localhost:5173)
│   ├── .env.talenthub     # TalentHub config (localhost:5176)
│   ├── .env.workforce     # Workforce Pro config (localhost:5177)
│   └── .env.peoplesync    # PeopleSync config (localhost:5178)
├── .gitignore
├── README.md
└── ... (all your markdown docs)
```

## Important Notes

1. **Don't commit .env files** - They contain API URLs and may have sensitive data
2. **Backend already on Render** - No need to redeploy
3. **Frontend will go to Vercel** - We'll deploy 4 separate instances

## Next Steps

After pushing to GitHub:
1. Create 4 Vercel deployments (one per tenant)
2. Configure environment variables in Vercel
3. Link each deployment to your Render backend
