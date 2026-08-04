// MongoDB script to fix Nikita's phone number in database
// Run this in MongoDB Compass or mongo shell

// Update Nikita's record to ensure correct phone number
db.jobs.updateOne(
  { 
    $or: [
      { _id: "48f4aa9d" },
      { _id: { $regex: "48f4aa9d" } },
      { email: "nikhitaadigannavar14@gmail.com" },
      { jobTitle: { $regex: "Nikita", $options: "i" } }
    ]
  },
  { 
    $set: {
      phone: "9930145419",  // Correct Nikita's phone
      email: "nikhitaadigannavar14@gmail.com",
      assignedTo: "aishwarya"
    }
  }
);

console.log("✅ Nikita's phone updated to 9930145419");

// Verify the update
const nikita = db.jobs.findOne({
  $or: [
    { _id: "48f4aa9d" },
    { email: "nikhitaadigannavar14@gmail.com" }
  ]
});

console.log("📋 Nikita's record after update:");
console.log("Email:", nikita.email);
console.log("Phone:", nikita.phone);
console.log("AssignedTo:", nikita.assignedTo);