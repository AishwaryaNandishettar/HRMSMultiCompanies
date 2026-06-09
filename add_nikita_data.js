// MongoDB script to add or update Nikita's data
// Run this in MongoDB Compass or mongo shell

// First, let's check if Nikita exists (by ID or email)
const nikitaById = db.jobs.findOne({_id: "48f4aa9d"});
const nikitaByEmail = db.jobs.findOne({email: "nikhitaadigannavar14@gmail.com"});

console.log("Nikita by ID:", nikitaById);
console.log("Nikita by Email:", nikitaByEmail);

// If Nikita doesn't exist, create her record
if (!nikitaById && !nikitaByEmail) {
  db.jobs.insertOne({
    _id: "48f4aa9d",
    jobId: "JOB-NIKITA-001",
    jobTitle: "Nikita Adigennavar",
    email: "nikhitaadigannavar14@gmail.com",
    phone: "993014419",
    status: "Applied",
    assignedTo: "aishwarya",
    department: "Development",
    designation: "Frontend Developer",
    experience: "2 years",
    salary: 500000,
    description: "Frontend Developer Position",
    comments: "New candidate application",
    postedDate: new Date().toISOString().split('T')[0]
  });
  console.log("✅ Nikita's record created");
} else if (nikitaById) {
  // Update existing record to ensure email and phone are correct
  db.jobs.updateOne(
    {_id: "48f4aa9d"}, 
    {
      $set: {
        email: "nikhitaadigannavar14@gmail.com",
        phone: "993014419",
        assignedTo: "aishwarya"
      }
    }
  );
  console.log("✅ Nikita's record updated");
} else if (nikitaByEmail) {
  // Update by email
  db.jobs.updateOne(
    {email: "nikhitaadigannavar14@gmail.com"}, 
    {
      $set: {
        _id: "48f4aa9d",
        phone: "993014419",
        assignedTo: "aishwarya"
      }
    }
  );
  console.log("✅ Nikita's record updated via email");
}

// Verify the final result
const finalNikita = db.jobs.findOne({$or: [{_id: "48f4aa9d"}, {email: "nikhitaadigannavar14@gmail.com"}]});
console.log("Final Nikita record:", finalNikita);