// MongoDB Script to Fix Aishwarya User
// Run this in MongoDB Compass or mongosh

// Connect to your database
use hrms

// 1. Check current state
print("=== BEFORE FIX ===");
db.users.find({ email: "Aishwarya@company.com" }).forEach(function(user) {
    print("Email: " + user.email);
    print("CompanyId: " + user.companyId);
    print("Name: " + user.name);
    print("Role: " + user.role);
});

// 2. Fix the user - Set companyId to NULL for Omoi employees
db.users.updateOne(
    { email: "Aishwarya@company.com" },
    { $set: { companyId: null } }
);

print("\n=== AFTER FIX ===");
db.users.find({ email: "Aishwarya@company.com" }).forEach(function(user) {
    print("Email: " + user.email);
    print("CompanyId: " + user.companyId);
    print("Name: " + user.name);
    print("Role: " + user.role);
});

print("\n✅ Aishwarya@company.com is now an Omoi employee (companyId = null)");
print("✅ They can ONLY login to http://localhost:5173");
print("❌ They will be BLOCKED from ports 5176, 5177, 5178");

// 3. Also check Employee collection
print("\n=== CHECKING EMPLOYEE COLLECTION ===");
db.employees.find({ email: "Aishwarya@company.com" }).forEach(function(emp) {
    print("Email: " + emp.email);
    print("CompanyId: " + emp.companyId);
});

// 4. Fix Employee collection too
db.employees.updateOne(
    { email: "Aishwarya@company.com" },
    { $set: { companyId: null } }
);

print("\n✅ COMPLETE! Now restart backend and test again.");
