# ⚡ Quick Start - Copy & Paste Example

## 🎯 What You Need to Add to Your Code

This is a **simplified, ready-to-use example** that you can copy-paste directly into your code.

---

## 📁 **File 1: Update PipelineTable.jsx**

### **Step 1: Add Imports (Top of file)**

```javascript
// Add these imports to the top of PipelineTable.jsx
import UpdateStatusModal from "./UpdateStatusModal";
import axios from "axios";
```

### **Step 2: Add State Variables (Inside component)**

```javascript
// Add these state variables after your existing useState declarations
const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
const [selectedCandidateForUpdate, setSelectedCandidateForUpdate] = useState(null);
```

### **Step 3: Add Handler Function (Inside component)**

```javascript
// Add this handler function before the return statement
const handleStatusUpdate = async (updateData) => {
  try {
    // Call backend API
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/candidates/update-status`,
      updateData
    );

    // Update local state
    setCandidates(prev => 
      prev.map(c => 
        (c.id === updateData.candidateId || c._id === updateData.candidateId)
          ? { 
              ...c, 
              status: updateData.newStatus,
              stage: updateData.newStatus,
              comments: updateData.comments,
              stageClass: 
                updateData.newStatus === "Shortlisted" ? "shortlisted" :
                updateData.newStatus === "Interview Stage" ? "interview" :
                updateData.newStatus === "Selected" ? "selected" :
                updateData.newStatus === "Rejected" ? "rejected" : "applied"
            }
          : c
      )
    );

    alert(`✅ Status updated! Email sent to ${updateData.candidateEmail}`);
    setShowUpdateStatusModal(false);
    setSelectedCandidateForUpdate(null);

  } catch (error) {
    console.error("Error updating status:", error);
    alert("❌ Failed to update status. Please try again.");
  }
};
```

### **Step 4: Update Action Menu (Replace your existing action menu)**

Find this code in your file:
```javascript
{openMenu === c.id && (
  <div className="action-menu" ref={menuRef}>
    <div onClick={() =>
      navigate(`/recruitment/candidate/${c.id}`, { state: { candidate: c } })
    }>
      View Profile
    </div>
    ...
  </div>
)}
```

**Replace it with:**
```javascript
{openMenu === c.id && (
  <div className="action-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
    
    {/* ✅ NEW: Update Status Option */}
    <div 
      onClick={() => {
        setSelectedCandidateForUpdate(c);
        setShowUpdateStatusModal(true);
        setOpenMenu(null);
      }}
      style={{ 
        fontWeight: 600, 
        color: '#2563eb',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '8px',
        marginBottom: '4px'
      }}
    >
      ✏️ Update Status
    </div>

    {/* Existing options */}
    <div onClick={() =>
      navigate(`/recruitment/candidate/${c.id}`, { state: { candidate: c } })
    }>
      View Profile
    </div>
    
    {c.stage === 'Selected' && (
      <div 
        onClick={() => {
          setOfferLetterCandidate(c);
          setOpenMenu(null);
        }}
        style={{ 
          color: '#16a34a', 
          fontWeight: 600,
          borderTop: '1px solid #e5e7eb',
          paddingTop: '8px',
          marginTop: '4px'
        }}
      >
        📄 Release Offer Letter
      </div>
    )}
    
    <div>Move to Next Stage</div>
    <div>Schedule Interview</div>
    <div>Reject Candidate</div>
  </div>
)}
```

### **Step 5: Add Modal Component (At the end, before closing `</div>`)**

Find the end of your component (after the offer letter modal), add:

```javascript
{/* ✅ UPDATE STATUS MODAL */}
{showUpdateStatusModal && selectedCandidateForUpdate && (
  <UpdateStatusModal
    candidate={selectedCandidateForUpdate}
    onClose={() => {
      setShowUpdateStatusModal(false);
      setSelectedCandidateForUpdate(null);
    }}
    onSave={handleStatusUpdate}
  />
)}
```

---

## 📁 **File 2: Create Backend API (Node.js/Express)**

### **Option A: Create New File `routes/candidateRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Candidate = require('../models/Candidate'); // Adjust path to your model

// Configure email (use your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD // your app password
  }
});

// ✅ UPDATE CANDIDATE STATUS + SEND EMAIL
router.post('/update-status', async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      candidateEmail,
      newStatus,
      comments,
      emailSubject,
      emailBody
    } = req.body;

    console.log(`📋 Updating status for ${candidateName} to ${newStatus}`);

    // 1. Find and update candidate
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        status: newStatus,
        comments: comments,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: "Candidate not found" 
      });
    }

    // 2. Send email notification
    if (candidateEmail) {
      try {
        await transporter.sendMail({
          from: `"${process.env.COMPANY_NAME || 'HR Team'}" <${process.env.EMAIL_USER}>`,
          to: candidateEmail,
          subject: emailSubject,
          text: emailBody
        });

        console.log(`✅ Email sent to ${candidateEmail}`);
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError.message);
        // Don't fail the request if email fails
      }
    }

    // 3. Return success
    res.status(200).json({
      success: true,
      message: "Status updated and email sent successfully",
      candidate: candidate
    });

  } catch (error) {
    console.error("❌ Error updating candidate status:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

module.exports = router;
```

### **Option B: Add to Existing Routes File**

If you already have a candidates route file, just add this endpoint:

```javascript
// Add this to your existing candidateRoutes.js or recruitmentRoutes.js

app.post('/api/candidates/update-status', async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      candidateEmail,
      newStatus,
      comments,
      emailSubject,
      emailBody
    } = req.body;

    // Update database (adjust to your database method)
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        status: newStatus,
        comments: comments
      },
      { new: true }
    );

    // Send email
    if (candidateEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: candidateEmail,
        subject: emailSubject,
        text: emailBody
      });
    }

    res.json({ success: true, candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## 📁 **File 3: Update Environment Variables (`.env`)**

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
COMPANY_NAME=Your Company Name

# API Base URL (if not already set)
VITE_API_BASE_URL=http://localhost:5000
```

### **How to Get Gmail App Password:**

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to: https://myaccount.google.com/apppasswords
4. Generate new app password
5. Copy that password to EMAIL_PASSWORD in .env

---

## 📁 **File 4: Update Database Schema**

### **MongoDB (Mongoose) Example:**

```javascript
// models/Candidate.js

const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,  // ✅ MAKE THIS REQUIRED
    trim: true,
    lowercase: true
  },
  role: String,
  experience: String,
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Stage', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  comments: {
    type: String,  // ✅ ADD THIS FIELD
    default: ""
  },
  // ... your other fields
  
  // ✅ OPTIONAL: Add status history for tracking
  statusHistory: [{
    oldStatus: String,
    newStatus: String,
    comments: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now },
    emailSent: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema);
