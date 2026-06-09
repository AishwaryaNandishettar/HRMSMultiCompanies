// Node.js Script to Update Candidate Emails
// Run: node update-emails.js

const { MongoClient, ObjectId } = require('mongodb');

// ⚠️ UPDATE THIS CONNECTION STRING WITH YOUR MONGODB URL
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hrms";

async function updateEmails() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    
    const db = client.db();
    const jobsCollection = db.collection('jobs');
    
    // Update record with ID 69dcb1f662a8ab4848f4aa9c
    const result1 = await jobsCollection.updateOne(
      { _id: new ObjectId("69dcb1f662a8ab4848f4aa9c") },
      { $set: { email: "aishushettar95@gmail.com" } }
    );
    
    console.log(`📧 Updated Development role: ${result1.modifiedCount} record(s)`);
    
    // Find all Frontend Developer + Selected + IT records
    const allRecords = await jobsCollection.find({
      jobTitle: "Frontend Developer",
      status: "Selected",
      department: "IT"
    }).toArray();
    
    console.log(`\n📋 Found ${allRecords.length} Frontend Developer records:`);
    
    // Update each based on designation or order
    for (let i = 0; i < allRecords.length; i++) {
      const record = allRecords[i];
      let newEmail = "";
      
      // First record gets aishushettar95, second gets padmanabhac105
      if (record.designation === "Web Developer") {
        newEmail = "aishushettar95@gmail.com";
      } else {
        newEmail = "padmanabhac105@gmail.com";
      }
      
      await jobsCollection.updateOne(
        { _id: record._id },
        { $set: { email: newEmail } }
      );
      
      console.log(`   ✅ ${record._id}: ${record.jobTitle} → ${newEmail}`);
    }
    
    console.log("\n✅ All emails updated successfully!");
    console.log("🔄 Refresh your browser to see changes in the table");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
  }
}

updateEmails();
