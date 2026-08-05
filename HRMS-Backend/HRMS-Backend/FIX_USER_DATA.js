// MongoDB script to fix user data
// Run this in MongoDB Compass or mongosh

// Connect to your database first, then run these commands:

// 1. Fix Aishwarya (Admin) - Update designation
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  { 
    $set: { 
      designation: "HR Manager",
      employeeId: "ADMIN001",
      name: "Aishwarya"
    } 
  }
);

db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  { 
    $set: { 
      fullName: "Aishwarya",
      designation: "HR Manager",
      employeeId: "ADMIN001"
    } 
  }
);

// 2. Fix Nikita - Update name from "Adhviti" to "Nikita"
db.users.updateOne(
  { email: "nikita.adigennavar@omoikaneinnovation.com" },
  { 
    $set: { 
      name: "Nikita adigennavar",
      employeeId: "GN-EMP-0019"
    } 
  }
);

db.employees.updateOne(
  { email: "nikita.adigennavar@omoikaneinnovation.com" },
  { 
    $set: { 
      fullName: "Nikita adigennavar",
      employeeId: "GN-EMP-0019"
    } 
  }
);

// 3. Verify the changes
print("=== Verification ===");
print("Aishwarya (Admin):");
printjson(db.users.findOne({ email: "Aishwarya@company.com" }, { name: 1, designation: 1, employeeId: 1 }));

print("\nNikita:");
printjson(db.users.findOne({ email: "nikita.adigennavar@omoikaneinnovation.com" }, { name: 1, employeeId: 1 }));
