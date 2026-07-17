// ========================================
// Multi-Tenant Company Assignment Script
// ========================================
// This script assigns companyId to users in the MongoDB database
// Run this in MongoDB shell: mongosh < SETUP_COMPANY_ASSIGNMENTS.js

// Switch to your HRMS database
use hrms_db;

print("\n========================================");
print("Multi-Tenant Company Assignment");
print("========================================\n");

// ========================================
// 1. TalentHub Solutions (company-a)
// ========================================
print("1. Assigning TalentHub Solutions employees...");

const talentHubEmails = [
  // Add your TalentHub Solutions employee emails here
  "talentemployee1@talenthub.com",
  "talentmanager@talenthub.com",
  "talentadmin@talenthub.com"
];

const talentResult = db.users.updateMany(
  { email: { $in: talentHubEmails }},
  { $set: { companyId: "company-a" }}
);

print(`  ✅ Updated ${talentResult.modifiedCount} TalentHub Solutions users`);

// ========================================
// 2. WorkForce Pro (company-b)
// ========================================
print("\n2. Assigning WorkForce Pro employees...");

const workforceEmails = [
  // Add your WorkForce Pro employee emails here
  "workforceemployee@workforcepro.com",
  "workforcemanager@workforcepro.com",
  "workforceadmin@workforcepro.com"
];

const workforceResult = db.users.updateMany(
  { email: { $in: workforceEmails }},
  { $set: { companyId: "company-b" }}
);

print(`  ✅ Updated ${workforceResult.modifiedCount} WorkForce Pro users`);

// ========================================
// 3. PeopleSync Enterprise (company-c)
// ========================================
print("\n3. Assigning PeopleSync Enterprise employees...");

const peoplesyncEmails = [
  // Add your PeopleSync Enterprise employee emails here
  "peoplesyncemployee@peoplesync.com",
  "peoplesyncmanager@peoplesync.com",
  "peoplesyncadmin@peoplesync.com"
];

const peoplesyncResult = db.users.updateMany(
  { email: { $in: peoplesyncEmails }},
  { $set: { companyId: "company-c" }}
);

print(`  ✅ Updated ${peoplesyncResult.modifiedCount} PeopleSync Enterprise users`);

// ========================================
// 4. Omoikaneinnovations (Internal)
// ========================================
print("\n4. Assigning Omoikaneinnovations employees...");

const omoiEmails = [
  // Omoikaneinnovations employees (these should NOT access other company portals)
  "Aishwarya@company.com",
  "aishwarya@omoi.com",
  "nikita@omoi.com",
  "mahesh@omoi.com",
  "nikitaadigennavar@gmail.com"
];

const omoiResult = db.users.updateMany(
  { email: { $in: omoiEmails }},
  { $set: { companyId: "omoikaneinnovations" }}
);

print(`  ✅ Updated ${omoiResult.modifiedCount} Omoikaneinnovations users`);

// ========================================
// Alternative: Assign by Email Domain
// ========================================
print("\n5. Assigning by email domain (optional)...");

// Assign all @talenthub.com emails to company-a
const domainTalentResult = db.users.updateMany(
  { email: { $regex: "@talenthub\\.com$", $options: "i" }},
  { $set: { companyId: "company-a" }}
);
print(`  ✅ Updated ${domainTalentResult.modifiedCount} users with @talenthub.com domain`);

// Assign all @workforcepro.com emails to company-b
const domainWorkforceResult = db.users.updateMany(
  { email: { $regex: "@workforcepro\\.com$", $options: "i" }},
  { $set: { companyId: "company-b" }}
);
print(`  ✅ Updated ${domainWorkforceResult.modifiedCount} users with @workforcepro.com domain`);

// Assign all @peoplesync.com emails to company-c
const domainPeoplesyncResult = db.users.updateMany(
  { email: { $regex: "@peoplesync\\.com$", $options: "i" }},
  { $set: { companyId: "company-c" }}
);
print(`  ✅ Updated ${domainPeoplesyncResult.modifiedCount} users with @peoplesync.com domain`);

// Assign all @omoi.com and remaining @company.com to omoikaneinnovations
const domainOmoiResult = db.users.updateMany(
  { 
    $or: [
      { email: { $regex: "@omoi\\.com$", $options: "i" }},
      { email: { $regex: "@company\\.com$", $options: "i" }}
    ]
  },
  { $set: { companyId: "omoikaneinnovations" }}
);
print(`  ✅ Updated ${domainOmoiResult.modifiedCount} users with @omoi.com or @company.com domain`);

// ========================================
// Verification
// ========================================
print("\n========================================");
print("Verification Report");
print("========================================\n");

// Count users by company
print("Users by Company:");
db.users.aggregate([
  {
    $group: {
      _id: "$companyId",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]).forEach(doc => {
  const companyName = doc._id || "(No Company Assigned)";
  print(`  ${companyName}: ${doc.count} users`);
});

// List users without companyId
print("\n⚠️  Users without companyId:");
const usersWithoutCompany = db.users.find(
  { companyId: { $exists: false } },
  { email: 1, name: 1, role: 1, _id: 0 }
).toArray();

if (usersWithoutCompany.length === 0) {
  print("  ✅ All users have companyId assigned");
} else {
  usersWithoutCompany.forEach(user => {
    print(`  - ${user.email} (${user.name || "N/A"}) [${user.role || "N/A"}]`);
  });
}

// List users with null or empty companyId
print("\n⚠️  Users with null/empty companyId:");
const usersWithEmptyCompany = db.users.find(
  { 
    $or: [
      { companyId: null },
      { companyId: "" }
    ]
  },
  { email: 1, name: 1, role: 1, _id: 0 }
).toArray();

if (usersWithEmptyCompany.length === 0) {
  print("  ✅ No users with null/empty companyId");
} else {
  usersWithEmptyCompany.forEach(user => {
    print(`  - ${user.email} (${user.name || "N/A"}) [${user.role || "N/A"}]`);
  });
}

// Sample users from each company
print("\n========================================");
print("Sample Users by Company");
print("========================================\n");

["company-a", "company-b", "company-c", "omoikaneinnovations"].forEach(companyId => {
  print(`\n${companyId}:`);
  db.users.find(
    { companyId: companyId },
    { email: 1, name: 1, role: 1, _id: 0 }
  ).limit(5).forEach(user => {
    print(`  - ${user.email} (${user.name || "N/A"}) [${user.role || "N/A"}]`);
  });
});

print("\n========================================");
print("✅ Company Assignment Complete!");
print("========================================\n");

print("Next Steps:");
print("1. Review the verification report above");
print("2. Assign companyId to any users without one");
print("3. Test login on each company portal");
print("4. Verify users can only access their assigned company\n");
