# Profile Page Fix - Explanation & Implementation

## Current Problem

### Issue 1: Hardcoded Data
Your Profile.jsx page has hardcoded employee data instead of fetching from the backend based on the logged-in user.

**Current Code (Lines 496-518 in Profile.jsx):**
```javascript
const employee = {
  name: (() => {
    // Hardcoded logic checking specific emails
    if (user?.email === "Aishwarya@company.com") return "Aishwarya";
    if (user?.email === "mahesh@gmail.com") return "Mahesh";
    // ...
  })(),
  
  id: profileData?.employeeId ?? user?.employeeId ?? empId ?? "N/A",
  // ... more hardcoded data
}
```

### Issue 2: Missing Backend Endpoint
The frontend calls `fetchMyProfile()` which hits `/api/employee/me`, but this endpoint doesn't exist in the backend yet.

### Issue 3: Data Structure Mismatch
- **Employee Collection**: Contains `employeeId` like "ADMIN001", "GN-EMP-0019"
- **User Collection**: Contains proper user data with email, role, department, etc.
- Both need to be synchronized

## How It Should Work

### Backend Flow:
1. User logs in → JWT token is created with their email
2. Frontend calls `/api/employee/me` with JWT token
3. Backend extracts email from JWT token (using `Principal`)
4. Backend looks up employee data using this email
5. Returns employee data specific to that logged-in user

### Frontend Flow:
1. Profile page calls `fetchMyProfile()` on load
2. Receives employee data from backend
3. Displays the data dynamically (no hardcoded values)

## The Solution

###  Backend: Add `/me` Endpoint

Add this endpoint to `EmployeeController.java`:

```java
/* =========================================================
   GET CURRENT USER'S EMPLOYEE PROFILE
   ========================================================= */
@GetMapping("/me")
public ResponseEntity<?> getMyProfile(Principal principal) {
    try {
        if (principal == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = principal.getName(); // Get email from JWT
        System.out.println("🔍 Fetching profile for email: " + email);

        // First check Employee collection
        Employee employee = employeeRepository.findByEmail(email)
                .orElse(null);

        // If not found in Employee, check User collection
        if (employee == null) {
            User user = userRepository.findByEmail(email)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Profile not found"));
            }

            // Return User data as employee profile
            return ResponseEntity.ok(
                    Map.of(
                            "email", user.getEmail(),
                            "name", user.getName() != null ? user.getName() : "",
                            "fullName", user.getName() != null ? user.getName() : "",
                            "empName", user.getName() != null ? user.getName() : "",
                            "employeeId", user.getEmpId() != null ? user.getEmpId() : "N/A",
                            "department", user.getDepartment() != null ? user.getDepartment() : "",
                            "designation", user.getDesignation() != null ? user.getDesignation() : "",
                            "joiningDate", user.getJoiningDate() != null ? user.getJoiningDate() : "",
                            "location", user.getLocation() != null ? user.getLocation() : "",
                            "phone", user.getPhone() != null ? user.getPhone() : "",
                            "dob", user.getDob() != null ? user.getDob() : "",
                            "role", user.getRole() != null ? user.getRole() : "",
                            "managerName", user.getManagerName() != null ? user.getManagerName() : "",
                            "hrName", user.getHrName() != null ? user.getHrName() : "",
                            "pf", user.getPf() != null ? user.getPf() : "",
                            "uan", user.getUan() != null ? user.getUan() : "",
                            "esic", user.getEsic() != null ? user.getEsic() : "",
                            "totalExp", user.getTotalExp() != null ? user.getTotalExp() : "",
                            "currentExp", user.getCurrentExp() != null ? user.getCurrentExp() : "",
                            "employmentType", user.getEmploymentType() != null ? user.getEmploymentType() : "Full-Time"
                    )
            );
        }

        // Return Employee data if found
        return ResponseEntity.ok(employee);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to fetch profile: " + e.getMessage()));
    }
}
```

### Frontend: Remove Hardcoded Data

Update Profile.jsx to use backend data:

```javascript
// BEFORE (Hardcoded):
const employee = {
  name: (() => {
    if (user?.email === "Aishwarya@company.com") return "Aishwarya";
    if (user?.email === "mahesh@gmail.com") return "Mahesh";
    // ...
  })(),
  id: profileData?.employeeId ?? user?.employeeId ?? empId ?? "N/A",
  // ...
}

// AFTER (Dynamic from backend):
const employee = {
  name: profileData?.fullName || 
        profileData?.empName || 
        profileData?.name || 
        user?.name || 
        "N/A",
  
  id: profileData?.employeeId || 
      user?.employeeId || 
      empId || 
      "N/A",
  
  phone: profileData?.phone || "N/A",
  email: profileData?.email || user?.email || "N/A",
  dob: profileData?.dob || "",
  department: profileData?.department || "N/A",
  designation: profileData?.designation || "N/A",
  joiningDate: profileData?.joiningDate || "N/A",
  // ... all fields come from profileData
}
```

## Key Changes

1. **No more hardcoded if-else checks for specific emails**
2. **All data comes from `profileData` which is fetched from `/api/employee/me`**
3. **The backend automatically returns data for the logged-in user based on JWT token**
4. **Works for ANY user (Aishwarya, Nikita, or anyone else) without code changes**

## Benefits

✅ **Dynamic**: Works for any logged-in user automatically  
✅ **No Hardcoding**: No need to update code when adding new users  
✅ **Secure**: Uses JWT authentication to identify the user  
✅ **Maintainable**: Single source of truth from backend  
✅ **Scalable**: Same code works for all users

## Testing Steps

1. Login as Aishwarya (ADMIN) → Should see her data with employeeId from backend
2. Login as Nikita (Employee) → Should see her data with GN-EMP-0019
3. Login as any other user → Should see their respective data

No more manual updates needed!
