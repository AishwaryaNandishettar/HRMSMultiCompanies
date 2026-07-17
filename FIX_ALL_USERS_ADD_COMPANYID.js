// ============================================
// FIX ALL USERS: Add companyId Field
// ============================================
// This script adds the companyId field to all existing users
// By default, sets all to null (Omoi HR Works employees)

// Connect to database
use hrms

print("===========================================");
print("  FIXING ALL USERS - ADDING companyId");
print("===========================================\n");

// Step 1: Check current state
print("📊 STEP 1: Current Users (BEFORE FIX)");
print("--------------------------------------");
var usersBefore = db.users.find({}, { email: 1, companyId: 1, _id: 0 }).toArray();
usersBefore.forEach(function(user) {
    print("Email: " + user.email + " | CompanyId: " + user.companyId);
});

// Step 2: Add companyId to ALL users (set to null for Omoi employees)
print("\n🔧 STEP 2: Adding companyId field to all users...");
print("--------------------------------------");

var result = db.users.updateMany(
    { companyId: { $exists: false } },  // Find users without companyId field
    { $set: { companyId: null } }        // Set it to null (Omoi employees)
);

print("✅ Updated " + result.modifiedCount + " users");

// Step 3: Verify changes
print("\n✅ STEP 3: Users After Fix");
print("--------------------------------------");
var usersAfter = db.users.find({}, { email: 1, companyId: 1, _id: 0 }).toArray();
usersAfter.forEach(function(user) {
    print("Email: " + user.email + " | CompanyId: " + user.companyId);
});

// Step 4: Also fix employees collection
print("\n🔧 STEP 4: Fixing Employees Collection...");
print("--------------------------------------");
var empResult = db.employees.updateMany(
    { companyId: { $exists: false } },
    { $set: { companyId: null } }
);
print("✅ Updated " + empResult.modifiedCount + " employees");

// Step 5: Summary
print("\n===========================================");
print("  ✅ FIX COMPLETE!");
print("===========================================");
print("");
print("📋 Summary:");
print("  - All existing users are now Omoi employees (companyId: null)");
print("  - They can ONLY login to http://localhost:5173");
print("  - They will be BLOCKED from ports 5176, 5177, 5178");
print("");
print("📝 Next Steps:");
print("  1. Restart your backend");
print("  2. Clear browser cache");
print("  3. Test login on all portals");
print("");
print("🎯 To Create Users for Other Companies:");
print("  - TalentHub user → set companyId: 'company-a'");
print("  - WorkforcePro user → set companyId: 'company-b'");
print("  - PeopleSync user → set companyId: 'company-c'");
print("");
print("===========================================\n");
