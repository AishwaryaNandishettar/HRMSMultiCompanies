# Test Nikita Auto-Population Functionality

## Quick Test Steps

### Step 1: Check Database (MongoDB)
Run this in MongoDB Compass or mongo shell:
```javascript
// Find Nikita's record
db.jobs.findOne({$or: [{_id: "48f4aa9d"}, {email: "nikhitaadigannavar14@gmail.com"}]})
```

**Expected Result**: Should show Nikita's record with email and phone fields populated.

### Step 2: Test Frontend Auto-Population
1. Open browser and navigate to HRMS
2. Go to Recruitment → Pipeline 
3. Find Nikita Adigennavar (ID ending in 48f4aa9d)
4. Right-click → Inspect → Console tab (to see debug logs)
5. Click "⋯" → "Update Status" on Nikita's row

**Expected Result**: 
- Console shows: `candidate.email: "nikhitaadigannavar14@gmail.com"`
- Console shows: `candidate.phone: "993014419"`
- Email field is pre-filled with `nikhitaadigannavar14@gmail.com`
- Phone field is pre-filled with `993014419`
- HR section shows: `📞 Aishwarya: 9606408912`

### Step 3: Test Status Update & SMS
1. Change status to "Shortlisted"
2. Add comment: "Test - checking auto-population"
3. Verify email and phone are correct
4. Click "📧📱 Send Email & SMS"

**Expected Result**:
- Success message shows email sent to nikhitaadigannavar14@gmail.com
- SMS sent to candidate phone 993014419
- SMS sent to Aishwarya 9606408912
- Database updated with new status and comments

## Troubleshooting

### If Email/Phone Fields Are Empty:
1. **Check console logs** - look for "=== CANDIDATE DATA DEBUG ===" section
2. **Check database** - run MongoDB query to see if data exists
3. **Update database** - use `add_nikita_data.js` script if needed

### If Wrong HR Person Shown:
- Should show "Aishwarya: 9606408912" for Nikita
- If showing different HR person, check assignedTo field in database

### If SMS Not Working:
1. Check Twilio configuration in `application.properties`
2. Verify phone numbers are correct format (10 digits)
3. Check backend console logs for SMS errors

## Database Fix Script (If Needed)
If Nikita's data is not in database, run:
```javascript
db.jobs.updateOne(
  {_id: "48f4aa9d"}, 
  {
    $set: {
      email: "nikhitaadigannavar14@gmail.com",
      phone: "993014419", 
      assignedTo: "aishwarya",
      jobTitle: "Nikita Adigennavar"
    }
  },
  {upsert: true} // Creates record if it doesn't exist
);
```

## Success Criteria
✅ Email auto-populates: `nikhitaadigannavar14@gmail.com`  
✅ Phone auto-populates: `993014419`  
✅ Assigned to Aishwarya: `9606408912`  
✅ Status update works without errors  
✅ SMS sent to both candidate and HR  
✅ Works for future candidates dynamically  

## Next Candidate Test
To verify system works for future candidates:
1. Create new candidate record in database
2. Leave email/phone empty initially  
3. Update status → enter email/phone manually first time
4. System saves the data
5. Next status update → email/phone should auto-populate

This confirms the system works dynamically without hardcoding!