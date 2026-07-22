// MongoDB Script to Add reportingHead Field to Existing Documents
// Run this in MongoDB Compass or mongosh

// ===================================
// UPDATE EMPLOYEE COLLECTION
// ===================================

// Add reportingHead field to all employees (set to empty string initially)
db.employees.updateMany(
  {},
  { $set: { reportingHead: "" } }
);

console.log("✅ Added reportingHead field to employees collection");

// ===================================
// UPDATE USER COLLECTION
// ===================================

// Add reportingHead field to all users (set to empty string initially)
db.users.updateMany(
  {},
  { $set: { reportingHead: "" } }
);

console.log("✅ Added reportingHead field to users collection");

// ===================================
// OPTIONAL: Set specific reportingHead for specific employees
// ===================================

// Example: Set reporting head for a specific employee
// db.employees.updateOne(
//   { employeeId: "IT-EMP-0041" },
//   { $set: { reportingHead: "John Doe" } }
// );

// db.users.updateOne(
//   { email: "lata.b@omoikaneinnovations.com" },
//   { $set: { reportingHead: "John Doe" } }
// );

console.log("✅ Script completed!");

// ===================================
// VERIFY THE CHANGES
// ===================================

// Check a sample employee record
const sampleEmployee = db.employees.findOne({ employeeId: "IT-EMP-0041" });
console.log("Sample Employee Record:", sampleEmployee);

// Check a sample user record
const sampleUser = db.users.findOne({ email: "lata.b@omoikaneinnovations.com" });
console.log("Sample User Record:", sampleUser);
