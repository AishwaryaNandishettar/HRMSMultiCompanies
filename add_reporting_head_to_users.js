// add_reporting_head_to_users.js
// Add reportingHead field to User collection
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0";

async function addReportingHeadToUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("🔌 Connected to MongoDB");
    
    const db = client.db("Data_base_hrms");
    const usersCollection = db.collection("users");
    const employeesCollection = db.collection("employees");
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`📋 Found ${users.length} users`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      console.log(`\n👤 Processing user: ${user.name || user.employeeName} (${user.email})`);
      
      // Find corresponding employee record
      const employee = await employeesCollection.findOne({
        $or: [
          { email: user.email },
          { employeeId: user.employeeId }
        ]
      });
      
      if (employee && employee.reportingHead) {
        // Update user with reporting head from employee
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              reportingHead: employee.reportingHead,
              // Also sync hrName if missing
              ...(employee.hrName && !user.hrName ? { hrName: employee.hrName } : {})
            } 
          }
        );
        
        updatedCount++;
        console.log(`   ✅ Added reportingHead: ${employee.reportingHead}`);
        
        if (employee.hrName && !user.hrName) {
          console.log(`   ✅ Added hrName: ${employee.hrName}`);
        }
      } else {
        console.log(`   ⚪ No employee record or reportingHead found`);
      }
    }
    
    console.log(`\n🎉 COMPLETED: Updated ${updatedCount} users with reportingHead`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

// Run the script
addReportingHeadToUsers().catch(console.error);