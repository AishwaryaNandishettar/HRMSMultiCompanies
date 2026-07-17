// Verification script to check company assignments
// Run this with: mongosh < verify-companies.js

use hrms_db;

print("\n========================================");
print("Company Assignment Verification");
print("========================================\n");

// ============================================
// Check Omoikaneinnovations Employees
// ============================================
print("Omoikaneinnovations Employees:");
print("─────────────────────────────────────────\n");

const omoiEmployees = [
  "Aishwarya@company.com",
  "nikita@omoi.com",
  "mahesh@omoi.com",
  "vishnu@omoi.com",
  "padmanabh@omoi.com",
  "shambuling@omoi.com",
  "lata@omoi.com"
];

omoiEmployees.forEach(email => {
  const user = db.users.findOne(
    { email: email },
    { email: 1, companyId: 1, _id: 0 }
  );
  
  if (user) {
    const status = user.companyId === "omoikaneinnovations" ? "✅" : "❌";
    const company = user.companyId || "NO COMPANY";
    print(status + "  " + email);
    print("    └─ companyId: " + company);
    
    if (user.companyId !== "omoikaneinnovations") {
      print("    └─ ⚠️  WRONG! Should be 'omoikaneinnovations'");
    }
  } else {
    print("❌  " + email);
    print("    └─ User not found in database");
  }
  print("");
});

// ============================================
// Summary by Company
// ============================================
print("\n========================================");
print("Summary by Company");
print("========================================\n");

const summary = db.users.aggregate([
  { $group: { _id: "$companyId", count: { $sum: 1 }}},
  { $sort: { _id: 1 }}
]).toArray();

summary.forEach(doc => {
  const companyName = doc._id || "(No Company Assigned)";
  const emoji = doc._id === "omoikaneinnovations" ? "🏢" :
                doc._id === "company-a" ? "🔵" :
                doc._id === "company-b" ? "🟢" :
                doc._id === "company-c" ? "🟣" : "⚠️";
  
  print(emoji + "  " + companyName + ": " + doc.count + " users");
});

print("");

// ============================================
// Users Without Company
// ============================================
print("\n========================================");
print("Users Without Company");
print("========================================\n");

const noCompany = db.users.find({
  $or: [
    { companyId: { $exists: false }},
    { companyId: null },
    { companyId: "" }
  ]
}, { email: 1, name: 1, _id: 0 }).toArray();

if (noCompany.length > 0) {
  print("⚠️  Found " + noCompany.length + " users without company:\n");
  noCompany.forEach(user => {
    print("   - " + user.email);
  });
  print("\n⚠️  These users need company assignment!");
} else {
  print("✅ All users have company assignments");
}

print("");

// ============================================
// Status Check
// ============================================
print("\n========================================");
print("Status Check");
print("========================================\n");

const omoiCount = db.users.countDocuments({ companyId: "omoikaneinnovations" });
const companyACount = db.users.countDocuments({ companyId: "company-a" });
const companyBCount = db.users.countDocuments({ companyId: "company-b" });
const companyCCount = db.users.countDocuments({ companyId: "company-c" });
const noCompanyCount = db.users.countDocuments({
  $or: [
    { companyId: { $exists: false }},
    { companyId: null },
    { companyId: "" }
  ]
});

let allGood = true;

// Check if Omoi employees have correct companyId
const wrongOmoi = db.users.countDocuments({
  email: { $in: omoiEmployees },
  companyId: { $ne: "omoikaneinnovations" }
});

if (wrongOmoi > 0) {
  print("❌ " + wrongOmoi + " Omoi employees have wrong companyId");
  allGood = false;
} else {
  print("✅ All Omoi employees have correct companyId");
}

if (noCompanyCount > 0) {
  print("⚠️  " + noCompanyCount + " users without company assignment");
  allGood = false;
} else {
  print("✅ All users have company assignments");
}

print("");

if (allGood) {
  print("========================================");
  print("✅ ALL CHECKS PASSED!");
  print("========================================");
  print("");
  print("Next step: Restart backend");
  print("   Run: restart-backend.bat");
} else {
  print("========================================");
  print("❌ ISSUES FOUND!");
  print("========================================");
  print("");
  print("Fix by running: mongosh < fix-all-companies.js");
}

print("");
