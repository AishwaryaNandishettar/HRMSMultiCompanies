// MongoDB Script to Fix Reporting Structure Field Names
// This script renames fields with spaces to proper camelCase names

// ===================================
// FIX EMPLOYEE COLLECTION
// ===================================

// Get all employees with wrong field names
const employees = db.employees.find({
  $or: [
    { "hr Business Partner": { $exists: true } },
    { "reporting Head": { $exists: true } }
  ]
}).toArray();

console.log(`Found ${employees.length} employees with wrong field names`);

employees.forEach(emp => {
  const updates = {};
  const unsets = {};
  
  // Fix "hr Business Partner" -> "hrName"
  if (emp["hr Business Partner"]) {
    updates.hrName = emp["hr Business Partner"];
    unsets["hr Business Partner"] = "";
  }
  
  // Fix "reporting Head" -> "reportingHead"
  if (emp["reporting Head"]) {
    updates.reportingHead = emp["reporting Head"];
    unsets["reporting Head"] = "";
  }
  
  // Apply updates
  if (Object.keys(updates).length > 0) {
    db.employees.updateOne(
      { _id: emp._id },
      {
        $set: updates,
        $unset: unsets
      }
    );
    console.log(`✅ Fixed employee: ${emp.employeeId} - ${emp.fullName}`);
  }
});

// ===================================
// FIX USER COLLECTION
// ===================================

// Get all users with wrong field names
const users = db.users.find({
  $or: [
    { "hr Business Partner": { $exists: true } },
    { "reporting Head": { $exists: true } }
  ]
}).toArray();

console.log(`Found ${users.length} users with wrong field names`);

users.forEach(user => {
  const updates = {};
  const unsets = {};
  
  // Fix "hr Business Partner" -> "hrName"
  if (user["hr Business Partner"]) {
    updates.hrName = user["hr Business Partner"];
    unsets["hr Business Partner"] = "";
  }
  
  // Fix "reporting Head" -> "reportingHead"
  if (user["reporting Head"]) {
    updates.reportingHead = user["reporting Head"];
    unsets["reporting Head"] = "";
  }
  
  // Apply updates
  if (Object.keys(updates).length > 0) {
    db.users.updateOne(
      { _id: user._id },
      {
        $set: updates,
        $unset: unsets
      }
    );
    console.log(`✅ Fixed user: ${user.email}`);
  }
});

console.log("✅ Script completed!");

// ===================================
// VERIFY FOR AISHWARYA
// ===================================

console.log("\n📋 Verification for Aishwarya:");

const aishwaryaEmployee = db.employees.findOne({ 
  email: "Aishwarya@company.com" 
});

console.log("Employee record:");
console.log("  hrName:", aishwaryaEmployee?.hrName);
console.log("  reportingHead:", aishwaryaEmployee?.reportingHead);

const aishwaryaUser = db.users.findOne({ 
  email: "Aishwarya@company.com" 
});

console.log("User record:");
console.log("  hrName:", aishwaryaUser?.hrName);
console.log("  reportingHead:", aishwaryaUser?.reportingHead);
