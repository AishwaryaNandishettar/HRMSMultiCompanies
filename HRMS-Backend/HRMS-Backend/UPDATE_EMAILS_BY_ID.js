// MongoDB Script - Update Emails by Exact Record ID
// Run this using: mongosh < UPDATE_EMAILS_BY_ID.js
// Or copy-paste into MongoDB Compass

// Update the "Development" / "Web Developer" record
db.jobs.updateOne(
  { _id: ObjectId("69dcb1f662a8ab4848f4aa9c") },
  { $set: { email: "aishushettar95@gmail.com" } }
);

print("✅ Updated Development role email to: aishushettar95@gmail.com");

// If you have the _id for the second "Frontend Developer" record, update here:
// db.jobs.updateOne(
//   { _id: ObjectId("PASTE_THE_OTHER_ID_HERE") },
//   { $set: { email: "padmanabhac105@gmail.com" } }
// );

// Alternative: Update ALL "Frontend Developer" records at once
db.jobs.updateMany(
  { 
    jobTitle: "Frontend Developer",
    status: "Selected",
    department: "IT"
  },
  [
    {
      $set: {
        email: {
          $cond: {
            if: { $eq: ["$designation", "Web Developer"] },
            then: "aishushettar95@gmail.com",
            else: "padmanabhac105@gmail.com"
          }
        }
      }
    }
  ]
);

print("✅ All Frontend Developer emails updated!");
print("");
print("🔄 Now do the following:");
print("1. Refresh your browser page");
print("2. The Email column will show the updated addresses");
