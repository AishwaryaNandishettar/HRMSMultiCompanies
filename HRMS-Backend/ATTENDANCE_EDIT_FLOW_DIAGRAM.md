# 🎯 Manager Attendance Edit - Visual Flow Diagram

## 📊 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ATTENDANCE PAGE                              │
│                       (Attendance.jsx)                               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  TABLE: Shows all attendance records                                 │
│  ┌────────┬──────────┬────────┬──────────┬────────┬──────────┐     │
│  │ EMP ID │ NAME     │ STATUS │ CHECK-IN │ CHECK  │ ACTIONS  │     │
│  │        │          │        │          │ OUT    │          │     │
│  ├────────┼──────────┼────────┼──────────┼────────┼──────────┤     │
│  │ EMP001 │ John Doe │ Absent │    -     │   -    │ [Edit]   │     │ ← Manager sees Edit button
│  │        │          │ (Red)  │          │        │          │     │
│  └────────┴──────────┴────────┴──────────┴────────┴──────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    Manager clicks "Edit" button
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EDIT MODAL OPENS                                  │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  Edit Attendance - John Doe                               │     │
│  │  ─────────────────────────────────────────────────────    │     │
│  │  Employee ID: EMP001                                      │     │
│  │  Date: 2026-07-08                                         │     │
│  │  Current Status: Absent                                   │     │
│  │                                                            │     │
│  │  Status: [Present ▼]                                      │     │
│  │                                                            │     │
│  │  Check-In Time: [09:00] 🕒                                │     │
│  │                                                            │     │
│  │  Check-Out Time: [18:00] 🕒                               │     │
│  │                                                            │     │
│  │           [Cancel]  [Save Changes]                        │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    Manager clicks "Save Changes"
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Attendance.jsx)                       │
│                                                                      │
│  handleSaveEdit() {                                                 │
│    const payload = {                                                │
│      userId: "60d5ec49...",                                         │
│      date: "2026-07-08",                                            │
│      status: "Present",                                             │
│      checkIn: "09:00:00",                                           │
│      checkOut: "18:00:00",                                          │
│      managerEmail: "manager@company.com"                            │
│    }                                                                │
│    await managerEditAttendance(payload);                            │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                            HTTP PUT Request
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API LAYER (attendanceApi.js)                      │
│                                                                      │
│  export const managerEditAttendance = async (record) => {           │
│    return api.put("/api/attendance/manager-edit", record)           │
│      .then(res => res.data);                                        │
│  };                                                                 │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                   PUT /api/attendance/manager-edit
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND CONTROLLER (AttendanceController.java)          │
│                                                                      │
│  @PutMapping("/manager-edit")                                       │
│  public String managerEditAttendance(@RequestBody payload) {        │
│    String userId = payload.get("userId");                           │
│    String date = payload.get("date");                               │
│    String status = payload.get("status");                           │
│    String checkIn = payload.get("checkIn");                         │
│    String checkOut = payload.get("checkOut");                       │
│    String managerEmail = payload.get("managerEmail");               │
│                                                                      │
│    return attendanceService.managerEditAttendance(...);             │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                            Method Call
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               BACKEND SERVICE (AttendanceService.java)               │
│                                                                      │
│  Step 1: AUTHORIZATION CHECK                                        │
│  ┌─────────────────────────────────────────────┐                   │
│  │ User employee = userRepo.findById(userId);  │                   │
│  │                                              │                   │
│  │ if (employee.managerEmail != managerEmail) {│                   │
│  │   return "Unauthorized";                    │ ← Security Check  │
│  │ }                                            │                   │
│  └─────────────────────────────────────────────┘                   │
│                         │                                            │
│                 ✅ Authorized                                        │
│                         │                                            │
│                         ▼                                            │
│  Step 2: FIND OR CREATE ATTENDANCE RECORD                           │
│  ┌─────────────────────────────────────────────┐                   │
│  │ Attendance att = attendanceRepo             │                   │
│  │   .findByUserIdAndDate(userId, date);       │                   │
│  │                                              │                   │
│  │ if (att == null) {                          │                   │
│  │   att = new Attendance();                   │                   │
│  │   // Set employee details                   │                   │
│  │ }                                            │                   │
│  └─────────────────────────────────────────────┘                   │
│                         │                                            │
│                         ▼                                            │
│  Step 3: UPDATE FIELDS                                              │
│  ┌─────────────────────────────────────────────┐                   │
│  │ att.setStatus("Present");                   │                   │
│  │ att.setCheckIn("09:00:00");                 │                   │
│  │ att.setCheckOut("18:00:00");                │                   │
│  │ att.setLocationIn("Manager Edited");        │                   │
│  │ att.setLocationOut("Manager Edited");       │                   │
│  └─────────────────────────────────────────────┘                   │
│                         │                                            │
│                         ▼                                            │
│  Step 4: CALCULATE WORKED MINUTES                                   │
│  ┌─────────────────────────────────────────────┐                   │
│  │ LocalTime in = parse("09:00:00");           │                   │
│  │ LocalTime out = parse("18:00:00");          │                   │
│  │                                              │                   │
│  │ int minutes = Duration.between(in, out)     │                   │
│  │   .toMinutes();  // 540 minutes (9 hours)   │                   │
│  │                                              │                   │
│  │ att.setWorkedMinutes(540);                  │                   │
│  └─────────────────────────────────────────────┘                   │
│                         │                                            │
│                         ▼                                            │
│  Step 5: AUTO-DETERMINE STATUS (if needed)                          │
│  ┌─────────────────────────────────────────────┐                   │
│  │ if (minutes >= 480) {  // 8 hours           │                   │
│  │   status = "Present";                       │                   │
│  │ } else if (minutes >= 240) {  // 4 hours    │                   │
│  │   status = "Half Day";                      │                   │
│  │ }                                            │                   │
│  └─────────────────────────────────────────────┘                   │
│                         │                                            │
│                         ▼                                            │
│  Step 6: SAVE TO DATABASE                                           │
│  ┌─────────────────────────────────────────────┐                   │
│  │ attendanceRepo.save(att);                   │                   │
│  │                                              │                   │
│  │ return "Attendance updated successfully";   │                   │
│  └─────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                            MongoDB Query
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                                │
│                                                                      │
│  attendance Collection:                                             │
│  ┌────────────────────────────────────────────────────────┐        │
│  │ {                                                       │        │
│  │   _id: ObjectId("..."),                                │        │
│  │   userId: "60d5ec49f1b2c8b1f8e4e1a1",                 │        │
│  │   empId: "EMP001",                                     │        │
│  │   name: "John Doe",                                    │        │
│  │   date: "2026-07-08",                                  │        │
│  │   checkIn: "09:00:00",      ← Updated                 │        │
│  │   checkOut: "18:00:00",     ← Updated                 │        │
│  │   workedMinutes: 540,       ← Calculated              │        │
│  │   status: "Present",        ← Updated from "Absent"   │        │
│  │   attendanceType: "Office",                            │        │
│  │   locationIn: "Manager Edited",  ← Set by system     │        │
│  │   locationOut: "Manager Edited", ← Set by system     │        │
│  │   late: "No",                                          │        │
│  │   managerEmail: "manager@company.com"                 │        │
│  │ }                                                       │        │
│  └────────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                          Save Successful
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        RESPONSE FLOW BACK                            │
│                                                                      │
│  Backend → Frontend:                                                │
│  HTTP 200 OK                                                        │
│  "Attendance updated successfully by manager"                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND UPDATES UI                               │
│                                                                      │
│  1. Close modal: setEditModalVisible(false)                         │
│  2. Show alert: "Attendance updated successfully!"                  │
│  3. Refresh table: await fetchRecords()                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  UPDATED TABLE: Record now shows Present                            │
│  ┌────────┬──────────┬─────────┬──────────┬─────────┬──────────┐  │
│  │ EMP ID │ NAME     │ STATUS  │ CHECK-IN │ CHECK   │ ACTIONS  │  │
│  │        │          │         │          │ OUT     │          │  │
│  ├────────┼──────────┼─────────┼──────────┼─────────┼──────────┤  │
│  │ EMP001 │ John Doe │ Present │ 09:00:00 │18:00:00 │ [Edit]   │  │
│  │        │          │ (Green) │          │         │          │  │ ← Status changed!
│  └────────┴──────────┴─────────┴──────────┴─────────┴──────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authorization Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                   AUTHORIZATION CHECK                       │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Request arrives with:                │
        │  • userId (employee to edit)          │
        │  • managerEmail (who is editing)      │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Find Employee in Database            │
        │  employee = userRepo.findById(userId) │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  Check Manager Relationship           │
        │  employee.managerEmail == ?           │
        └──────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
     ┌────────────────┐       ┌────────────────┐
     │  MATCH ✅      │       │  NO MATCH ❌   │
     │                │       │                │
     │ manager@co.com │       │ wrong@co.com   │
     │       ==       │       │       !=       │
     │ manager@co.com │       │ manager@co.com │
     └────────────────┘       └────────────────┘
              │                         │
              ▼                         ▼
     ┌────────────────┐       ┌────────────────┐
     │  AUTHORIZED ✅ │       │ UNAUTHORIZED❌ │
     │                │       │                │
     │ Proceed with   │       │ Return error:  │
     │ attendance edit│       │ "Unauthorized" │
     └────────────────┘       └────────────────┘
```

---

## 🕒 Time Calculation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              TIME & STATUS CALCULATION                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Input:                             │
        │  checkIn = "09:00:00"              │
        │  checkOut = "18:00:00"             │
        └────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Parse to LocalTime objects         │
        │  in = LocalTime.parse("09:00:00")   │
        │  out = LocalTime.parse("18:00:00")  │
        └────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Calculate Duration                 │
        │  duration = between(in, out)        │
        │            = 9 hours                │
        └────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Convert to Minutes                 │
        │  minutes = duration.toMinutes()     │
        │          = 540 minutes              │
        └────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Determine Status Based on Hours    │
        │                                     │
        │  if (minutes >= 480) {  // 8 hrs   │
        │    status = "Present"               │
        │  }                                  │
        │  else if (minutes >= 240) { // 4hr │
        │    status = "Half Day"              │
        │  }                                  │
        │  else {                             │
        │    status = "Half Day"              │
        │  }                                  │
        └────────────────────────────────────┘
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Result:                            │
        │  • workedMinutes = 540              │
        │  • status = "Present"               │
        │  • late = "No" (started at 9 AM)    │
        └────────────────────────────────────┘
```

---

## 📊 Status Determination Logic

```
                  CHECK-IN & CHECK-OUT TIMES
                            │
                            ▼
        ┌────────────────────────────────────┐
        │  Calculate Total Hours Worked       │
        └────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  ≥ 8 Hours   │   │  4-8 Hours   │   │  < 4 Hours   │
│  (480 min)   │   │  (240-479)   │   │  (< 240)     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  "Present"   │   │  "Half Day"  │   │  "Half Day"  │
│  (Green)     │   │  (Yellow)    │   │  (Yellow)    │
└──────────────┘   └──────────────┘   └──────────────┘

Examples:
  09:00 - 18:00  →  9 hours  →  Present ✅
  09:00 - 17:00  →  8 hours  →  Present ✅
  09:00 - 13:00  →  4 hours  →  Half Day ⚠️
  14:00 - 18:00  →  4 hours  →  Half Day ⚠️
  09:00 - 11:00  →  2 hours  →  Half Day ⚠️
```

---

## 🔄 State Management Flow (Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│                   REACT STATE FLOW                           │
└─────────────────────────────────────────────────────────────┘

Initial State:
┌────────────────────────────────────┐
│ editModalVisible = false           │
│ editingRecord = null               │
│ editForm = { status: "",           │
│              checkIn: "",           │
│              checkOut: "" }         │
└────────────────────────────────────┘
                │
                ▼ [User clicks "Edit" button]
                │
After handleEditAttendance():
┌────────────────────────────────────┐
│ editModalVisible = true            │
│ editingRecord = {                  │
│   userId: "...",                   │
│   empId: "EMP001",                 │
│   name: "John Doe",                │
│   status: "Absent"                 │
│ }                                  │
│ editForm = {                       │
│   status: "Present",               │
│   checkIn: "09:00:00",             │
│   checkOut: "18:00:00"             │
│ }                                  │
└────────────────────────────────────┘
                │
                ▼ [User modifies fields]
                │
User Changes Time:
┌────────────────────────────────────┐
│ editForm.checkIn = "10:00:00"      │
│ (updated via setEditForm)          │
└────────────────────────────────────┘
                │
                ▼ [User clicks "Save"]
                │
After handleSaveEdit():
┌────────────────────────────────────┐
│ API call made                      │
│ → managerEditAttendance(payload)   │
│                                    │
│ On Success:                        │
│ • editModalVisible = false         │
│ • editingRecord = null             │
│ • fetchRecords() called            │
│ • Alert shown to user              │
└────────────────────────────────────┘
```

---

## 🎭 User Role Permissions Matrix

```
┌───────────────────────────────────────────────────────────┐
│              FEATURE ACCESS BY ROLE                        │
└───────────────────────────────────────────────────────────┘

Feature: View Attendance Table
  Employee:   ✅ (Own records only)
  Manager:    ✅ (Own + Team records)
  Admin:      ✅ (All records)

Feature: See "Edit" Button
  Employee:   ❌ No access
  Manager:    ✅ Yes (for team members)
  Admin:      ❌ No access (can be added)

Feature: Edit Attendance
  Employee:   ❌ Cannot edit
  Manager:    ✅ Can edit direct reports only
  Admin:      ❌ Cannot edit (can be added)

Feature: Export Attendance
  Employee:   ❌ No export
  Manager:    ✅ Team export only
  Admin:      ✅ Full export

Authorization Matrix:
┌──────────┬───────────┬───────────┬───────────┐
│ Role     │ View      │ Edit      │ Export    │
├──────────┼───────────┼───────────┼───────────┤
│ Employee │ Self      │ None      │ None      │
│ Manager  │ Team      │ Team      │ Team      │
│ Admin    │ All       │ None*     │ All       │
└──────────┴───────────┴───────────┴───────────┘
* Admin edit can be added in future
```

---

## 🚨 Error Scenarios

```
┌───────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                          │
└───────────────────────────────────────────────────────────┘

Scenario 1: Unauthorized Manager
  ┌────────────────────────────────┐
  │ Manager B tries to edit        │
  │ Employee under Manager A       │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ Backend checks:                │
  │ employee.managerEmail !=       │
  │ request.managerEmail           │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ Return: "Unauthorized: You are │
  │ not the reporting manager"     │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ Frontend shows alert           │
  │ Modal stays open               │
  └────────────────────────────────┘

Scenario 2: Invalid Time Format
  ┌────────────────────────────────┐
  │ User enters: "25:00:00"        │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ HTML5 time picker prevents     │
  │ invalid input (browser-level)  │
  └────────────────────────────────┘

Scenario 3: Network Error
  ┌────────────────────────────────┐
  │ Backend server down            │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ Axios catches error            │
  │ err.response = undefined       │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ Frontend shows:                │
  │ "Failed to update attendance:  │
  │  Network Error"                │
  └────────────────────────────────┘

Scenario 4: Missing Required Fields
  ┌────────────────────────────────┐
  │ Request missing userId         │
  └────────────────────────────────┘
                │
                ▼
  ┌────────────────────────────────┐
  │ Backend validation:            │
  │ if (userId == null) {          │
  │   return "Missing required...";│
  │ }                              │
  └────────────────────────────────┘
```

---

**Diagram Version**: 1.0  
**Last Updated**: July 8, 2026  
**Status**: ✅ Complete
