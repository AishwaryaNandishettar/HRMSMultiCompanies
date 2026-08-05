// MongoDB script to set up ALL company assignments
// This ensures tenant isolation for ALL portals:
// - TalentHub Solutions (company-a)
// - WorkForce Pro (company-b)
// - PeopleSync Enterprise (company-c)
// - Omoikaneinnovations (internal)

// Run this with: mongosh < fix-all-companies.js

// Switch to your database
use hrms_db;

print("\n========================================");
print("Multi-Company Tenant Isolation Setup");
print("========================================\n");

// ============================================
// STEP 1: Block Omoikaneinnovations employees from all client portals
// ============================================
print("STEP 1: Setting up Omoikaneinnovations employees");
print("─────────────────────────────────────────\n");

const omoiEmployees = [
  "Aishwarya@company.com",
  "aishwarya@omoi.com",
  "Aishmanager@omoi.com",
  "nikita@omoi.com",
  "nikitaadigennavar@gmail.com",
  "mahesh@omoi.com",
  "vishnu@omoi.com",
  "padmanabh@omoi.com",
  "shambuling@omoi.com",
  "lata@omoi.com"
];

print("Assigning companyId 'omoikaneinnovations' to:");
omoiEmployees.forEach(email => print("  - " + email));
print("");

const omoiResult = db.users.updateMany(
  { email: { $in: omoiEmployees }},
  { $set: { companyId: "omoikaneinnovations" }}
);

print("Results:");
print("  Matched: " + omoiResult.matchedCount);
print("  Modified: " + omoiResult.modifiedCount);
print("");

// Also update by domain
const omoiDomainResult = db.users.updateMany(
  { 
    email: { $regex: "@(omoi|company)\\.com$", $options: "i" },
    email: { $not: { $in: omoiEmployees }} // Don't double-count
  },
  { $set: { companyId: "omoikaneinnovations" }}
);

if (omoiDomainResult.modifiedCount > 0) {
  print("Also found " + omoiDomainResult.modifiedCount + " additional Omoi employees by domain");
  print("");
}

print("✅ Omoikaneinnovations employees configured");
print("   They will be BLOCKED from:");
print("   - TalentHub Solutions (company-a)");
print("   - WorkForce Pro (company-b)");
print("   - PeopleSync Enterprise (company-c)");
print("");

// ============================================
// STEP 2: Set up TalentHub Solutions employees
// ============================================
print("\nSTEP 2: Setting up TalentHub Solutions employees");
print("─────────────────────────────────────────\n");

// Option 1: If you have specific TalentHub employee emails, list them here
const talentHubEmployees = [
  // Add TalentHub employee emails here
  // Example: "employee@talenthub.com",
];

if (talentHubEmployees.length > 0) {
  const talentResult = db.users.updateMany(
    { email: { $in: talentHubEmployees }},
    { $set: { companyId: "company-a" }}
  );
  print("✅ Updated " + talentResult.modifiedCount + " TalentHub employees");
} else {
  print("ℹ️  No specific TalentHub employees listed");
}

// Option 2: Update by domain
const talentDomainResult = db.users.updateMany(
  { email: { $regex: "@talenthub\\.com$", $options: "i" }},
  { $set: { companyId: "company-a" }}
);

if (talentDomainResult.modifiedCount > 0) {
  print("✅ Updated " + talentDomainResult.modifiedCount + " users with @talenthub.com domain");
} else {
  print("ℹ️  No @talenthub.com users found");
}

print("");

// ============================================
// STEP 3: Set up WorkForce Pro employees
// ============================================
print("\nSTEP 3: Setting up WorkForce Pro employees");
print("─────────────────────────────────────────\n");

const workforceEmployees = [
  // Add WorkForce Pro employee emails here
  // Example: "employee@workforcepro.com",
];

if (workforceEmployees.length > 0) {
  const workforceResult = db.users.updateMany(
    { email: { $in: workforceEmployees }},
    { $set: { companyId: "company-b" }}
  );
  print("✅ Updated " + workforceResult.modifiedCount + " WorkForce Pro employees");
} else {
  print("ℹ️  No specific WorkForce Pro employees listed");
}

// Update by domain
const workforceDomainResult = db.users.updateMany(
  { email: { $regex: "@(workforce|workforcepro)\\.com$", $options: "i" }},
  { $set: { companyId: "company-b" }}
);

if (workforceDomainResult.modifiedCount > 0) {
  print("✅ Updated " + workforceDomainResult.modifiedCount + " users with @workforce domain");
} else {
  print("ℹ️  No @workforce users found");
}

print("");

// ============================================
// STEP 4: Set up PeopleSync Enterprise employees
// ============================================
print("\nSTEP 4: Setting up PeopleSync Enterprise employees");
print("─────────────────────────────────────────\n");

