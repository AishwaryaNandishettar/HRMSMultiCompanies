// MongoDB Script to Update Document URLs to Use Backend API
// This makes documents accessible via HTTP

console.log("═══════════════════════════════════════════════");
console.log("   Updating Document URLs for Aishwarya");
console.log("═══════════════════════════════════════════════");

// Find current onboarding record
const onboarding = db.onboarding_records.findOne({ 
  "personal.email": "aishushettar9@gmail.com" 
});

if (!onboarding) {
  console.log("❌ Onboarding record not found");
} else {
  console.log("\n✅ Found onboarding record");
  console.log("Current documents:", JSON.stringify(onboarding.documents, null, 2));
  
  // Extract filenames from paths
  const docs = onboarding.documents || {};
  
  // Function to extract filename from path
  function getFilename(path) {
    if (!path || path === 'N/A') return null;
    // Extract just the filename from /uploads/tasks/filename.ext
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  
  // Update with backend API URLs
  const updates = {};
  
  if (docs.resume) {
    const filename = getFilename(docs.resume);
    if (filename) {
      updates["documents.resume"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.pan || docs.pancard_pdf) {
    const filename = getFilename(docs.pan || docs.pancard_pdf);
    if (filename) {
      updates["documents.pan"] = `http://localhost:8082/api/files/download/${filename}`;
      updates["documents.pancard_pdf"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.aadhaar || docs.aadharFile || docs.adharcard_pdf) {
    const filename = getFilename(docs.aadhaar || docs.aadharFile || docs.adharcard_pdf);
    if (filename) {
      updates["documents.aadhaar"] = `http://localhost:8082/api/files/download/${filename}`;
      updates["documents.aadharFile"] = `http://localhost:8082/api/files/download/${filename}`;
      updates["documents.adharcard_pdf"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.offerLetter) {
    const filename = getFilename(docs.offerLetter);
    if (filename) {
      updates["documents.offerLetter"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.education) {
    const filename = getFilename(docs.education);
    if (filename) {
      updates["documents.education"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.experience) {
    const filename = getFilename(docs.experience);
    if (filename) {
      updates["documents.experience"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.paySlips) {
    const filename = getFilename(docs.paySlips);
    if (filename) {
      updates["documents.paySlips"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  if (docs.relieving) {
    const filename = getFilename(docs.relieving);
    if (filename) {
      updates["documents.relieving"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  // Apply updates
  if (Object.keys(updates).length > 0) {
    db.onboarding_records.updateOne(
      { "personal.email": "aishushettar9@gmail.com" },
      { $set: updates }
    );
    
    console.log("\n✅ Updated document URLs:");
    console.log(JSON.stringify(updates, null, 2));
  } else {
    console.log("\n❌ No valid document filenames found to update");
  }
}

console.log("\n═══════════════════════════════════════════════");
console.log("   ✅ DONE!");
console.log("═══════════════════════════════════════════════");
console.log("\n📝 Next steps:");
console.log("1. Restart backend: ./mvnw spring-boot:run");
console.log("2. Go to BGV page");
console.log("3. Click 'View File' on documents");
console.log("4. Documents should open in browser! ✅");
console.log("\n⚠️ NOTE: This only works for localhost.");
console.log("After deployment, you MUST use cloud storage (S3, Cloudinary)");
console.log("or Base64 in database for documents to work.");
console.log("═══════════════════════════════════════════════\n");
