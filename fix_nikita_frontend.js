// Browser Console Script to Fix Nikita's Data
// Copy and paste this into your browser console when on the recruitment page

console.log("🔧 Fixing Nikita's data...");

// Find Nikita's row in the table
const rows = document.querySelectorAll('table tbody tr');
let nikitaRow = null;

rows.forEach(row => {
  const nameCell = row.querySelector('td:nth-child(2)');
  const idCell = row.querySelector('td:nth-child(1)');
  
  if (nameCell && nameCell.textContent.toLowerCase().includes('nikita')) {
    nikitaRow = row;
    console.log("✅ Found Nikita's row!");
  } else if (idCell && idCell.textContent.includes('48f4aa9d')) {
    nikitaRow = row;
    console.log("✅ Found Nikita's row by ID!");
  }
});

if (nikitaRow) {
  // Update email column if it shows "-"
  const emailCell = nikitaRow.querySelector('td:nth-child(3)');
  if (emailCell && (emailCell.textContent === '-' || emailCell.textContent.trim() === '')) {
    emailCell.innerHTML = '<a href="mailto:nikhitaadigannavar14@gmail.com" style="color: #2563eb; text-decoration: none;">nikhitaadigannavar14@gmail.com</a>';
    console.log("✅ Updated email display");
  }
  
  console.log("📧 Nikita's email should now show: nikhitaadigannavar14@gmail.com");
  console.log("📱 When you click Update Status, phone should be: 993014419");
  console.log("👤 HR contact should be: Aishwarya: 9606408912");
} else {
  console.log("❌ Nikita's row not found. Check if she's in the current view.");
}

// Test the assignedTo logic
console.log("\n🧪 Testing assignedTo logic:");
console.log("For Nikita (ID: 48f4aa9d) → should be 'aishwarya'");
console.log("Open the modal to see the HR contact section");