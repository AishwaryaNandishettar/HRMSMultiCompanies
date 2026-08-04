# Clear Filters Button Implementation Guide

This document provides the code to add "Clear Filters" button to all table pages, matching the Attendance page style.

## Pattern from Attendance Page

```jsx
{(fromDate || toDate || empSearch || Object.keys(filters).length > 0) && (
  <button
    onClick={() => {
      setFromDate("");
      setToDate("");
      setEmpSearch("");
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 1. HOME PAGE (Home.jsx)

**Location:** Add after the search/filter controls, before the table

**Code to Add:**
```jsx
{Object.keys(filters).length > 0 && (
  <button
    onClick={() => {
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 2. TIMESHEET PAGE (Timesheet.jsx)

**Location:** Add in the filter controls section (around line 500-550)

**Code to Add:**
```jsx
{Object.keys(filters).length > 0 && (
  <button
    onClick={() => {
      setFilters({});
      setFilterText("");
    }}
    style={{
      padding: "8px 16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 3. LEAVE MANAGEMENT PAGE (LeaveManagement.jsx)

**Location:** Add after date filters and search box

**Code to Add:**
```jsx
{(fromDate || toDate || searchQuery || Object.keys(filters).length > 0) && (
  <button
    onClick={() => {
      setFromDate("");
      setToDate("");
      setSearchQuery("");
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 4. INSURANCE CLAIM PAGE (InsuranceClaim.jsx)

**Location:** Add in the filter section before the table

**Code to Add:**
```jsx
{(searchTerm || statusFilter || Object.keys(filters).length > 0) && (
  <button
    onClick={() => {
      setSearchTerm("");
      setStatusFilter("ALL");
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 5. REIMBURSEMENT PAGE (Reimbursement.jsx)

**Location:** Add after search and filter controls

**Code to Add:**
```jsx
{(searchQuery || statusFilter || Object.keys(filters).length > 0) && (
  <button
    onClick={() => {
      setSearchQuery("");
      setStatusFilter("ALL");
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 6. PAYROLL PAGE (Payroll.jsx or PayrollSlip.jsx)

**Location:** Add in the filter controls section

**Code to Add:**
```jsx
{(searchTerm || monthFilter || Object.keys(filters).length > 0) && (
  <button
    onClick={() => {
      setSearchTerm("");
      setMonthFilter("");
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## 7. TASK MANAGEMENT PAGE (TaskManagement.jsx)

**Location:** Add after search and status filters

**Code to Add:**
```jsx
{(searchQuery || statusFilter || priorityFilter || Object.keys(filters).length > 0) && (
  <button
    onClick={() => {
      setSearchQuery("");
      setStatusFilter("ALL");
      setPriorityFilter("ALL");
      setFilters({});
    }}
    style={{
      padding: "6px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      cursor: "pointer",
      background: "#f5f5f5",
      marginLeft: "10px",
    }}
  >
    Clear Filters
  </button>
)}
```

---

## General Pattern

### Button Styling (Consistent across all pages):
```jsx
style={{
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  cursor: "pointer",
  background: "#f5f5f5",
  marginLeft: "10px",
}}
```

### Conditional Rendering:
- Show button only when filters are active
- Check all filter states (dates, search, dropdowns, column filters)

### onClick Handler:
- Reset ALL filter-related states to their initial values
- Empty strings for text inputs
- Empty objects for filter objects
- Default values for dropdowns (usually "ALL" or "")

---

## Implementation Steps

1. **Identify filter states** in each page
2. **Find the filter controls section** (usually above the table)
3. **Add the Clear Filters button** after existing controls
4. **Update the condition** to check all relevant filter states
5. **Update the onClick** to reset all filter states
6. **Test** by applying filters and clicking Clear Filters

---

## Notes

- The button appears only when at least one filter is active
- All filter states must be reset in the onClick handler
- Styling is consistent across all pages for uniformity
- The button is positioned with `marginLeft: "10px"` for spacing
- No existing logic is changed, only the clear button is added

---

## Example: Complete Implementation for Home Page

```jsx
// In Home.jsx, find the filter section (around line 200-250)

<div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
  {/* Existing search/filter controls */}
  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  
  {/* ADD THIS: Clear Filters Button */}
  {(searchTerm || Object.keys(filters).length > 0) && (
    <button
      onClick={() => {
        setSearchTerm("");
        setFilters({});
      }}
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer",
        background: "#f5f5f5",
      }}
    >
      Clear Filters
    </button>
  )}
</div>
```

---

## Variable Names to Look For

Each page may use different variable names for filters:
- `filters` or `columnFilters` - Column-specific filters
- `searchTerm`, `searchQuery`, `empSearch` - Search inputs
- `fromDate`, `toDate` - Date range filters
- `statusFilter`, `priorityFilter` - Dropdown filters
- `filterText` - General text filter

Make sure to reset ALL of them in the onClick handler!

---

End of Implementation Guide
