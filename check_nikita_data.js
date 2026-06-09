// MongoDB query to check Nikita's data in the jobs collection
// Run this in MongoDB Compass or mongo shell

// Connect to your MongoDB database and run:
db.jobs.findOne({_id: ObjectId("48f4aa9d")});

// Or if the ID is stored as string:
db.jobs.findOne({_id: "48f4aa9d"});

// Or search by partial ID (last 8 characters):
db.jobs.find({_id: {$regex: "48f4aa9d$"}});

// Also check if there's any document with Nikita's email:
db.jobs.findOne({email: "nikhitaadigannavar14@gmail.com"});

// Check all jobs to see the data structure:
db.jobs.find({}).limit(5);