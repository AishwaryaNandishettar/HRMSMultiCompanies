// MongoDB Script to Update Candidate Emails
// Run this in MongoDB Shell or MongoDB Compass

// Connect to your database
use('hrms'); // Replace 'hrms' with your actual database name

// Update "Development" role email
db.jobs.updateOne(
  { 
    jobTitle: "Frontend Developer",
    designation: "Web Developer",
    status: "Selected"
  },
  { 
    $set: { 
      email: "aishushettar95@gmail.com" 
    } 
  }
);

// Update "Frontend Developer" role email  
db.jobs.updateOne(
  { 
    jobTitle: "Frontend Developer",
    designation: "Web Developer",
    status: "Selected",
    email: { $ne: "aishushettar95@gmail.com" } // Find the other Frontend Developer record
  },
  { 
    $set: { 
      email: "padmanabhac105@gmail.com" 
    } 
  }
);

// If you need to update by specific _id (more precise):
// db.jobs.updateOne(
//   { _id: ObjectId("69dcb1f662a8ab4848f4aa9c") },
//   { $set: { email: "aishushettar95@gmail.com" } }
// );

print("✅ Email addresses updated successfully!");
print("Now refresh your frontend to see the changes.");
