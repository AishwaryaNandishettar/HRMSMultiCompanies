import { useEffect, useState, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Attendance.module.css";
import { AttendanceContext } from "../Context/AttendanceContext";
import {
  getMyAttendance,
  getManagerAttendance,
  getAllAttendance,
  checkIn as apiCheckIn,
  checkOut as apiCheckOut,
  managerEditAttendance,
} from "../api/attendanceApi";

import { getAllEmployees } from "../api/employeeApi";
/* ================= FORMAT TIME TO HH:MM:SS (display only) ================= */
const formatTime = (timeStr) => {
  if (!timeStr || timeStr === "-") return timeStr;
  // Extract only HH:MM:SS from strings like "10:57:04.125480300" or "10:57:04 AM"
  const match = String(timeStr).match(/^(\d{1,2}:\d{2}:\d{2})/);
  return match ? match[1] : timeStr;
};

/* ================= GET LOGGED USER (supports both storage keys) ================= */
const getLoggedUser = () => {
  try {
    const u =
      JSON.parse(localStorage.getItem("loggedUser")) ||
      JSON.parse(localStorage.getItem("user")) ||
      
      {};
      console.log(JSON.parse(localStorage.getItem("loggedUser")));
console.log(JSON.parse(localStorage.getItem("user")));
    return {
      ...u,
      role: (u.role || "").toLowerCase(),
    };
  } catch {
    return {};
  }
};

export default function Attendance() {
  const location = useLocation();

  const focus = location.state?.focus;
  const filterEmployee = location.state?.filterEmployee; // ✅ Employee ID from notification
  const employeeName = location.state?.employeeName;     // ✅ Employee name from notification

  // Debug: Log the focus state
  console.log("🎯 Navigation focus state:", focus);

  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(today);

  const { refresh } = useContext(AttendanceContext);

  const [activeFilter, setActiveFilter] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [filters, setFilters] = useState({});
  const [tempSelected, setTempSelected] = useState([]);
  const popupRef = useRef();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [attendanceFilter, setAttendanceFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Automatically set empSearch if employee filter is passed from notification
  const [empSearch, setEmpSearch] = useState(filterEmployee || "");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef();

  // State for manager edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "",
    checkIn: "",
    checkOut: "",
  });

  const loggedUser = getLoggedUser();
  const role = loggedUser?.role?.toLowerCase();

  /* ================= FETCH RECORDS ================= */
  const fetchRecords = async () => {
    setLoading(true); // Start loading
    
    try {
      console.log("🔄 Fetching attendance records...", { role, user: loggedUser.email });
      
      let response;

      if (role === "employee") {
        // Use userId (MongoDB _id) as the primary key for attendance lookup
        const userId =
          loggedUser.id ||
          loggedUser._id ||
          loggedUser.employeeId ||
          loggedUser.empId;
        console.log("👤 Employee fetching for userId:", userId);
        response = await getMyAttendance(userId);
      } else if (role === "manager") {
        // Manager sees their own + their team's attendance
        const managerEmail = loggedUser.email;
        console.log("👥 Manager fetching for email:", managerEmail);
        response = await getManagerAttendance(managerEmail);
      } else {
        // Admin sees all
        console.log("👑 Admin fetching all records");
        response = await getAllAttendance();
      }

      const rawData = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.content)
        ? response.content
        : [];

      console.log("📊 Raw attendance data received:", rawData.length, "records");

      // Map backend DTO fields to frontend display fields
      const data = rawData
        .map((r) => ({
          userId: r.userId || "-",
          empId:
            r.role === "admin" ||
            r.empId === "ADMIN001" ||
            r.employeeId === "ADMIN001"
              ? "ADMIN001"
              : r.empId ||
                r.employeeId ||
                "-",

          name:
            r.role === "admin" ||
            r.empId === "ADMIN001" ||
            r.employeeId === "ADMIN001" ||
            (loggedUser.role === "admin" && (r.userId === loggedUser.id || r.userId === loggedUser._id))
              ? "Aishwarya"
              : r.employeeName ||
                r.name ||
                r.fullName ||
                "-",
          department: r.department || r.dept || "-",
          managerId: r.managerId || "-",
          managerEmail: r.managerEmail || r.managerId || "-",
          reportingManager:
            r.reportingManager || r.managerName || r.managerEmail || "-",
        
          date: r.date || "-",
          checkIn: r.checkIn || "-",
          checkOut: r.checkOut || "-",
          locationIn: r.locationIn || "-",
          locationOut: r.locationOut || "-",
          late: r.late || "No",
          earlyLeave: r.earlyLeave || "-",
          status: r.status || "Pending Approval",
          attendanceType: r.attendanceType || r.type || "Office",
        }));
// Fetch all employees
let employees = await getAllEmployees();
console.log(employees);
// Create employee -> manager mapping
const employeeMap = {};

employees.forEach((emp) => {
  employeeMap[String(emp.id || emp._id).trim()] = emp;
});

if (role === "employee") {
  employees = employees.filter(
    (emp) =>
      String(emp.id || emp._id).trim() ===
      String(
        loggedUser.id ||
        loggedUser._id
      ).trim()
  );
}
if (role === "manager") {
  employees = employees.filter(
    (emp) =>
      String(emp.managerEmail || "")
        .trim()
        .toLowerCase() ===
      String(loggedUser.email || "")
        .trim()
        .toLowerCase()
  );
}

const attendanceDates = new Set(
  data.map(
    (r) =>
      `${String(r.userId).trim().toLowerCase()}_${r.date}`
  )
);

const absentRecords = [];

employees.forEach((emp) => {
  const day = new Date(selectedDate).getDay();

  // Skip weekends
  if (day === 0 || day === 6) return;

 const employeeUserId = emp.id || emp._id;

const key = `${employeeUserId}_${selectedDate}`;

  if (!attendanceDates.has(key)) {
    absentRecords.push({
     userId: employeeUserId,
      empId: emp.employeeId || "-",
      name: emp.fullName || "-",
      department: emp.department || "-",

         managerEmail:
      emp.managerEmail ||
      emp.reportingManager ||
      emp.manager ||
      "",

      reportingManager:
  emp.reportingManager ||
  emp.managerName ||
  emp.managerEmail ||
  "-",
      date: selectedDate,

      checkIn: "-",
      checkOut: "-",
      locationIn: "-",
      locationOut: "-",

      late: "-",
      earlyLeave: "-",

      status: "Absent",
      attendanceType: "-",
    });
  }
});
    const finalData = [
  ...data,
  ...absentRecords.filter(
    (absent) =>
      !data.some(
        (att) =>
          String(att.userId).trim().toLowerCase() ===
            String(absent.userId).trim().toLowerCase() &&
          att.date === absent.date
      )
  ),
];

console.log(
  "✅ Processed attendance data:",
  finalData.length,
  "records"
);
console.log("👻 Absent records added:", absentRecords.length);
console.log("👻 Absent records:", absentRecords.map(a => ({ name: a.name, status: a.status, date: a.date })));

let scopedData = finalData;

if (role === "employee") {
  const myUserId = String(
    loggedUser.id || loggedUser._id
  ).trim().toLowerCase();

  scopedData = finalData.filter(
    (r) =>
      String(r.userId)
        .trim()
        .toLowerCase() === myUserId
  );
}
if (role === "manager") {
  scopedData = finalData.filter((r) => {
    const isManagerEmployee =
      String(r.managerEmail || "")
        .trim()
        .toLowerCase() ===
      String(loggedUser.email || "")
        .trim()
        .toLowerCase();

    const isSelf =
      String(r.userId)
        .trim()
        .toLowerCase() ===
      String(loggedUser.id || loggedUser._id)
        .trim()
        .toLowerCase();

    return isManagerEmployee || isSelf;
  });
}

setRecords(scopedData);
      
      
      // Log sample record for debugging
      if (data.length > 0) {
        console.log("📄 Sample record:", data[0]);
      }
      
    } catch (err) {
      console.error("❌ Attendance fetch failed:", err);
      setRecords([]); // Set empty array on error
    } finally {
      setLoading(false); // End loading
    }
  };

  /* ================= CLICK OUTSIDE HANDLERS ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActiveFilter(null);
      }
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    console.log("🚀 Attendance component mounted, fetching records immediately...");
    fetchRecords();
}, [selectedDate]);

  // Live auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing attendance records...");
      fetchRecords();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  
  /* ================= CHECK IN ================= */
 const handleCheckIn = async () => {

  const day = new Date(selectedDate).getDay(); // 0=Sunday, 6=Saturday
  if (day === 0 || day === 6) {
    alert("Today is Weekly Off. Check-In is not allowed.");
    return;
  }

  const userId =
    loggedUser.id || loggedUser._id || loggedUser.employeeId || loggedUser.empId;
    // Check if already checked in for selected date
    const existingRecord = records.find(
      (r) =>
        r.date === selectedDate &&
        String(r.userId).trim().toLowerCase() ===
          String(userId).trim().toLowerCase()
    );

    if (existingRecord) {
      alert("Already checked in for selected date");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const time = new Date().toLocaleTimeString("en-GB", {
  hour12: false,
});
        const hour = new Date().getHours();

        try {
          // Get latest employee details
const employees = await getAllEmployees();

const latestEmployee = employees.find(
  (emp) =>
    String(emp.email).toLowerCase() ===
    String(loggedUser.email).toLowerCase()
);

const latestManagerEmail =
  latestEmployee?.managerEmail || loggedUser.managerEmail || "";

const latestManagerName =
  latestEmployee?.manager || loggedUser.managerName || "";
          await apiCheckIn({
            userId: String(userId).trim(),
          empId:
  role === "admin"
    ? "ADMIN001"
    : loggedUser.empId ||
      loggedUser.employeeId ||
      loggedUser.employeeCode ||
      "-",

name:
  role === "admin"
    ? "Aishwarya"
    : loggedUser.employeeName ||
      loggedUser.name ||
      loggedUser.fullName ||
      "Employee",
            department: loggedUser.department || "General",
            date: selectedDate,
            checkIn: time,
            locationIn: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
reportingManager:
  latestManagerName || latestManagerEmail || "-",
            managerId: loggedUser.managerId || "-",
           managerEmail:
  latestManagerEmail,
           
            attendanceType: "Office",
            status: "Pending Approval",
            late: hour > 9 ? "Yes" : "No",
          });

          alert("Check-in successful");
          
          // Immediate refresh after check-in
          console.log("✅ Check-in successful, refreshing records...");
          await fetchRecords();

          if (refresh) refresh();
        } catch (err) {
          console.error("Check-in failed", err);
          alert("Check-in failed");
        }
      },
      () => {
        alert("Location access denied. Please allow location to check in.");
      }
    );
  };

  /* ================= CHECK OUT ================= */
  const handleCheckOut = async () => {
    const userId =
      loggedUser.id || loggedUser._id || loggedUser.employeeId || loggedUser.empId;

    const recordToUpdate = records.find(
      (r) =>
        r.date === selectedDate &&
        String(r.userId).trim().toLowerCase() ===
          String(userId).trim().toLowerCase()
    );

    if (!recordToUpdate) {
      alert("Check-in first before checking out");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
       const time = new Date().toLocaleTimeString("en-GB", {
  hour12: false,
});

        try {
          await apiCheckOut({
            userId: String(userId).trim(),
            name:
  loggedUser.employeeName ||
  loggedUser.name ||
  loggedUser.fullName ||
  "Admin",
            date: recordToUpdate.date,
            checkOut: time,
            locationOut: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
            managerId: loggedUser.managerId || "-",
            managerEmail: loggedUser.managerEmail || loggedUser.email || "-",
          });

          alert("Check-out successful");
          
          // Immediate refresh after check-out
          console.log("✅ Check-out successful, refreshing records...");
          await fetchRecords();
          
          if (refresh) refresh();
        } catch (err) {
          console.error("Check-out failed", err);
          alert("Check-out failed");
        }
      },
      () => {
        alert("Location access denied. Please allow location to check out.");
      }
    );
  };

  /* ================= WORK FROM HOME ================= */
 const handleWorkFromHome = async () => {

  const day = new Date(selectedDate).getDay(); // 0=Sunday, 6=Saturday
  if (day === 0 || day === 6) {
    alert("Today is Weekly Off. Attendance marking is not allowed.");
    return;
  }

  const userId =
      loggedUser.id || loggedUser._id || loggedUser.employeeId || loggedUser.empId;

    const existingRecord = records.find(
      (r) =>
        r.date === selectedDate &&
        String(r.userId).trim().toLowerCase() ===
          String(userId).trim().toLowerCase()
    );

    if (existingRecord) {
      alert("Already marked attendance for selected date");
      return;
    }

  const time = new Date().toLocaleTimeString("en-GB", {
  hour12: false,
});
    const hour = new Date().getHours();

    try {
      await apiCheckIn({
        userId: String(userId).trim(),
empId:
  role === "admin"
    ? "ADMIN001"
    : loggedUser.empId ||
      loggedUser.employeeId ||
      loggedUser.employeeCode ||
      "-",

name:
  role === "admin"
    ? "Aishwarya"
    : loggedUser.employeeName ||
      loggedUser.name ||
      loggedUser.fullName ||
      "Employee",
        department: loggedUser.department || "General",
        date: selectedDate,
        checkIn: time,
        locationIn: "WFH",
        reportingManager:
          loggedUser.managerName || loggedUser.managerEmail || "-",
        managerId: loggedUser.managerId || "-",
        managerEmail: loggedUser.managerEmail || loggedUser.email || "-",
       
        attendanceType: "Work From Home",
        status: "Pending Approval",
        late: hour > 9 ? "Yes" : "No",
      });

      alert("Work From Home marked successfully");
      setTimeout(async () => {
        await fetchRecords();
      }, 500);

      if (refresh) refresh();
    } catch (err) {
      console.error("WFH mark failed", err);
      alert("Work From Home marking failed");
    }
  };

  /* ================= MANAGER EDIT ATTENDANCE ================= */
  const handleEditAttendance = (record) => {
    setEditingRecord(record);
    setEditForm({
      status: record.status === "Absent" ? "Present" : record.status,
      checkIn: record.checkIn && record.checkIn !== "-" ? record.checkIn : "09:00:00",
      checkOut: record.checkOut && record.checkOut !== "-" ? record.checkOut : "18:00:00",
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    try {
      const payload = {
        userId: editingRecord.userId,
        date: editingRecord.date,
        status: editForm.status,
        checkIn: editForm.checkIn,
        checkOut: editForm.checkOut,
        managerEmail: loggedUser.email,
      };

      const response = await managerEditAttendance(payload);
      
      alert(response || "Attendance updated successfully!");
      
      // Close modal
      setEditModalVisible(false);
      setEditingRecord(null);
      
      // Refresh attendance records
      await fetchRecords();
      
    } catch (err) {
      console.error("Failed to update attendance:", err);
      alert("Failed to update attendance: " + (err.response?.data || err.message));
    }
  };

  /* ================= CALCULATE HOURS ================= */
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || checkIn === "-") return "-";

    const parseTime = (timeStr) => {
      const now = new Date();
      return new Date(`${now.toDateString()} ${timeStr}`);
    };

    const start = parseTime(checkIn);
    const end =
      checkOut && checkOut !== "-" ? parseTime(checkOut) : new Date();

    const diff = end - start;
    if (diff < 0) return "-";

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  /* ================= FILTER & SEARCH ================= */
  const searchFiltered =
    (role === "admin" || role === "manager") && empSearch.trim()
      ? records.filter(
          (r) =>
            String(r.name).toLowerCase().includes(empSearch.toLowerCase()) ||
            String(r.empId).toLowerCase().includes(empSearch.toLowerCase())
        )
      : records;

  const getUnique = (key) => [
  ...new Set(searchFiltered.map((r) => r[key])),
];

  const filteredRecordsFinal = searchFiltered
  .filter((r) => {

    // Priority filter: focus from navigation state
    if (focus === "present") {
      return r.checkIn && r.checkIn !== "-";
    }

    if (focus === "absent") {
      // Debug: Log record status
      console.log(`📋 Record: ${r.name} | Status: ${r.status} | CheckIn: ${r.checkIn} | Date: ${r.date}`);
      // Filter records where status is "Absent" (employees who didn't check in)
      return r.status === "Absent";
    }

    // Date range filter
    if (fromDate || toDate) {
      const recordDate = new Date(r.date);
      if (fromDate && recordDate < new Date(fromDate)) return false;
      if (toDate   && recordDate > new Date(toDate))   return false;
    }

    // Existing attendance filters
    if (attendanceFilter === "forgotCheckout") {
      return !r.checkOut || r.checkOut === "-";
    }

    if (attendanceFilter === "missedCheckin") {
      return !r.checkIn || r.checkIn === "-";
    }

    // Header filters
    for (const key in filters) {
      if (
        filters[key] &&
        filters[key].length > 0 &&
        !filters[key].includes(r[key])
      ) {
        return false;
      }
    }

    return true;
  })
  .sort((a, b) => {
    const dateCompare = new Date(b.date) - new Date(a.date);
    if (dateCompare !== 0) return dateCompare;

    const timeA =
      a.checkIn && a.checkIn !== "-" ? a.checkIn : "00:00:00";
    const timeB =
      b.checkIn && b.checkIn !== "-" ? b.checkIn : "00:00:00";

    return timeB.localeCompare(timeA);
  });

  // Debug: Log filtered results
  if (focus) {
    console.log(`✅ Filtered records for focus="${focus}":`, filteredRecordsFinal.length);
  }

  const suggestions =
    activeFilter &&
    getUnique(activeFilter).filter((v) =>
      String(v).toLowerCase().includes(filterText.toLowerCase())
    );

  /* ================= EXPORT ================= */
  const buildExportData = () => {
    const headers = [
      "EMP ID",
      "Login Date",
      "Emp Name",
      "DEPT",
      "REPORTING MANAGER",
      "CHECK IN",
      "CHECK OUT",
      "TOTAL HOURS",
      "IN LOCATION",
      "OUT LOCATION",
      "LATE",
      "EARLY",
      "STATUS",
    
      "TYPE",
    ];

    const rows = filteredRecordsFinal.map((r) => [
      r.empId,
      r.date,
      r.name,
      r.department,
      r.reportingManager,
      r.checkIn,
      r.checkOut,
      calculateHours(r.checkIn, r.checkOut),
      r.locationIn,
      r.locationOut,
      r.late,
      r.earlyLeave,
      r.status,
    
      r.attendanceType,
    ]);

    return { headers, rows };
  };

  const handleExportCSV = () => {
    const { headers, rows } = buildExportData();
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) =>
          e
            .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "attendance_report.csv";
    link.click();
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const { headers, rows } = buildExportData();

    let tableHtml =
      "<table><tr>" +
      headers.map((h) => `<th>${h}</th>`).join("") +
      "</tr>";
    rows.forEach((row) => {
      tableHtml +=
        "<tr>" + row.map((v) => `<td>${v ?? ""}</td>`).join("") + "</tr>";
    });
    tableHtml += "</table>";

    const excelContent =
      "data:application/vnd.ms-excel;charset=utf-8," +
      encodeURIComponent(tableHtml);

    const link = document.createElement("a");
    link.href = excelContent;
    link.download = "attendance_report.xls";
    link.click();
    setShowExportMenu(false);
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    { key: "empId", label: "EMP ID" },
  
    { key: "name", label: "Emp Name" },
    { key: "department", label: "DEPT" },
    ...(role === "admin" || role === "manager"
      ? [{ key: "reportingManager", label: "REPORTING MANAGER" }]
      : []),
      { key: "date", label: "Login Date" },
    { key: "checkIn", label: "CHECK IN" },
    { key: "checkOut", label: "CHECK OUT" },
    { key: "total", label: "TOTAL HOURS" },
    { key: "locationIn", label: "IN LOCATION" },
    { key: "locationOut", label: "OUT LOCATION" },
    { key: "late", label: "LATE" },
    { key: "earlyLeave", label: "EARLY" },
    { key: "status", label: "STATUS" },
   
    { key: "attendanceType", label: "TYPE" },
    ...(role === "manager"
      ? [{ key: "actions", label: "ACTIONS" }]
      : []),
  ];

  const isWeeklyOff = [0, 6].includes(new Date(selectedDate).getDay());
  /* ================= RENDER ================= */
  return (
   <div className={styles.attendanceContainer}>
      <h2>Attendance Management</h2>

     <div className={styles.topPanel}>
        <div className="date-section">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <p>
            User: {loggedUser.name} ({loggedUser.role})
          </p>
        </div>

       <div className={styles.buttonGroup}>
          {role === "admin" && (
            <div style={{ position: "relative" }} ref={exportRef}>
              <button
                className="export"
                onClick={() => setShowExportMenu((prev) => !prev)}
              >
                Export ▾
              </button>
              {showExportMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    zIndex: 999,
                    minWidth: "150px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    onClick={handleExportCSV}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    📄 Download CSV
                  </div>
                  <div
                    onClick={handleExportExcel}
                    style={{ padding: "10px 16px", cursor: "pointer" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    📊 Download Excel
                  </div>
                </div>
              )}
            </div>
          )}

          <>
          <button
  className={styles.checkin}
  onClick={handleCheckIn}
  disabled={isWeeklyOff}
>
              Check In
            </button>
            <button className={styles.checkout} onClick={handleCheckOut}>
              Check Out
            </button>
<button
  className={styles.wfh}
  onClick={handleWorkFromHome}
>
  Work From Home
</button>
          </>
        </div>
      </div>

      {/* Date range + search filter (admin/manager) */}
      {(role === "admin" || role === "manager") && (
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            margin: "10px 0",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label>From: </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label>To: </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search by name or EMP ID..."
              value={empSearch}
              onChange={(e) => setEmpSearch(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                minWidth: "220px",
              }}
            />
            {/* ✅ Show badge if filtered from notification */}
            {filterEmployee && empSearch && (
              <span
                style={{
                  marginLeft: "8px",
                  padding: "4px 10px",
                  background: "#fff3cd",
                  color: "#856404",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Filtered: {employeeName || empSearch}
              </span>
            )}
          </div>
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
        </div>
      )}

      <div className={styles.tableWrapper} >
      <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  <div className={styles.header}>
                    {col.label}
                    {col.key !== "total" && col.key !== "actions" && (
                     <span
  onClick={() => {
    setActiveFilter(col.key);

    setTempSelected(
      Array.isArray(filters[col.key])
        ? filters[col.key]
        : filters[col.key]
        ? [filters[col.key]]
        : []
    );
  }}
>
  ⏷
</span>
                    )}
                  </div>

                 {activeFilter === col.key && col.key !== "actions" && (
  <div ref={popupRef} className={styles.popup}>
    <input
      placeholder="Search..."
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
    />

    <div className={styles.link}>
      <label className={styles.filterOption}>
        <input
          type="checkbox"
          checked={
            tempSelected.length === getUnique(col.key).length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setTempSelected(getUnique(col.key));
            } else {
              setTempSelected([]);
            }
          }}
        />
        (Select All)
      </label>

      {(suggestions || []).map((s) => (
        <label key={s} className={styles.filterOption}>
          <input
            type="checkbox"
            checked={tempSelected.includes(s)}
            onChange={(e) => {
              if (e.target.checked) {
                setTempSelected([...tempSelected, s]);
              } else {
                setTempSelected(
                  tempSelected.filter((item) => item !== s)
                );
              }
            }}
          />
          {s}
        </label>
      ))}
    </div>

    <div className={styles.filterActions}>
      <button
        className={styles.okBtn}
        onClick={() => {
          setFilters({
            ...filters,
            [col.key]: tempSelected,
          });

          setActiveFilter(null);
          setFilterText("");
        }}
      >
        OK
      </button>

      <button
        className={styles.cancelBtn}
        onClick={() => {
          setActiveFilter(null);
          setFilterText("");
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRecordsFinal.length > 0 ? (
              filteredRecordsFinal.map((r, index) => (
                <tr key={index}>
                  <td>{r.empId || "-"}</td>
                
                  <td>{r.name}</td>
                  <td>{r.department}</td>

                  {(role === "admin" || role === "manager") && (
                    <td>{r.reportingManager || "-"}</td>
                  )}
                    <td>{r.date}</td>
                  <td>{formatTime(r.checkIn)}</td>
                  <td>{r.checkOut && r.checkOut !== "-" ? formatTime(r.checkOut) : "-"}</td>
                  <td>{calculateHours(r.checkIn, r.checkOut)}</td>
                 <td>{r.locationIn || "-"}</td>
<td>{r.locationOut || "-"}</td>
                  <td>{r.late}</td>
                  <td>{r.earlyLeave}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background:
                        r.status === 'Present'          ? '#dcfce7' :
                        r.status === 'Half Day'         ? '#fef9c3' :
                        r.status === 'Absent'           ? '#fee2e2' :
                        r.status === 'On Leave'         ? '#dbeafe' :
                        r.status === 'Pending Approval' ? '#f3f4f6' : '#f3f4f6',
                      color:
                        r.status === 'Present'          ? '#16a34a' :
                        r.status === 'Half Day'         ? '#854d0e' :
                        r.status === 'Absent'           ? '#dc2626' :
                        r.status === 'On Leave'         ? '#1d4ed8' :
                        r.status === 'Pending Approval' ? '#6b7280' : '#6b7280',
                    }}>
                      {r.status}
                    </span>
                  </td>
                
                  <td>{r.attendanceType || "Office"}</td>
                  
                  {/* Manager Actions Column */}
                  {role === "manager" && (
                    <td>
                      <button
                        onClick={() => handleEditAttendance(r)}
                        style={{
                          padding: "4px 12px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          border: "1px solid #0d6efd",
                          background: "#0d6efd",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#0b5ed7")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#0d6efd")}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === "manager" ? "16" : "15"} style={{ textAlign: "center" }}>
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manager Edit Modal */}
      {editModalVisible && editingRecord && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "24px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#333" }}>
              Edit Attendance - {editingRecord.name}
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
                <strong>Employee ID:</strong> {editingRecord.empId}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
                <strong>Date:</strong> {editingRecord.date}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
                <strong>Current Status:</strong> {editingRecord.status}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                Status:
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="Present">Present</option>
                <option value="Half Day">Half Day</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                Check-In Time (HH:MM:SS):
              </label>
              <input
                type="time"
                step="1"
                value={editForm.checkIn}
                onChange={(e) => {
                  // Convert HH:MM to HH:MM:SS format
                  const time = e.target.value;
                  setEditForm({ ...editForm, checkIn: time + ":00" });
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                Check-Out Time (HH:MM:SS):
              </label>
              <input
                type="time"
                step="1"
                value={editForm.checkOut}
                onChange={(e) => {
                  // Convert HH:MM to HH:MM:SS format
                  const time = e.target.value;
                  setEditForm({ ...editForm, checkOut: time + ":00" });
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setEditModalVisible(false);
                  setEditingRecord(null);
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#f5f5f5",
                  color: "#333",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: "8px 20px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#0d6efd",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0b5ed7")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0d6efd")}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}