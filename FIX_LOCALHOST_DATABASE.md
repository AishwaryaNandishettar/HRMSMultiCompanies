# 🔧 Fix Localhost Database - Quick Solution

## 🔍 Problem Identified

- **Vercel (Production)**: Shows correct names ✅ (Pradyumna Mishra, Aishushettar95, etc.)
- **Localhost**: Shows test names ❌ (Rahul Sharma, Silk Smitha, ABCD)

## 🎯 Root Cause

Your localhost backend is connected to a **local MongoDB** with test data:
```
mongodb://localhost:27017/Data_base_hrms
```

Your production backend is connected to a **production MongoDB** (likely MongoDB Atlas) with correct data.

## ✅ Solution (Choose One)

### **Option 1: Use Production Database for Localhost (Recommended)**

This connects your localhost to the same database as production.

**Step 1: Get Production MongoDB URI**

Check your Render/Railway backend environment variables for `MONGODB_URI`. It should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

**Step 2: Create .env File in Backend Root**

Create file: `d:\New folder\HRMSProject (2)\HRMSProject\.env`

```properties
# Production MongoDB Connection
MONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/your-database

# Example (replace with your actual connection string):
# MONGODB_URI=mongodb+srv://admin:secretPass123@cluster0.mongodb.net/hrms_production
```

**Step 3: Restart Backend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

Now localhost will use the production database!

---

### **Option 2: Import Production Data to Local MongoDB**

This copies production data to your local MongoDB.

**Step 1: Export from Production**

```bash
# Get the production MongoDB URI from Render/Railway
# Format: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Export production data
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname" --out=./production_backup

# This creates a folder called 'production_backup'
```

**Step 2: Import to Local MongoDB**

```bash
# Import to local MongoDB
mongorestore --uri="mongodb://localhost:27017/Data_base_hrms" --drop ./production_backup/dbname

# The --drop flag removes existing test data
```

**Step 3: Restart Backend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

---

### **Option 3: Manually Update Local MongoDB (Quick Test)**

If you just want to test quickly without connecting to production:

**Step 1: Open MongoDB Compass**

Connect to: `mongodb://localhost:27017`

**Step 2: Navigate to Database**

- Database: `Data_base_hrms`
- Collection: `employees`

**Step 3: Update Each Employee**

Find and update each record:

| Current (Test) | Correct Name |
|----------------|--------------|
| Rahul Sharma (EMP101) | Your real employee name |
| Rahul Mandre (EMP102) | Your real employee name |
| Silk Smitha (EMP103) | Your real employee name |
| ABCD (EMP105) | Your real employee name |

**Step 4: Refresh Frontend**

Just refresh the page at http://localhost:5173/employee-card

---

## 🚀 Recommended Approach

**For Development: Option 1** (Use production database)

This ensures you're always working with the same data as production.

**Create `.env` file:**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
notepad .env
```

Add this content (replace with your actual production MongoDB URI):

```properties
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database-name
```

Save and restart backend:

```bash
mvnw spring-boot:run
```

---

## ✅ Verification

After applying the fix:

1. **Backend Console** should show:
```
MongoDB connected to: mongodb+srv://...
```

2. **Open localhost**:
```
http://localhost:5173/employee-card
```

3. **Check names** - should now match Vercel:
- ✅ Pradyumna Mishra
- ✅ Badgjerrekha063
- ✅ Aishushettar95
- ✅ Aishwarya

---

## 📋 Quick Commands

### **Get Production MongoDB URI:**

1. Login to Render/Railway dashboard
2. Go to your backend service
3. Click "Environment" or "Variables"
4. Copy the `MONGODB_URI` value

### **Create .env file:**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
echo MONGODB_URI=your-connection-string > .env
```

### **Restart Backend:**

```bash
mvnw spring-boot:run
```

---

## 🎯 Why This Happened

You have two separate MongoDB databases:

1. **Local MongoDB** (localhost:27017)
   - Contains test data
   - Used by localhost backend

2. **Production MongoDB** (MongoDB Atlas/Cloud)
   - Contains real data
   - Used by Vercel/Render backend

The frontend code is 100% correct - it just displays whatever data the backend returns!

---

## 💡 Best Practice

**For development, always use production database** (with a separate dev database if needed):

```
Production:  mongodb+srv://.../hrms_production
Development: mongodb+srv://.../hrms_development
Testing:     mongodb://localhost:27017/hrms_test
```

This prevents data inconsistency between environments.

