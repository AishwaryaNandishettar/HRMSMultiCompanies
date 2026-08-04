// MongoDB Update Script for Nikita
// Run this in MongoDB Compass Query tab or mongo shell

// Method 1: Update by exact ID
db.jobs.updateOne(
  { _id: "48f4aa9d" },
  { 
    $set: {
      email: "nikhitaadigannavar14@gmail.com",
      phone: "993014419",
      assignedTo: "aishwarya",
      jobTitle: "Nikita Adigennavar"
    }
  },
  { upsert: false }
);

// Method 2: Update by ID pattern (if ID is longer)
db.jobs.updateOne(
  { _id: { $regex: "48f4aa9d" } },
  { 
    $set: {
      email: "nikhitaadigannavar14@gmail.com",
      phone: "993014419", 
      assignedTo: "aishwarya"
    }
  }
);

// Method 3: Update by name pattern
db.jobs.updateOne(
  { jobTitle: { $regex: "Nikita", $options: "i" } },
  { 
    $set: {
      email: "nikhitaadigannavar14@gmail.com",
      phone: "993014419",
      assignedTo: "aishwarya"
    }
  }
);

// Method 4: Find and update any matching record
db.jobs.updateMany(
  { 
    $or: [
      { _id: "48f4aa9d" },
      { _id: { $regex: "48f4aa9d" } },
      { jobTitle: { $regex: "Nikita", $options: "i" } },
      { email: "nikhitaadigannavar14@gmail.com" }
    ]
  },
  { 
    $set: {
      email: "nikhitaadigannavar14@gmail.com",
      phone: "993014419",
      assignedTo: "aishwarya"
    }
  }
);

// Verify the update
console.log("Checking updated record:");
db.jobs.findOne({
  $or: [
    { _id: "48f4aa9d" },
    { email: "nikhitaadigannavar14@gmail.com" },
    { jobTitle: { $regex: "Nikita", $options: "i" } }
  ]
});