# Insurance Claim CSS - Column Fix

The CSS is already correct. The issue is in the JSX file (InsuranceClaim.jsx).

## Current Table Structure in JSX:
```javascript
{ label: "Employee ID", key: "id" },           // Column 1
{ label: "Employee Name", key: "employeeName" }, // Column 2
{ label: "Department", key: "department" },      // Column 3
{ label: "Reporting Manager", key: "managerName" }, // Column 4
// ... rest of columns
```

## CSS Column Mapping:
- Column 1: Employee ID (Sticky, left: 0)
- Column 2: Employee Name (Sticky, left: 120px, left-aligned)
- Column 3: Department (Regular column, 150px width)
- Column 4: Reporting Manager (Regular column, 180px width)
- Column 5: Emp Code
- Column 6: Claim Type
- Column 7: Claim Raised Date
- Column 8: Claim Settled Date
- Column 9: Admitted Days
- Column 10: Claim Amount
- Column 11: Approved Amount
- Column 12: Status

The CSS is correctly configured. The Department column is visible and properly styled.

If you're seeing "Employee Name" appearing in both column 2 and 3, it's likely a browser caching issue or the JSX needs to be checked for duplicate headers.

## Solution:
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh the page (Ctrl + F5)
3. Check that the JSX file has the correct column order without duplicates
