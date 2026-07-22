// fix_documents_storage.js
// This script converts file paths to Base64 and updates Employee documents
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI || "mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0";

async function fixDocumentsStorage() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("🔌 Connected to MongoDB");
    
    const db = client.db("Data_base_hrms");
    const employeesCollection = db.collection("employees");
    
    // Get all employees
    const employees = await employeesCollection.find({}).toArray();
    console.log(`📋 Found ${employees.length} employees`);
    
    let updatedCount = 0;
    
    for (const employee of employees) {
      const updates = {};
      let hasUpdates = false;
      
      console.log(`\n👤 Processing: ${employee.fullName} (${employee.email})`);
      
      // Check for uploaded documents that need conversion
      const documentFields = [
        'resumeDocument',
        'aadhaarDocument', 
        'offerLetterDocument',
        'panDocument',
        'educationDocument'
      ];
      
      for (const field of documentFields) {
        const docPath = employee[field];
        
        if (docPath && typeof docPath === 'string') {
          // Skip if already Base64 or proper URL
          if (docPath.startsWith('data:') || docPath.startsWith('http')) {
            console.log(`   ✅ ${field}: Already properly formatted`);
            continue;
          }
          
          // Skip if it's just "N/A" or empty
          if (!docPath || docPath === 'N/A') {
            console.log(`   ⚪ ${field}: Not uploaded`);
            continue;
          }
          
          // Check if it's a file path that exists
          const fullPath = path.join(__dirname, docPath);
          
          try {
            if (fs.existsSync(fullPath)) {
              // Convert to Base64
              const fileBuffer = fs.readFileSync(fullPath);
              const fileExtension = path.extname(docPath).toLowerCase();
              
              let mimeType = 'application/octet-stream';
              if (fileExtension === '.pdf') mimeType = 'application/pdf';
              else if (fileExtension === '.doc') mimeType = 'application/msword';
              else if (fileExtension === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              else if (['.jpg', '.jpeg'].includes(fileExtension)) mimeType = 'image/jpeg';
              else if (fileExtension === '.png') mimeType = 'image/png';
              
              const base64Data = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
              
              updates[field] = base64Data;
              hasUpdates = true;
              
              console.log(`   🔄 ${field}: Converted to Base64 (${(base64Data.length / 1024).toFixed(1)} KB)`);
            } else {
              console.log(`   ❌ ${field}: File not found at ${fullPath}`);
              // For missing files, we could set a placeholder or leave as-is
            }
          } catch (error) {
            console.error(`   ❌ ${field}: Error processing file: ${error.message}`);
          }
        }
      }
      
      // Apply updates if any
      if (hasUpdates) {
        await employeesCollection.updateOne(
          { _id: employee._id },
          { $set: updates }
        );
        
        updatedCount++;
        console.log(`   ✅ Updated ${Object.keys(updates).length} documents for ${employee.fullName}`);
      } else {
        console.log(`   ⚪ No documents to update for ${employee.fullName}`);
      }
    }
    
    console.log(`\n🎉 COMPLETED: Updated documents for ${updatedCount} employees`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

// Run the script
fixDocumentsStorage().catch(console.error);