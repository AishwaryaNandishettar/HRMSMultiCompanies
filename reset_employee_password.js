// MongoDB Script to Reset Employee Password and Enable Login
// Run this in MongoDB Compass → MONGOSH

// ===================================
// SET PASSWORD FOR AISHWARYA
// ===================================

// Step 1: Find the employee
const employee = db.employees.findOne({ 
  email: "aishushettar9@gmail.com" 
});

if (!employee) {
  console.log("❌ Employee not found!");
} else {
  console.log("✅ Employee found:", employee.fullName);
  console.log("   Employee ID:", employee.employeeId);
  console.log("   Email:", employee.email);
  console.log("   Status:", employee.status);
}

// Step 2: Find the user account
const user = db.users.findOne({ 
  email: "aishushettar9@gmail.com" 
});

if (!user) {
  console.log("❌ User account not found!");
} else {
  console.log("✅ User account found");
  console.log("   Email:", user.email);
  console.log("   Role:", user.role);
  console.log("   Active:", user.active);
}

// ===================================
// OPTION 1: Set Known Password
// ===================================

// Set password to: Welcome@123
// This is the BCrypt hash for "Welcome@123"
db.users.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      password: "$2a$10$EIXgP9L3qXqQ0YZ0kQX0QeK8h9.9Y6ZGJ1xLvR3fKx5YqGZLXX2Ky",
      active: true
    }
  }
);

console.log("\n✅ Password set to: Welcome@123");
console.log("   Email: aishushettar9@gmail.com");
console.log("   Password: Welcome@123");

// Activate employee
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { status: "ACTIVE" } }
);

console.log("✅ Employee status set to ACTIVE");

// ===================================
// VERIFY THE CHANGES
// ===================================

const updatedUser = db.users.findOne({ 
  email: "aishushettar9@gmail.com" 
});

const updatedEmployee = db.employees.findOne({ 
  email: "aishushettar9@gmail.com" 
});

console.log("\n📋 VERIFICATION:");
console.log("User active:", updatedUser.active);
console.log("Employee status:", updatedEmployee.status);
console.log("Role:", updatedUser.role);

console.log("\n🔑 LOGIN CREDENTIALS:");
console.log("═══════════════════════════════");
console.log("Email:    aishushettar9@gmail.com");
console.log("Password: Welcome@123");
console.log("URL:      http://localhost:5173");
console.log("═══════════════════════════════");

// ===================================
// OPTION 2: Set Custom Password
// ===================================

// If you want a different password, you need to generate BCrypt hash
// Use this Node.js code to generate:
/*
const bcrypt = require('bcrypt');
const password = 'YourPassword123';
const hash = bcrypt.hashSync(password, 10);
console.log('BCrypt hash:', hash);

Then use:
db.users.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { password: "PASTE_HASH_HERE" } }
);
*/
