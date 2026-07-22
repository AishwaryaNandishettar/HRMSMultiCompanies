// MongoDB Script to Update Aishwarya's Documents with Base64
// This will make documents viewable in BGV and Profile pages

// ===================================
// STEP 1: Check Current Data
// ===================================

console.log("═══════════════════════════════════════════════");
console.log("   Checking Aishwarya's Current Records");
console.log("═══════════════════════════════════════════════");

const employee = db.employees.findOne({ 
  email: "aishushettar9@gmail.com" 
});

const onboarding = db.onboarding_records.findOne({ 
  "personal.email": "aishushettar9@gmail.com" 
});

if (employee) {
  console.log("\n✅ Employee found:");
  console.log("   Name:", employee.fullName);
  console.log("   Employee ID:", employee.employeeId);
  console.log("   Email:", employee.email);
}

if (onboarding) {
  console.log("\n✅ Onboarding record found");
  console.log("   Documents:", JSON.stringify(onboarding.documents, null, 2));
}

// ===================================
// STEP 2: Update with Test PDF
// ===================================

console.log("\n═══════════════════════════════════════════════");
console.log("   Adding Test PDF Documents");
console.log("═══════════════════════════════════════════════");

// This is a tiny test PDF that displays "Test PDF"
const testPDF = "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L0xlbmd0aCA0Mz4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooVGVzdCBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDE3OCAwMDAwMCBuIAowMDAwMDAwMDc5IDAwMDAwIG4gCjAwMDAwMDAwMDggMDAwMDAgbiAKMDAwMDAwMDIzNyAwMDAwMCBuIAowMDAwMDAwMjg2IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDQgMCBSCj4+CnN0YXJ0eHJlZgozODQKJSVFT0YK";

// Update Employee record
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      resumeDocument: testPDF,
      panDocument: testPDF,
      aadhaarDocument: testPDF,
      offerLetterDocument: testPDF,
      educationDocument: testPDF
    }
  }
);

console.log("\n✅ Employee documents updated with test PDFs");

// Update Onboarding record
db.onboarding_records.updateOne(
  { "personal.email": "aishushettar9@gmail.com" },
  {
    $set: {
      "documents.resume": testPDF,
      "documents.pan": testPDF,
      "documents.aadhaar": testPDF,
      "documents.aadharFile": testPDF,
      "documents.pancard_pdf": testPDF,
      "documents.adharcard_pdf": testPDF,
      "documents.offerLetter": testPDF,
      "documents.education": testPDF,
      "documents.experience": testPDF,
      "documents.paySlips": testPDF,
      "documents.relieving": testPDF
    }
  }
);

console.log("✅ Onboarding documents updated with test PDFs");

// ===================================
// STEP 3: Verify
// ===================================

console.log("\n═══════════════════════════════════════════════");
console.log("   Verification");
console.log("═══════════════════════════════════════════════");

const updatedEmployee = db.employees.findOne(
  { email: "aishushettar9@gmail.com" },
  { resumeDocument: 1, panDocument: 1, aadhaarDocument: 1 }
);

console.log("\n✅ Employee documents:");
console.log("   Resume:", updatedEmployee.resumeDocument ? "✅ Set (Base64 data)" : "❌ Not set");
console.log("   PAN:", updatedEmployee.panDocument ? "✅ Set (Base64 data)" : "❌ Not set");
console.log("   Aadhaar:", updatedEmployee.aadhaarDocument ? "✅ Set (Base64 data)" : "❌ Not set");

const updatedOnboarding = db.onboarding_records.findOne(
  { "personal.email": "aishushettar9@gmail.com" },
  { documents: 1 }
);

console.log("\n✅ Onboarding documents:");
console.log("   Resume:", updatedOnboarding.documents?.resume ? "✅ Set" : "❌ Not set");
console.log("   PAN:", updatedOnboarding.documents?.pan ? "✅ Set" : "❌ Not set");
console.log("   Aadhaar:", updatedOnboarding.documents?.aadhaar ? "✅ Set" : "❌ Not set");

// ===================================
// STEP 4: Instructions
// ===================================

console.log("\n═══════════════════════════════════════════════");
console.log("   ✅ DONE! Now Test:");
console.log("═══════════════════════════════════════════════");
console.log("\n1. Login to HRMS as Aishwarya:");
console.log("   Email: aishushettar9@gmail.com");
console.log("   Password: Welcome@123");
console.log("");
console.log("2. Go to Profile page");
console.log("");
console.log("3. Scroll to Documents section");
console.log("   You should see:");
console.log("   - Resume.pdf [Download] [View]");
console.log("   - PAN_Card.pdf [Download] [View]");
console.log("   - Aadhaar.pdf [Download] [View]");
console.log("");
console.log("4. Click 'View' - PDF opens in new tab ✅");
console.log("");
console.log("5. Click 'Download' - PDF downloads ✅");
console.log("");
console.log("6. Also check BGV page (as admin):");
console.log("   - Documents should show [View File] buttons");
console.log("   - Clicking opens PDF ✅");
console.log("");
console.log("═══════════════════════════════════════════════");
console.log("\n📝 NOTE: These are test PDFs that display 'Test PDF'");
console.log("To add real documents, convert your uploaded files");
console.log("to Base64 using: convert_pdf_to_base64.js");
console.log("═══════════════════════════════════════════════\n");
