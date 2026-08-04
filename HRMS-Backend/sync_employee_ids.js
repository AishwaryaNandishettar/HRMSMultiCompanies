// ================================
// MongoDB Script: Sync Employee IDs
// ================================
// This script syncs employeeId from Employee collection to User collection
// Run this to fix the timesheet empId display issue

print("╔═══════════════════════════════════════════════════════════╗");
print("║   🔄 Syncing Employee IDs from Employee to User          ║");
print("╚═══════════════════════════════════════════════════════════╝\n");

var updated = 0;
var notFound = 0;
var alreadyCorrect = 0;
var errors = 0;

print("📋 Processing users...\n");

db.users.find().forEach(function(user) {
  try {
    // Find corresponding employee by email
    var employee = db.employees.findOne({ email: user.email });
    
    if (employee && employee.employeeId) {
      // Check if user already has correct employeeId
      if (user.employeeId === employee.employeeId) {
        print("✓ Already correct: " + user.email + " → " + employee.employeeId);
        alreadyCorrect++;
      } else {
        // Update user with correct employeeId
        db.users.updateOne(
          { _id: user._id },
          { $set: { employeeId: employee.employeeId } }
        );
        print("✅ Updated: " + user.email);
        print("   Old: " + (user.employeeId || "null"));
        print("   New: " + employee.employeeId + "\n");
        updated++;
      }
    } else if (employee && !employee.employeeId) {
      print("⚠️  Employee record found but employeeId is null: " + user.email);
      notFound++;
    } else {
      print("⚠️  No employee record found: " + user.email);
      notFound++;
    }
  } catch (e) {
    print("❌ Error processing: " + user.email + " - " + e.message);
    errors++;
  }
});

print("\n╔═══════════════════════════════════════════════════════════╗");
print("║                    📊 SYNC SUMMARY                        ║");
print("╠═══════════════════════════════════════════════════════════╣");
print("║ ✅ Updated:          " + updated + " users                           ║");
print("║ ✓  Already Correct:  " + alreadyCorrect + " users                           ║");
print("║ ⚠️  Not Found:        " + notFound + " users                           ║");
print("║ ❌ Errors:            " + errors + " users                           ║");
print("╚═══════════════════════════════════════════════════════════╝\n");

if (updated > 0) {
  print("✅ Success! " + updated + " users updated.");
  print("🔄 Please restart your backend server for changes to take effect.\n");
} else if (alreadyCorrect > 0 && updated === 0) {
  print("✓ All users already have correct employeeId!");
  print("👉 If timesheet still shows wrong empId, check if:");
  print("   1. Backend is reading from correct database");
  print("   2. Attendance records have empId field populated\n");
} else {
  print("⚠️  No users were updated.");
  print("👉 Please check:");
  print("   1. Employee collection exists and has data");
  print("   2. Employees have employeeId field populated");
  print("   3. Email addresses match between User and Employee collections\n");
}

print("═══════════════════════════════════════════════════════════\n");
