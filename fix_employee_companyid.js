// ========================================================
// FIX EMPLOYEE DIRECTORY - Sync CompanyId
// ========================================================
// This script checks and fixes companyId mismatch between
// users and employees collections
// ========================================================

print("\n╔═══════════════════════════════════════════════════╗");
print("║   FIX EMPLOYEE DIRECTORY - CompanyId Sync        ║");
print("╚═══════════════════════════════════════════════════╝\n");

// Step 1: Check current user's companyId
print("📊 STEP 1: Checking logged-in user's companyId...");
print("─────────────────────────────────────────────────────");

const adminUsers = db.users.find(
  { role: { $in: ["ADMIN", "admin", "Admin"] }},
  { email: 1, companyId: 1, name: 1, role: 1, _id: 0 }
).toArray();

if (adminUsers.length === 0) {
  print("❌ No ADMIN users found!");
  print("\nCreating default admin user...");
  
  db.users.insertOne({
    email: "admin@omoikaneinnovations.com",
    name: "Admin User",
    role: "ADMIN",
    companyId: "omoikaneinnovations",
    password: "$2a$10$abcdefghijklmnopqrstuvwxyz12345678",
    active: true
  });
  
  print("✅ Created admin@omoikaneinnovations.com with companyId: 'omoikaneinnovations'");
} else {
  print("✅ Found " + adminUsers.length + " admin user(s):\n");
  
  adminUsers.forEach(user => {
    print("   👤 " + user.email);
    print("      Name: " + (user.name || "N/A"));
    print("      CompanyId: " + (user.companyId || "❌ NOT SET"));
    print("");
  });
}

// Step 2: Check employees' companyId
print("\n📊 STEP 2: Checking employees' companyId distribution...");
print("─────────────────────────────────────────────────────");

const employeeStats = db.employees.aggregate([
  {
    $group: {
      _id: "$companyId",
      count: { $sum: 1 },
      employees: { $push: "$fullName" }
    }
  },
  { $sort: { _id: 1 }}
]).toArray();

if (employeeStats.length === 0) {
  print("❌ No employees found in database!");
} else {
  employeeStats.forEach(stat => {
    const companyName = stat._id || "❌ NOT SET";
    print("\n   🏢 CompanyId: " + companyName);
    print("      Count: " + stat.count + " employees");
    print("      Employees:");
    stat.employees.slice(0, 5).forEach(name => {
      print("         - " + name);
    });
    if (stat.employees.length > 5) {
      print("         ... and " + (stat.employees.length - 5) + " more");
    }
  });
}

// Step 3: Fix - Set all employees to primary companyId
print("\n\n🔧 STEP 3: Fixing companyId mismatch...");
print("─────────────────────────────────────────────────────");

// Get the primary admin's companyId (or default to "omoikaneinnovations")
const primaryCompanyId = adminUsers.length > 0 && adminUsers[0].companyId 
  ? adminUsers[0].companyId 
  : "omoikaneinnovations";

print("   Setting all employees to companyId: '" + primaryCompanyId + "'");

const updateResult = db.employees.updateMany(
  {}, // Update ALL employees
  { $set: { companyId: primaryCompanyId }}
);

print("   ✅ Updated " + updateResult.modifiedCount + " employees");

// Also update users table for consistency
const userUpdateResult = db.users.updateMany(
  { role: { $ne: "ADMIN" }}, // All non-admin users
  { $set: { companyId: primaryCompanyId }}
);

print("   ✅ Updated " + userUpdateResult.modifiedCount + " users");

// Step 4: Verify fix
print("\n\n📊 STEP 4: Verifying fix...");
print("─────────────────────────────────────────────────────");

const verifyEmployees = db.employees.find(
  {},
  { fullName: 1, email: 1, companyId: 1, employeeId: 1, _id: 0 }
).limit(10).toArray();

if (verifyEmployees.length === 0) {
  print("❌ No employees found!");
} else {
  print("✅ First 10 employees:\n");
  verifyEmployees.forEach(emp => {
    const status = emp.companyId === primaryCompanyId ? "✅" : "❌";
    print("   " + status + " " + (emp.fullName || emp.email));
    print("      Email: " + emp.email);
    print("      EmployeeId: " + (emp.employeeId || "N/A"));
    print("      CompanyId: " + emp.companyId);
    print("");
  });
}

// Step 5: Summary
print("\n╔═══════════════════════════════════════════════════╗");
print("║                    SUMMARY                        ║");
print("╚═══════════════════════════════════════════════════╝");
print("");
print("✅ All employees now have companyId: '" + primaryCompanyId + "'");
print("✅ All users now have companyId: '" + primaryCompanyId + "'");
print("");
print("📝 Next Steps:");
print("   1. Restart your backend server");
print("   2. Clear browser cache and localStorage");
print("   3. Login again and check Employee Directory");
print("");
print("╚═══════════════════════════════════════════════════╝\n");
