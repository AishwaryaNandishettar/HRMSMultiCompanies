// MongoDB Script to Add hrName to Employee Collection

// Add hrName field to Aishwarya's employee record
db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  {
    $set: {
      hrName: "Vishnuvardhan"
    }
  }
);

console.log("✅ Added hrName to Aishwarya's employee record");

// Verify
const aishwarya = db.employees.findOne(
  { email: "Aishwarya@company.com" },
  { 
    fullName: 1, 
    manager: 1, 
    reportingHead: 1, 
    hrName: 1 
  }
);

console.log("\n📋 Verification:");
console.log("Name:", aishwarya.fullName);
console.log("Manager:", aishwarya.manager);
console.log("Reporting Head:", aishwarya.reportingHead);
console.log("HR Name:", aishwarya.hrName);

// Also add to User collection (if not already there)
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  {
    $set: {
      hrName: "Vishnuvardhan"
    }
  }
);

console.log("\n✅ Added hrName to Aishwarya's user record");

const aishwaryaUser = db.users.findOne(
  { email: "Aishwarya@company.com" },
  { 
    employeeName: 1, 
    managerName: 1, 
    reportingHead: 1, 
    hrName: 1 
  }
);

console.log("\n📋 User Verification:");
console.log("Name:", aishwaryaUser.employeeName);
console.log("Manager:", aishwaryaUser.managerName);
console.log("Reporting Head:", aishwaryaUser.reportingHead);
console.log("HR Name:", aishwaryaUser.hrName);
