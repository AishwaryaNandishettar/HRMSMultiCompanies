// Node.js Script to Convert PDF Files to Base64 for MongoDB Storage
// Usage: node convert_pdf_to_base64.js <path-to-pdf-file>

const fs = require('fs');
const path = require('path');

function convertPdfToBase64(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }

    // Check file size (warn if > 5MB)
    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > 5) {
      console.warn(`⚠️  WARNING: File is ${fileSizeMB.toFixed(2)}MB. Large files may cause issues.`);
      console.warn(`   MongoDB has a 16MB document size limit.`);
      console.warn(`   Base64 encoding increases size by ~33%.`);
    }

    // Read file and convert to Base64
    const pdfBuffer = fs.readFileSync(filePath);
    const base64 = pdfBuffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    // Display results
    console.log('\n✅ PDF converted to Base64 successfully!');
    console.log(`📄 File: ${path.basename(filePath)}`);
    console.log(`📊 Original Size: ${fileSizeMB.toFixed(2)}MB`);
    console.log(`📊 Base64 Size: ${(dataUrl.length / (1024 * 1024)).toFixed(2)}MB`);
    console.log('\n📋 Base64 Data URL (copy this to MongoDB):');
    console.log('─'.repeat(80));
    console.log(dataUrl);
    console.log('─'.repeat(80));

    // Save to file for easy copying
    const outputFile = `${path.basename(filePath, '.pdf')}_base64.txt`;
    fs.writeFileSync(outputFile, dataUrl);
    console.log(`\n💾 Saved to: ${outputFile}`);

    // Generate MongoDB update command
    const fileName = path.basename(filePath);
    let fieldName = 'resumeDocument';
    
    if (fileName.toLowerCase().includes('aadhaar') || fileName.toLowerCase().includes('aadhar')) {
      fieldName = 'aadhaarDocument';
    } else if (fileName.toLowerCase().includes('offer')) {
      fieldName = 'offerLetterDocument';
    } else if (fileName.toLowerCase().includes('pan')) {
      fieldName = 'panDocument';
    } else if (fileName.toLowerCase().includes('education') || fileName.toLowerCase().includes('certificate')) {
      fieldName = 'educationDocument';
    }

    console.log('\n📝 MongoDB Update Command:');
    console.log('─'.repeat(80));
    console.log(`db.employees.updateOne(`);
    console.log(`  { email: "employee@company.com" },  // Change to actual email`);
    console.log(`  { $set: { ${fieldName}: "<paste-base64-here>" } }`);
    console.log(`);`);
    console.log('─'.repeat(80));

    return dataUrl;

  } catch (error) {
    console.error('❌ Error converting PDF:', error.message);
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📚 PDF to Base64 Converter for HRMS Documents');
    console.log('─'.repeat(80));
    console.log('\nUsage:');
    console.log('  node convert_pdf_to_base64.js <path-to-pdf-file>');
    console.log('\nExamples:');
    console.log('  node convert_pdf_to_base64.js Resume.pdf');
    console.log('  node convert_pdf_to_base64.js "C:\\Documents\\Aadhaar.pdf"');
    console.log('  node convert_pdf_to_base64.js /home/user/OfferLetter.pdf');
    console.log('\nSupported Documents:');
    console.log('  - Resume.pdf → resumeDocument');
    console.log('  - Aadhaar.pdf → aadhaarDocument');
    console.log('  - OfferLetter.pdf → offerLetterDocument');
    console.log('  - PAN.pdf → panDocument');
    console.log('  - Certificate.pdf → educationDocument');
    console.log('─'.repeat(80));
    process.exit(0);
  }

  const filePath = args[0];
  convertPdfToBase64(filePath);
}

module.exports = { convertPdfToBase64 };
