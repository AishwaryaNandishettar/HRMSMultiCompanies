# 👥 Employee Recruitment View - Quick Guide

## 🎯 Overview

Employees can now view and apply for open job positions through the Recruitment page, while all admin/manager controls remain hidden and intact.

---

## 🔐 Access Control

### Who Can Access?
- ✅ **Admin** - Full access (view, post, edit, manage)
- ✅ **Manager** - Full access (view, post, edit, manage)  
- ✅ **Employee** - View & Apply only (restricted access)

---

## 📱 Employee View Features

### ✅ What Employees CAN Do:

1. **View Open Positions**
   - See all jobs with status "Open"
   - Browse job titles, departments, descriptions
   - Check CTC, designation, posted dates

2. **Search & Filter**
   - Search by job title or department
   - Filter by department

3. **View Job Details**
   - Click 👁️ icon to see full job description
   - View location, work mode, job type
   - See experience requirements

4. **Apply for Jobs**
   - Click "📝 Apply Now" button
   - Get instant confirmation
   - Application sent to HR automatically

### ❌ What Employees CANNOT Do:

1. Post new jobs (button hidden)
2. Change job status (HR Action column hidden)
3. View candidate pipeline (section hidden)
4. View hiring analytics (section hidden)
5. Release offer letters (feature hidden)
6. View closed/interview/rejected jobs (filtered out)

---

## 🖼️ Screenshots (What Employee Sees)

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 OMOIKANE INNOVATIONS - Recruitment Dashboard            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📋 Recruitment Dashboard                                   │
│  Track and manage job openings, candidate pipelines, and    │
│  hiring progress.                                            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  🔍 Search: [________________]  [⇅ Recent ▾]                │
├──────┬─────────────┬──────┬──────┬──────┬──────┬───────────┤
│Job ID│ Job Domain  │ Dept │Appl. │Posted│ CTC  │Description│Apply│
├──────┼─────────────┼──────┼──────┼──────┼──────┼───────────┼─────┤
│JOB-01│Frontend Dev │  IT  │  5   │13/04 │6-8 L │    👁️    │📝 Apply│
├──────┼─────────────┼──────┼──────┼──────┼──────┼───────────┼─────┤
│JOB-02│Sales Manager│Sales │  3   │15/04 │8-10L │    👁️    │📝 Apply│
├──────┼─────────────┼──────┼──────┼──────┼──────┼───────────┼─────┤
│JOB-03│HR Executive │  HR  │  2   │18/04 │4-6 L │    👁️    │📝 Apply│
└──────┴─────────────┴──────┴──────┴──────┴──────┴───────────┴─────┘
```

---

## 🚀 How to Use (Employee)

### Step 1: Navigate to Recruitment
1. Login with your employee credentials
2. Look at the sidebar menu
3. Click on **"👔 Recruitment"** menu item

### Step 2: Browse Open Positions
1. You'll see all open job positions
2. Use the search bar to find specific roles
3. Click department filters to narrow results

### Step 3: View Job Details
1. Click the **👁️ eye icon** in the "Description" column
2. Modal opens with full job details:
   - Job Title & ID
   - Department & Designation
   - Location, Work Mode, Job Type
   - Experience Required
   - CTC Range
   - Full Job Description
3. Click "Close" to return to job list

### Step 4: Apply for a Job
1. Click **"📝 Apply Now"** button for desired position
2. Confirmation popup appears:
   ```
   Apply for Frontend Developer?
   Your profile will be submitted to HR for review.
   [OK] [Cancel]
   ```
3. Click **OK** to confirm
4. Success message appears:
   ```
   ✅ Application submitted successfully!
   
   Our HR team will review your application for Frontend Developer
   and contact you soon.
   ```
5. Your application is now with HR!

---

## 🎨 Visual Comparison

### Admin/Manager Dashboard:
```
┌─────────────────────────────────────────────────────────────┐
│ 📊 STATS (4 cards)                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │   Open   │ │   New    │ │  Filled  │ │Interview │       │
│ │    5     │ │    11    │ │    4     │ │    1     │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search  [+ Post Job]                                     │
├─────────────────────────────────────────────────────────────┤
│ 📋 JOB TABLE (with HR Action, Status, Offer Letter)        │
├─────────────────────────────────────────────────────────────┤
│ 📊 PIPELINE FUNNEL     │  📈 HIRING ANALYTICS              │
└─────────────────────────────────────────────────────────────┘
```

### Employee Dashboard:
```
┌─────────────────────────────────────────────────────────────┐
│ (No stats section)                                          │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search  (No Post Job button)                             │
├─────────────────────────────────────────────────────────────┤
│ 📋 JOB TABLE (with Apply button, no admin columns)         │
├─────────────────────────────────────────────────────────────┤
│ (No pipeline or analytics sections)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Tips for Employees

1. **Check Regularly:** New jobs are posted frequently
2. **Read Full Description:** Click 👁️ to understand role requirements
3. **Apply Early:** First applicants often get priority
4. **One-Click Apply:** No need to fill long forms - your profile is used
5. **Track Applications:** HR will contact you directly via email/phone

---

## 🔔 Important Notes

### For Employees:
- ✅ You can apply to multiple positions
- ✅ Only "Open" jobs are visible to you
- ✅ Your profile info is automatically sent with application
- ⏳ HR will review and contact you for next steps
- ❌ You cannot post jobs or see hiring pipeline

### For Admin/Manager:
- ✅ All your existing features work unchanged
- ✅ You still see all jobs (Open, Closed, Interview, etc.)
- ✅ Post Job, HR Action, Pipeline - everything intact
- ℹ️ When employee applies, it's logged in the system
- ℹ️ You can track applications from your admin dashboard

---

## 🐛 Troubleshooting

### "I don't see Recruitment in sidebar"
- ✅ Make sure you're logged in
- ✅ Check your role is "employee"
- ✅ Refresh the page

### "No jobs showing"
- ℹ️ Currently no open positions available
- ℹ️ Check back later when HR posts new jobs
- ℹ️ Try clearing search/filters

### "Apply button not working"
- ✅ Check your internet connection
- ✅ Make sure you're logged in
- ✅ Try refreshing the page
- ❌ If issue persists, contact IT support

### "Error when applying"
- ⚠️ Backend API might not be set up yet
- ✅ Contact HR department directly
- ✅ Mention the job ID and title

---

## 📞 Support

**For Technical Issues:**
- Contact IT Department
- Email: it@omoikane.com

**For Application Status:**
- Contact HR Department  
- Email: hr@omoikane.com

**For Job Inquiries:**
- Contact Recruitment Team
- Check with your reporting manager

---

## ✅ Summary

| Action | Employee Access |
|--------|-----------------|
| View Open Jobs | ✅ Yes |
| Search/Filter Jobs | ✅ Yes |
| View Job Details | ✅ Yes |
| Apply to Jobs | ✅ Yes |
| Post Jobs | ❌ No |
| Edit Job Status | ❌ No |
| View Pipeline | ❌ No |
| View Analytics | ❌ No |

---

**Last Updated:** 2026-07-08  
**Version:** 1.0  
**Status:** ✅ Active
