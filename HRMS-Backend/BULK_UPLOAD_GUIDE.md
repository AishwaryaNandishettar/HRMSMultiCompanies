# 📋 Bulk Employee Upload - Complete Guide

## 📁 Files Created for You

1. **Bulk_Upload_Sample_Data.csv** - Ready-to-use sample file with 5 employees
2. This guide document

## 🚀 Quick Start (3 Steps)

### Step 1: Edit the Sample File

1. Open **Bulk_Upload_Sample_Data.csv** in:
   - Excel (close activation dialog if appears)
   - Google Sheets (recommended)
   - LibreOffice Calc (free)
   - Notepad (for simple edits)

2. Replace the sample data with your actual employee data

3. Save the file as **.xlsx** or **.csv**

### Step 2: Upload to System

1. Go to: `http://localhost:5173/bulk-upload`
2. Click **"Choose File"** button
3. Select your edited file
4. Employee data will appear in the table

### Step 3: Add Documents

1. For each employee, click **"📄 Upload Docs"** button
2. Upload these documents:
   - ✅ Resume (PDF, DOC, DOCX, images)
   - ✅ Aadhaar Card (PDF or image)
   - ✅ Offer Letter (PDF, DOC, DOCX)
   - ✅ PAN Card (PDF or image)
   - ✅ Education Certificate (PDF or image)
3. Click **"Done"** after uploading
4. Repeat for all employees
5. Click **"Final Upload"** to save everything

## 📊 Column Details

| Column Name | Description | Example | Required |
|-------------|-------------|---------|----------|
| fullName | Employee's full name | Rajesh Kumar | ✅ Yes |
| employeeId | Unique employee ID | EMP001 | ✅ Yes |
| email | Work email address | rajesh@company.com | ✅ Yes |
| phone | Mobile number | 9876543210 | ✅ Yes |
| department | Department name | IT, HR, Finance | ✅ Yes |
| designation | Job title | Software Engineer | ✅ Yes |
| location | Work location | Bangalore, Mumbai | ✅ Yes |
| manager | Reporting manager name | Vishnu Vardhan | ✅ Yes |
| dob | Date of birth | 1992-05-15 | ✅ Yes |
| doj | Date of joining | 2024-01-15 | ✅ Yes |
| bankAccountNumber | Bank account number | 1234567890123456 | No |
| ifsc | Bank IFSC code | SBIN0001234 | No |
| uan | UAN number | 123456789012 | No |
| pf | PF number | PF123456 | No |
| esic | ESIC number | ESI789012 | No |
| previousCompany | Last company name | TCS | No |
| previousDesignation | Last job title | Junior Developer | No |
| totalExperience | Years of experience | 3.5 | No |
| aadhaar | Aadhaar number | 123456789012 | No |
| pan | PAN number | ABCDE1234F | No |

## 📝 Important Notes

### Date Format
- Use **YYYY-MM-DD** format for dates
- Examples: 2024-01-15, 1992-05-15

### Phone Numbers
- Use 10-digit mobile numbers without spaces or special characters
- Example: 9876543210

### Email Addresses
- Must be unique for each employee
- Use company domain if available

### Employee IDs
- Must be unique for each employee
- Use consistent format: EMP001, EMP002, etc.

## 🎯 Sample Data Included

The sample file contains 5 employees:

1. **Rajesh Kumar** - Software Engineer (IT)
2. **Priya Sharma** - HR Manager (HR)
3. **Amit Patel** - Accountant (Finance)
4. **Sneha Reddy** - Marketing Manager (Marketing)
5. **Vikram Singh** - Senior Developer (IT)

## ⚠️ Common Mistakes to Avoid

❌ Don't use spaces in phone numbers
❌ Don't use wrong date format (use YYYY-MM-DD)
❌ Don't duplicate employee IDs
❌ Don't duplicate email addresses
❌ Don't leave required fields empty

✅ Do check spelling of names
✅ Do verify email addresses
✅ Do use consistent formatting
✅ Do upload documents for all employees

## 🔧 Troubleshooting

### Issue: Excel activation popup
**Solution:** Click "Close" and edit anyway, or use Google Sheets

### Issue: Can't save Excel file
**Solution:** Save as .csv instead of .xlsx

### Issue: Upload fails
**Solution:** Check all required fields are filled

### Issue: Document upload not working
**Solution:** 
- Check file size (max 5MB per file)
- Use supported formats (PDF, DOC, DOCX, JPG, PNG)
- Close and reopen the document upload modal

## 🌐 Using Google Sheets (Recommended)

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **"+ Blank"** to create new sheet
3. Copy data from **Bulk_Upload_Sample_Data.csv**
4. Edit with your employee data
5. **File → Download → Microsoft Excel (.xlsx)**
6. Upload the downloaded file

## 📞 Need Help?

If you face any issues:
1. Check this guide
2. Verify data format
3. Try with sample data first
4. Contact system administrator

---

## ✨ Features

- ✅ Bulk upload multiple employees at once
- ✅ Upload all required documents for each employee
- ✅ Edit data directly in the web interface
- ✅ Visual indicators for uploaded documents
- ✅ Delete/remove employees before final upload
- ✅ Download template with correct format
- ✅ Support for CSV and Excel formats

---

**Last Updated:** August 1, 2026
**System:** HRMS Employee Portal v2.0
