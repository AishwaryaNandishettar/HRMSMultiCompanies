/**
 * MongoDB Script to Update Employee Names
 * This updates your local MongoDB with correct employee names
 * 
 * HOW TO RUN:
 * 1. Open MongoDB Compass or mongosh
 * 2. Connect to: mongodb://localhost:27017
 * 3. Select database: Data_base_hrms
 * 4. Run this script in the mongosh terminal
 */

// Connect to database
use Data_base_hrms

// Print current employee names
print("=".repeat(60));
print("CURRENT EMPLOYEE NAMES (Before Update):");
print("=".repeat(60));
db.employees.find({}, {employeeId: 1, fullName: 1, email: 1}).forEach(emp => {
    print(`${emp.employeeId}: ${emp.fullName} (${emp.email})`);
});

print("\n");
print("=".repeat(60));
print("UPDATING EMPLOYEE NAMES...");
print("=".repeat(60));

// ========================================
// UPDATE EACH EMPLOYEE WITH CORRECT NAMES
// ========================================

// Example updates - Replace these with your actual employee data
// Format: db.employees.updateOne({ filter }, { $set: { fields } })

// Update Employee 1
var result1 = db.employees.updateOne(
    { employeeId: "EMP101" },
    { $set: { fullName: "Pradyumna Mishra" } }
);
print("✅ Updated EMP101: " + (result1.modifiedCount > 0 ? "SUCCESS" : "NOT FOUND"));

// Update Employee 2
var result2 = db.employees.updateOne(
    { employeeId: "EMP102" },
    { $set: { fullName: "Badgjerrekha063" } }
);
print("✅ Updated EMP102: " + (result2.modifiedCount > 0 ? "SUCCESS" : "NOT FOUND"));

// Update Employee 3
var result3 = db.employees.updateOne(
    { employeeId: "EMP103" },
    { $set: { fullName: "Aishushettar95" } }
);
print("✅ Updated EMP103: " + (result3.modifiedCount > 0 ? "SUCCESS" : "NOT FOUND"));

// Update Employee 4
var result4 = db.employees.updateOne(
    { employeeId: "EMP105" },
    { $set: { fullName: "Aishwarya" } }
);
print("✅ Updated EMP105: " + (result4.modifiedCount > 0 ? "SUCCESS" : "NOT FOUND"));

// Add more updates as needed for other employees
// Copy this pattern:
/*
var resultX = db.employees.updateOne(
    { employeeId: "EMPXXX" },
    { $set: { fullName: "Correct Name Here" } }
);
print("✅ Updated EMPXXX: " + (resultX.modifiedCount > 0 ? "SUCCESS" : "NOT FOUND"));
*/

print("\n");
print("=".repeat(60));
print("UPDATED EMPLOYEE NAMES (After Update):");
print("=".repeat(60));
db.employees.find({}, {employeeId: 1, fullName: 1, email: 1}).forEach(emp => {
    print(`${emp.employeeId}: ${emp.fullName} (${emp.email})`);
});

print("\n");
print("✅ Update complete! Refresh your browser to see changes.");
