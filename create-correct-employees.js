/**
 * MongoDB Script to Create Correct Employee Records
 * This creates employees matching your Vercel production data
 * 
 * HOW TO RUN:
 * 1. Open Command Prompt
 * 2. Run: mongosh
 * 3. Then run: load('create-correct-employees.js')
 * OR
 * 4. Run directly: mongosh < create-correct-employees.js
 */

// Connect to database
use Data_base_hrms

print("=".repeat(70));
print(" CREATING CORRECT EMPLOYEE RECORDS");
print("=".repeat(70));
print("");

// First, remove the test data (Rahul Sharma, Silk Smitha, etc.)
print("🗑️  Removing old test data...");
db.employees.deleteMany({
    employeeId: { $in: ["EMP101", "EMP102", "EMP103", "EMP105"] }
});
print("✅ Old test data removed");
print("");

// Create the correct employees as shown in Vercel
print("👥 Creating correct employee records...");
print("");

// Employee 1: Lata Benakop
var emp1 = {
    employeeId: "IT-EMP-0041",
    fullName: "Lata Benakop",
    email: "lata.benakop@company.com",
    department: "IT",
    designation: "Software Developer",
    location: "Haveri",
    status: "ACTIVE",
    doj: "2024-01-15",
    dob: "1995-03-20",
    manager: "Manager Name",
    managerEmail: "manager@company.com",
    companyId: "omoikaneinnovations",
    createdAt: new Date()
};

db.employees.insertOne(emp1);
print("✅ Created: Lata Benakop (IT-EMP-0041)");

// Employee 2: Mahesh Panchal
var emp2 = {
    employeeId: "GN-EMP-0018",
    fullName: "Mahesh Panchal",
    email: "mahesh.panchal@company.com",
    department: "IT",
    designation: "Software Developer",
    location: "Bangalore",
    status: "ACTIVE",
    doj: "2024-02-01",
    dob: "1992-07-15",
    manager: "Manager Name",
    managerEmail: "manager@company.com",
    companyId: "omoikaneinnovations",
    createdAt: new Date()
};

db.employees.insertOne(emp2);
print("✅ Created: Mahesh Panchal (GN-EMP-0018)");

// Employee 3: Nikita aoigemanavar
var emp3 = {
    employeeId: "GN-EMP-0019",
    fullName: "Nikita aoigemanavar",
    email: "nikita.aoigemanavar@company.com",
    department: "IT",
    designation: "Software Developer",
    location: "Mumbai",
    status: "ACTIVE",
    doj: "2024-02-15",
    dob: "1994-11-08",
    manager: "Manager Name",
    managerEmail: "manager@company.com",
    companyId: "omoikaneinnovations",
    createdAt: new Date()
};

db.employees.insertOne(emp3);
print("✅ Created: Nikita aoigemanavar (GN-EMP-0019)");

// Employee 4: Padmanabh Chikkanoor
var emp4 = {
    employeeId: "GN-EMP-0005",
    fullName: "Padmanabh Chikkanoor",
    email: "padmanabh.chikkanoor@company.com",
    department: "IT",
    designation: "Business Developer",
    location: "Bangalore",
    status: "ACTIVE",
    doj: "2023-12-01",
    dob: "1990-05-25",
    manager: "Manager Name",
    managerEmail: "manager@company.com",
    companyId: "omoikaneinnovations",
    createdAt: new Date()
};

db.employees.insertOne(emp4);
print("✅ Created: Padmanabh Chikkanoor (GN-EMP-0005)");

print("");
print("=".repeat(70));
print(" SUMMARY - Employees Created");
print("=".repeat(70));
print("");

db.employees.find({}, {
    employeeId: 1,
    fullName: 1,
    department: 1,
    designation: 1,
    location: 1,
    _id: 0
}).forEach(emp => {
    print(`  ${emp.employeeId.padEnd(15)} ${emp.fullName.padEnd(25)} ${emp.designation}`);
});

print("");
print("=".repeat(70));
print(" ✅ COMPLETE!");
print("=".repeat(70));
print("");
print("Next steps:");
print("1. Refresh your browser at http://localhost:5173/employee-card");
print("2. You should now see:");
print("   - Lata Benakop");
print("   - Mahesh Panchal");
print("   - Nikita aoigemanavar");
print("   - Padmanabh Chikkanoor");
print("");
print("These match your Vercel deployment!");
print("");
