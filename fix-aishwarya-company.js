// MongoDB script to fix Aishwarya's company assignment
// Run this with: mongosh < fix-aishwarya-company.js

// Switch to your database
use hrms_db;

print("\n========================================");
print("Fixing Aishwarya's Company Assignment");
print("========================================\n");

// Check current state
print("1. Checking current state...");
const currentUser = db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1, name: 1, role: 1, _id: 0 }
);

if (currentUser) {
  print("   Found user:");
  printjson(currentUser);
  
  if (currentUser.companyId === "omoikaneinnovations") {
    print("   ✅ Already has correct companyId");
  } else if (currentUser.companyId) {
    print("   ⚠️  Has wrong companyId: " + currentUser.companyId);
  } else {
    print("   ❌ No companyId assigned");
  }
} else {
  print("   ❌ User not found!");
  print("   Make sure email is correct: Aishwarya@company.com");
  quit(1);
}

print("");

// Update the user
print("2. Assigning companyId: 'omoikaneinnovations'...");
const result = db.users.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: "omoikaneinnovations" }}
);

if (result.modifiedCount > 0) {
  print("   ✅ Successfully updated");
} else if (result.matchedCount > 0) {
  print("   ℹ️  Already had correct value (no change needed)");
} else {
  print("   ❌ Update failed!");
  quit(1);
}

print("");

// Verify the change
print("3. Verifying update...");
const updatedUser = db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1, name: 1, role: 1, _id: 0 }
);

print("   Current state:");
printjson(updatedUser);

if (updatedUser.companyId === "omoikaneinnovations") {
  print("\n✅ SUCCESS!");
  print("Aishwarya now has companyId: 'omoikaneinnovations'");
  print("\nNext steps:");
  print("1. Restart the backend server");
  print("2. Try logging in to TalentHub Solutions (localhost:5176)");
  print("3. Login should FAIL with 'Access denied' message");
} else {
  print("\n❌ FAILED!");
  print("CompanyId is still: " + (updatedUser.companyId || "null"));
}

print("\n========================================");
print("Script Complete");
print("========================================\n");
