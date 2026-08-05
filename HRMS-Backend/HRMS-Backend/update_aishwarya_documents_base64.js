// update_aishwarya_documents_base64.js
// Direct MongoDB update to add sample Base64 documents for Aishwarya
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0";

// Sample Base64 PDF (very small placeholder - just for demonstration)
const samplePdfBase64 = "data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoxIDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9PdXRsaW5lcyAyIDAgUg0KL1BhZ2VzIDMgIDAgUg0KPj4NCmVuZG9iag0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCjMgMCBvYmoNCjw8DQovVHlwZSAvUGFnZXMNCi9Db3VudCAwDQo+Pg0KZW5kb2JqDQp4cmVmDQowIDQNCjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMDAwOSAwMDAwMCBuDQowMDAwMDAwMDc0IDAwMDAwIG4NCjAwMDAwMDAxMjEgMDAwMDAgbg0KdHJhaWxlcg0KPDwNCi9TaXplIDQNCi9Sb290IDEgMCBSDQo+Pg0Kc3RhcnR4cmVmDQoxNjkNCiUlRU9G";

async function updateAishwaryaDocuments() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("🔌 Connected to MongoDB");
    
    const db = client.db("Data_base_hrms");
    const employeesCollection = db.collection("employees");
    
    // Find Aishwarya's record
    const aishwarya = await employeesCollection.findOne({
      $or: [
        { email: "aishushettar9@gmail.com" },
        { fullName: { $regex: /aishwarya/i } }
      ]
    });
    
    if (!aishwarya) {
      console.log("❌ Aishwarya not found in Employee collection");
      return;
    }
    
    console.log(`✅ Found Aishwarya: ${aishwarya.fullName} (${aishwarya.email})`);
    console.log(`   Employee ID: ${aishwarya.employeeId}`);
    
    // Update with Base64 documents
    const documentUpdates = {
      resumeDocument: samplePdfBase64,
      aadhaarDocument: samplePdfBase64,
      offerLetterDocument: samplePdfBase64,
      panDocument: samplePdfBase64,
      educationDocument: samplePdfBase64
    };
    
    const result = await employeesCollection.updateOne(
      { _id: aishwarya._id },
      { $set: documentUpdates }
    );
    
    if (result.modifiedCount > 0) {
      console.log("✅ Successfully updated Aishwarya's documents with Base64 data");
      console.log("   Documents added:");
      console.log("   - Resume (Base64 PDF)");
      console.log("   - Aadhaar (Base64 PDF)");
      console.log("   - Offer Letter (Base64 PDF)");
      console.log("   - PAN Card (Base64 PDF)");
      console.log("   - Education Certificate (Base64 PDF)");
      console.log("\n📄 These documents will now be viewable and downloadable in the Profile page");
    } else {
      console.log("⚠️ No changes made to the document");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

// Run the script
updateAishwaryaDocuments().catch(console.error);