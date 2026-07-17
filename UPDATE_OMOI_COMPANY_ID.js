// ========================================
// UPDATE OMOI EMPLOYEES WITH COMPANY ID
// ========================================
// This script sets companyId="omoikaneinnovations" for all Omoi employees
// Run this in MongoDB shell (mongosh)

// Connect to your database
use hrms_db

// First, check current state of Omoi employees
print("========================================");
print("CURRENT STATE OF OMOI EMPLOYEES:");
print("========================================");
db.users.find(
  { email: { $in: [
    "Aishwarya@company.com",
    "nikita@omoi.com", 
    "mahesh@omoi.com",
    "lata@omoi.com"
  ]}},
  { email: 1, companyId: 1, _id: 0 }
).forEach(user => {
  print(`Email: ${user.email}, CompanyId: ${user.companyId || "NOT SET"}`);
});

// Update all Omoi employees with the correct companyId
print("\n========================================");
print("UPDATING OMOI EMPLOYEES...");
print("========================================");

const result = db.users.updateMany(
  { 
    email: { 
      $in: [
        "Aishwarya@company.com",
        "nikita@omoi.com", 
        "mahesh@omoi.com",
        "lata@omoi.com"
      ]
    }
  },
  { 
    $set: { 
      companyId: "omoikaneinnovations" 
    }
  }
);

print(`Matched: ${result.matchedCount} documents`);
print(`Modified: ${result.modifiedCount} documents`);

// Verify the update
print("\n========================================");
print("VERIFICATION - UPDATED STATE:");
print("========================================");
db.users.find(
  { email: { $in: [
    "Aishwarya@company.com",
    "nikita@omoi.com", 
    "mahesh@omoi.com",
    "lata@omoi.com"
  ]}},
  { email: 1, companyId: 1, _id: 0 }
).forEach(user => {
  print(`Email: ${user.email}, CompanyId: ${user.companyId || "NOT SET"}`);
});

print("\n========================================");
print("✅ UPDATE COMPLETE!");
print("========================================");
print("All Omoi employees now have companyId='omoikaneinnovations'");
print("This will block them from logging into company-a, company-b, company-c portals");