const peoplesyncEmployees = [
  // Add PeopleSync employee emails here
  // Example: "employee@peoplesync.com",
];

if (peoplesyncEmployees.length > 0) {
  const peoplesyncResult = db.users.updateMany(
    { email: { $in: peoplesyncEmployees }},
    { $set: { companyId: "company-c" }}
  );
  print("✅ Updated " + peoplesyncResult.modifiedCount + " PeopleSync employees");
} else {
  print("ℹ️  No specific PeopleSync employees listed");
}

// Update by domain
const peoplesyncDomainResult = db.users.updateMany(
  { email: { $regex: "@peoplesync\\.com$", $options: "i" }},
  { $set: { companyId: "company-c" }}
);

if (peoplesyncDomainResult.modifiedCount > 0) {
  print("✅ Updated " + peoplesyncDomainResult.modifiedCount + " users with @peoplesync.com domain");
} else {
  print("ℹ️  No @peoplesync.com users found");
}

print("");

// ============================================
// VERIFICATION
// ============================================
print("\n========================================");
print("VERIFICATION");
print("========================================\n");

// Count users by company
print("Users by Company:");
print("─────────────────────────────────────────");
db.users.aggregate([
  { $group: { _id: "$companyId", count: { $sum: 1 }}},
  { $sort: { _id: 1 }}
]).forEach(doc => {
  const companyName = doc._id || "(No Company)";
  const emoji = doc._id === "omoikaneinnovations" ? "🏢" :
                doc._id === "company-a" ? "🔵" :
                doc._id === "company-b" ? "🟢" :
                doc._id === "company-c" ? "🟣" : "⚠️";
  print(emoji + "  " + companyName + ": " + doc.count + " users");
});
print("");

// Check specific Omoi employees
print("\nOmoikaneinnovations Employees:");
print("─────────────────────────────────────────");
const omoiUsers = db.users.find(
  { email: { $in: omoiEmployees }},
  { email: 1, companyId: 1, name: 1, _id: 0 }
).toArray();

if (omoiUsers.length > 0) {
  omoiUsers.forEach(user => {
    const status = user.companyId === "omoikaneinnovations" ? "✅" : "❌";
    print(status + "  " + user.email + " → " + (user.companyId || "NO COMPANY"));
  });
} else {
  print("⚠️  No Omoi employees found in database");
}
print("");

// Check for users without companyId
print("\nUsers Without Company Assignment:");
print("─────────────────────────────────────────");
const usersWithoutCompany = db.users.find({
  $or: [
    { companyId: { $exists: false }},
    { companyId: null },
    { companyId: "" }
  ]
}, { email: 1, name: 1, _id: 0 }).limit(10).toArray();

if (usersWithoutCompany.length > 0) {
  print("⚠️  Found " + usersWithoutCompany.length + " users without companyId:");
  usersWithoutCompany.forEach(user => {
    print("   - " + user.email + " (" + (user.name || "N/A") + ")");
  });
  print("\n⚠️  These users need to be assigned to a company!");
} else {
  print("✅ All users have company assignments");
}
print("");

// ============================================
// TEST SCENARIOS
// ============================================
print("\n========================================");
print("TEST SCENARIOS");
print("========================================\n");

print("After restarting the backend, these logins should FAIL:\n");

print("❌ Aishwarya@company.com → TalentHub (localhost:5176)");
print("   Expected: Access denied (tenant mismatch)");
print("");

print("❌ Aishwarya@company.com → WorkForce Pro (localhost:5177)");
print("   Expected: Access denied (tenant mismatch)");
print("");

print("❌ Aishwarya@company.com → PeopleSync (localhost:5178)");
print("   Expected: Access denied (tenant mismatch)");
print("");

print("❌ Nikita@omoi.com → TalentHub (localhost:5176)");
print("   Expected: Access denied (tenant mismatch)");
print("");

print("❌ Mahesh@omoi.com → WorkForce Pro (localhost:5177)");
print("   Expected: Access denied (tenant mismatch)");
print("");

// ============================================
// NEXT STEPS
// ============================================
print("\n========================================");
print("NEXT STEPS");
print("========================================\n");

print("1. ✅ Database updated with company assignments");
print("");
print("2. ⚠️  RESTART THE BACKEND:");
print("   - Run: restart-backend.bat");
print("   - Or: cd HRMS-Backend && mvnw.cmd spring-boot:run");
print("");
print("3. ⚠️  TEST ALL PORTALS:");
print("   - TalentHub: http://localhost:5176");
print("   - WorkForce Pro: http://localhost:5177");
print("   - PeopleSync: http://localhost:5178");
print("");
print("4. ⚠️  VERIFY BLOCKING:");
print("   - Try login with Omoi employees (Aishwarya, Nikita, Mahesh)");
print("   - All should fail with 'Access denied' message");
print("");

print("========================================");
print("✅ Setup Complete!");
print("========================================\n");