```

### **SQL (MySQL/PostgreSQL) Example:**

```sql
-- Add new columns to existing candidates table
ALTER TABLE candidates 
ADD COLUMN email VARCHAR(255) NOT NULL,
ADD COLUMN comments TEXT;

-- Optional: Create status history table
CREATE TABLE candidate_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  comments TEXT,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_sent BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);
```

---

## 🧪 **Testing the Feature**

### **1. Test Frontend (Browser)**

```javascript
// Open browser console and run:
console.log("Testing Update Status Modal");

// Click on a candidate's action menu (⋯)
// Click "Update Status"
// Fill in the form
// Click "Save & Notify Candidate"
// Check console for any errors
```

### **2. Test Backend API (Postman/Thunder Client)**

```
POST http://localhost:5000/api/candidates/update-status

Headers:
Content-Type: application/json

Body:
{
  "candidateId": "663f1234567890abcdef1234",
  "candidateName": "Rahul",
  "candidateEmail": "rahul@gmail.com",
  "newStatus": "Shortlisted",
  "comments": "Good communication skills. Technical knowledge is strong.",
  "emailSubject": "Application Shortlisted - Congratulations!",
  "emailBody": "Dear Rahul,\n\nCongratulations! Your profile has been shortlisted..."
}
```

Expected Response:
```json
{
  "success": true,
  "message": "Status updated and email sent successfully",
  "candidate": {
    "_id": "663f1234567890abcdef1234",
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "status": "Shortlisted",
    "comments": "Good communication skills..."
  }
}
```

### **3. Test Email Delivery**

1. Check the candidate's email inbox
2. Look for email from your configured sender
3. Verify subject line and body content
4. Check spam folder if not in inbox

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Modal Not Opening**

```javascript
// Check browser console for errors
// Verify imports are correct

// Debug:
console.log("UpdateStatusModal imported:", UpdateStatusModal);
console.log("Show modal state:", showUpdateStatusModal);
console.log("Selected candidate:", selectedCandidateForUpdate);
```

### **Issue 2: Email Not Sending**

```javascript
// Check backend logs
// Verify .env file has correct credentials

// Test email config:
const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "your-test-email@gmail.com",
      subject: "Test Email",
      text: "If you receive this, email is working!"
    });
    console.log("✅ Test email sent successfully");
  } catch (error) {
    console.error("❌ Test email failed:", error.message);
  }
};
```

### **Issue 3: Status Not Updating in UI**

```javascript
// Check if candidateId matches
console.log("Candidate ID in updateData:", updateData.candidateId);
console.log("Candidate IDs in state:", candidates.map(c => c.id || c._id));

// Make sure you're checking both c.id and c._id
```

---

## ✅ **Final Checklist**

```
FRONTEND:
□ UpdateStatusModal.jsx created
□ UpdateStatusModal.css created
□ PipelineTable.jsx imports added
□ State variables added
□ Handler function added
□ Action menu updated with "Update Status" button
□ Modal component added at end

BACKEND:
□ candidateRoutes.js created (or endpoint added to existing file)
□ Nodemailer installed (npm install nodemailer)
□ Email transporter configured
□ /update-status endpoint working
□ Routes registered in main server file

DATABASE:
□ email column added to candidates table
□ comments column added to candidates table
□ (Optional) status_history table created

CONFIGURATION:
□ .env file has EMAIL_USER
□ .env file has EMAIL_PASSWORD
□ .env file has COMPANY_NAME
□ Gmail App Password generated (if using Gmail)

TESTING:
□ Modal opens when clicking "Update Status"
□ Form validation works (requires comments)
□ API endpoint receives data correctly
□ Database updates successfully
□ Email sends to candidate
□ UI updates immediately after save
□ Success message shows to HR
```

---

## 🎉 **You're Done!**

After following these steps, your recruitment workflow automation will be fully functional!

HR can now:
- ✅ Update candidate status with one click
- ✅ Add comments/remarks for each status change
- ✅ Automatically send professional emails to candidates
- ✅ Track complete status history

Candidates will:
- ✅ Receive instant email notifications
- ✅ Know their application status at all times
- ✅ Feel valued with professional communication

---

**Need Help?** Check the full guide: `RECRUITMENT_WORKFLOW_IMPLEMENTATION_GUIDE.md`

