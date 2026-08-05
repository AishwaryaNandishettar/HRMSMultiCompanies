// Quick verification of Aishwarya's company assignment
use hrms_db;

print("\n========================================");
print("Checking Aishwarya's Company Assignment");
print("========================================\n");

const user = db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1, name: 1, _id: 0 }
);

if (user) {
  print("✅ User found:");
  print("   Email: " + user.email);
  print("   CompanyId: " + (user.companyId || "❌ NOT SET"));
  print("   Name: " + (user.name || "N/A"));
  print("");
  
  if (user.companyId === "omoikaneinnovations") {
    print("✅ CompanyId is CORRECT");
    print("");
    print("Since companyId is correct but login still works,");
    print("the problem is:");
    print("  ❌ Backend NOT restarted properly");
    print("  ❌ OR tenant validation code not running");
    print("");
    print("Solution:");
    print("  1. COMPLETELY STOP the backend");
    print("  2. Rebuild: mvnw.cmd clean install");
    print("  3. Start: mvnw.cmd spring-boot:run");
  } else {
    print("❌ CompanyId is WRONG or NOT SET");
    print("");
    print("Fixing now...");
    
    db.users.updateOne(
      { email: "Aishwarya@company.com" },
      { $set: { companyId: "omoikaneinnovations" }}
    );
    
    const updated = db.users.findOne(
      { email: "Aishwarya@company.com" },
      { companyId: 1, _id: 0 }
    );
    
    if (updated.companyId === "omoikaneinnovations") {
      print("✅ FIXED! CompanyId is now: omoikaneinnovations");
      print("");
      print("Next step: Restart backend");
    } else {
      print("❌ Update failed!");
    }
  }
} else {
  print("❌ User NOT FOUND in database!");
  print("   Email searched: Aishwarya@company.com");
  print("");
  print("Check if email is correct or if user exists.");
}

print("\n========================================\n");
