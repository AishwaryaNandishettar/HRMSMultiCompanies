import React, { useState, useEffect } from "react";
import "./Task.css";
import api from "../api/axios";
import { getTasks, createTaskApi, getMyTasks, updateProgressApi } from "../api/taskApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function Task() {

  /* =========================
     ROLE BASED LOGIN DEMO
  ========================= */

const role =
  localStorage.getItem("role")?.toLowerCase() || "employee";

  const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8082";

  /* =========================
     TASK FORM
  ========================= */

  const [taskForm, setTaskForm] = useState({
    task: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  
  /* =========================
     TASK DATA
  ========================= */

const [taskData, setTaskData] = useState([]);
const [activeFilter, setActiveFilter] = useState(null);
const [kpiFilter, setKpiFilter] = useState("all");
const [filterText, setFilterText] = useState("");
const [employees, setEmployees] = useState([]);
const [uploadedFiles, setUploadedFiles] = useState({});
const [openActionMenu, setOpenActionMenu] = useState(null);

const [columnFilters, setColumnFilters] = useState({
  empid: [],
  employeename: [],
  task: [],
  assignedby: [],
  priority: [],
  assignDate: [],
  dueDate: [],
  department: [],
  status: [],
  approval: [],
});
const [popupFilterText, setPopupFilterText] =
  useState("");

  const fieldMap = {
  empid: "assigneeId",
  employeename: "assigneeName",
  task: "title",
  assignedby: "assignedBy",
  priority: "priority",
  status: "status",
  approval: "approval",
};

const getUniqueValues = (key) => {
  return [
    ...new Set(
      taskData
        .map((t) => {

          const field =
            fieldMap[key];

          return (
            t[field] ||
            t[key]
          );

        })
        .filter(Boolean)
    ),
  ];
};

const filterSuggestions =
  activeFilter &&
  getUniqueValues(activeFilter).filter(
    (v) =>
      String(v)
        .toLowerCase()
        .includes(
          popupFilterText.toLowerCase()
        )
  );

useEffect(() => {
  loadTasks();
}, []);

const loadTasks = async () => {
  try {
    const userRole = localStorage.getItem("role")?.toLowerCase() || "employee";
    
    let response;
    
    // Use different API based on role
    if (userRole === "employee") {
      // Employees get only their assigned tasks
      response = await getMyTasks();
      console.log("EMPLOYEE - MY TASKS:", response.data);
    } else {
      // Admin and Manager get all tasks (backend filters for manager)
      response = await getTasks();
      console.log("ADMIN/MANAGER - ALL TASKS:", response.data);
    }

    console.log("TASK COUNT:", response.data.length);
    console.log("TASK DATA:", response.data);

    setTaskData(response.data);

  } catch (error) {
    console.error("Load Tasks Error:", error);
    setTaskData([]);
  }
};

useEffect(() => {
  loadTasks();

  setColumnFilters({
    empid: [],
    employeename: [],
    task: [],
    assignedby: [],
    priority: [],
    assignDate: [],
    dueDate: [],
    department: [],
    status: [],
    approval: [],
  });
}, []);

useEffect(() => {
  loadEmployees();
}, []);

const loadEmployees = async () => {
  try {
    const res = await api.get("/api/employee/all");

    setEmployees(res.data || []);

    console.log("EMPLOYEES =>", res.data);
  } catch (err) {
    console.error("Employee Load Error", err);
  }
};

const suggestions =
  activeFilter
    ? getUniqueValues(activeFilter).filter(
        (v) =>
          String(v)
            .toLowerCase()
            .includes(
              popupFilterText.toLowerCase()
            )
      )
    : [];

  const getUnique = (key) => {
  return [
    ...new Set(
      taskData
        .map((t) => t[fieldMap[key]] || t[key])
        .filter(Boolean)
    ),
  ];
};

const renderFilterPopup = (key) => {
  if (activeFilter !== key) return null;

  return (
    <div className="taskPage-filterPopup">

      <input
        type="text"
        placeholder="Search..."
        value={popupFilterText}
        onChange={(e) =>
          setPopupFilterText(e.target.value)
        }
      />

      <div className="taskPage-filterList">
         {/* Select All */}
  {suggestions.length > 0 && (
    <label className="taskPage-filterItem taskPage-selectAll">
      <input
        type="checkbox"
        checked={
          suggestions.length > 0 &&
          suggestions.every((s) =>
            (columnFilters[key] || []).includes(s)
          )
        }
        onChange={(e) => {
          if (e.target.checked) {
            setColumnFilters({
              ...columnFilters,
              [key]: [...suggestions],
            });
          } else {
            setColumnFilters({
              ...columnFilters,
              [key]: [],
            });
          }
        }}
      />
      <span>Select All</span>
    </label>
  )}

      {filterSuggestions.length > 0 ? (

         filterSuggestions.map((s) => (

            <label
              key={s}
              className="taskPage-filterItem"
            >

              <input
                type="checkbox"
                checked={
                  Array.isArray(columnFilters[key])
                    ? columnFilters[key].includes(s)
                    : false
                }
                onChange={(e) => {

                const prev =
  columnFilters[key] || [];

                  let updated = [];

                  if (e.target.checked) {

                    updated = [...prev, s];

                  } else {

                    updated = prev.filter(
                      (item) => item !== s
                    );

                  }

                  setColumnFilters({
                    ...columnFilters,
                    [key]: updated,
                  });

                }}
              />

              <span>{s}</span>

            </label>

          ))

        ) : (

          <div className="taskPage-noData">
            No Data
          </div>

        )}

      </div>
<div className="taskPage-filterActions">

  {/* OK = same as current Close */}
  <button
    onClick={() => {
      setActiveFilter(null);
      setPopupFilterText("");
    }}
  >
    OK
  </button>

  {/* Cancel = same as current Clear */}
  <button
    onClick={() => {
      setColumnFilters({
        ...columnFilters,
        [key]: [],
      });
    }}
  >
    Cancel
  </button>

</div>

    </div>
  );
};
      const exportData = (type) => {

  const exportRows = taskData.map((t) => ({
    "Emp ID": t.assigneeId || t.id,
    "Employee Name": t.assigneeName || t.employee,
    "Task": t.title || t.task,
    "Assigned By": t.assignedBy || t.manager,
    "Priority": t.priority,
    "Assign Date":
      t.createdAt
        ? new Date(t.createdAt).toLocaleDateString()
        : t.assignDate,
    "Due Date": t.dueDate,
    "Department": t.department || t.dept,
    "Progress": `${t.progress}%`,
    "Status": t.status,
    "Approval": t.approval,
  }));

  if (type === "csv") {

    const worksheet =
      XLSX.utils.json_to_sheet(exportRows);

    const csv =
      XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "Task_Report.csv");
  }

  if (type === "excel") {

    const worksheet =
      XLSX.utils.json_to_sheet(exportRows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Tasks"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const blob = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(blob, "Task_Report.xlsx");
  }
};
  /* =========================
     ASSIGN TASK
  ========================= */

 

const assignTask = async () => {
  if (
    !taskForm.task ||
    !taskForm.assignedTo ||
    !taskForm.dueDate
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    // Find the selected employee to get their email
    const selectedEmployee = employees.find(
      (emp) => emp.fullName === taskForm.assignedTo
    );
    
    if (!selectedEmployee) {
      alert("Employee not found");
      return;
    }

    const payload = {
      title: taskForm.task,
      assigneeName: taskForm.assignedTo,
      assignee: selectedEmployee.email, // Add employee email
      assigneeId: selectedEmployee.employeeId || selectedEmployee.id,
      
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      taskAction: "Assigned", // NEW
    };

    console.log("Creating task with payload:", payload);

    await createTaskApi(payload);

    await loadTasks(); // reload from backend

    setTaskForm({
      task: "",
      assignedTo: "",
      priority: "Medium",
      dueDate: "",
    });

    alert("Task assigned successfully!");

  } catch (err) {
    console.error("Task Create Error", err);
    alert("Failed to assign task");
  }
};

const handleUpload = async (e, task) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Store file in local state immediately for UI feedback
  setUploadedFiles((prev) => ({
    ...prev,
    [task.id]: file,
  }));

  try {
    console.log("Uploading file:", file.name, "for task:", task.id);
    
    // Create FormData
    const formData = new FormData();
    formData.append("file", file);
    
    // Try to upload file to server
    const response = await api.post("/api/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("File upload response:", response.data);

    
    
    // Update task with attachment URL
    const fileUrl =
  response.data.fileUrl ||
  response.data.url;
    
    await api.put(`/api/tasks/${task.id}`, {
      attachmentUrl: fileUrl,
      attachmentName: file.name,
    });
    
    // Reload tasks to show updated attachment
    await loadTasks();
    
    alert("File uploaded successfully!");
    
  } catch (error) {
    console.error("File upload error:", error);
    
    // If backend endpoint not ready, still allow local file selection
    if (error.response?.status === 404) {
      console.warn("Backend upload endpoint not ready. File stored locally for now.");
      alert(`File "${file.name}" selected. Upload endpoint will be available after backend restart.`);
    } else {
      alert("Failed to upload file to server. File is selected locally.");
    }
  }
};
const handleView = (task) => {
  // File uploaded and saved in backend
  if (task.attachmentUrl) {
    let fileUrl = task.attachmentUrl;

    // Handle relative URLs
  if (!fileUrl.startsWith("http")) {
  fileUrl = `${BACKEND_URL}${fileUrl}`;
}
 console.log("Opening:", fileUrl); // <-- Add this
    window.open(fileUrl, "_blank");
    return;
  }

  // File selected locally but not yet stored in backend
  if (uploadedFiles[task.id]) {
    const file = uploadedFiles[task.id];

    const blobUrl = URL.createObjectURL(file);

    window.open(blobUrl, "_blank");

    return;
  }

  alert("No file uploaded for this task");
};
const updateTaskAction = async (taskId, action) => {
  console.log("Task ID:", taskId);
  console.log("Action:", action);

  try {
    const res = await api.put(`/api/tasks/${taskId}`, {
      taskAction: action,
    });
 console.log("SERVER RESPONSE:", res.data);
    console.log("UPDATED TASK =>", res.data);
    console.log("TASK ACTION =>", res.data.taskAction);

    alert("Updated Successfully");

    await loadTasks();
  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
  }
};
  return (

    <div className="taskPage-container">

      {/* =========================
          TOP BAR
      ========================= */}

      <div className="taskPage-topBar">

        <div>

          <h1 className="taskPage-title">
             Task Management
          </h1>

        

        </div>

        {/* ROLE SWITCH */}

    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
  }}
>

{(role === "admin" ||
  role === "manager") && (

  <div className="taskPage-exportWrapper">

    <button className="taskPage-exportBtn">
      ⬇ Export
    </button>

    <div className="taskPage-exportDropdown">

      <div onClick={() => exportData("csv")}>
        📄 Download CSV
      </div>

      <div onClick={() => exportData("excel")}>
        📊 Download Excel
      </div>

    </div>

  </div>

)}
  <div className="taskPage-roleInfo">

    Logged in as :
    <span>
      {" "}
      {role.charAt(0).toUpperCase() +
        role.slice(1)}
    </span>

  </div>

</div>

      </div>

      {/* =========================
          KPI CARDS
      ========================= */}
<div className="taskPage-topCards">

  <div
    className="taskPage-card"
    onClick={() => setKpiFilter("all")}
    style={{ cursor: "pointer" }}
  >
    <h3>Total Tasks</h3>
    <h1>{taskData.length}</h1>
  </div>

  <div
    className="taskPage-card"
    onClick={() => setKpiFilter("completed")}
    style={{ cursor: "pointer" }}
  >
    <h3>Completed</h3>
    <h1>
      {
        taskData.filter(
          (t) => Number(t.progress) === 100
        ).length
      }
    </h1>
  </div>

  <div
    className="taskPage-card"
    onClick={() => setKpiFilter("progress")}
    style={{ cursor: "pointer" }}
  >
    <h3>In Progress</h3>
    <h1>
      {
        taskData.filter(
          (t) =>
            Number(t.progress) > 0 &&
            Number(t.progress) < 100
        ).length
      }
    </h1>
  </div>

  <div
    className="taskPage-card"
    onClick={() => setKpiFilter("pending")}
    style={{ cursor: "pointer" }}
  >
    <h3>Pending</h3>
    <h1>
      {
        taskData.filter(
          (t) =>
            Number(t.progress) === 0
        ).length
      }
    </h1>
  </div>

</div>
      {/* =========================
          ASSIGN TASK
      ========================= */}

     {(role === "admin" || role === "manager" || role ==="employee") && (

        <div className="taskPage-assignCard">

          <h2>Assign Task</h2>

          <div className="taskPage-formGrid">

            <input
              type="text"
              placeholder="Enter Task Name"
              value={taskForm.task}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  task: e.target.value,
                })
              }
            />

            <select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  assignedTo: e.target.value,
                })
              }
            >
              <option value="">
                Select Employee
              </option>

            {employees.map((emp) => (
  <option
    key={emp.id || emp._id}
    value={emp.fullName}
  >
    {emp.fullName}
  </option>
))}

            </select>

            <select
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  priority: e.target.value,
                })
              }
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  dueDate: e.target.value,
                })
              }
            />

            <button
              className="taskPage-assignBtn"
              onClick={assignTask}
            >
              Assign Task
            </button>

          </div>

        </div>

      )}

      {/* =========================
          TABLE
      ========================= */}

    <div className="taskPage-tableWrapper">

  {/* Clear Filters Button */}
  {Object.keys(columnFilters).some(key => columnFilters[key] && columnFilters[key].length > 0) && (
    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
      <button
        onClick={() => {
          setColumnFilters({
            empid: [],
            employeename: [],
            task: [],
            assignedby: [],
            priority: [],
            assigndate: [],
            duedate: [],
            department: [],
            progress: []
          });
        }}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer",
          background: "#f5f5f5"
        }}
      >
        Clear Filters
      </button>
    </div>
  )}

  <div className="taskPage-tableContainer">

    <table className="taskPage-table">

      <thead>

        <tr>

          <th className="taskPage-sticky-col taskPage-col-1">

  <div className="taskPage-thHeader">
    Emp ID
    <span onClick={() => {
  setActiveFilter("empid");
  setPopupFilterText("");
}}>
      ⏷
    </span>
  </div>

  {renderFilterPopup("empid")}

</th>

        <th className="taskPage-sticky-col taskPage-col-2">

  <div className="taskPage-thHeader">
    Employee Name
    <span
      onClick={() =>
        setActiveFilter("employeename")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("employeename")}

</th>

        <th className="taskPage-sticky-col taskPage-col-3">

  <div className="taskPage-thHeader">
    Task
    <span onClick={() => setActiveFilter("task")}>
      ⏷
    </span>
  </div>

{renderFilterPopup("task")}

</th>

        <th>

  <div className="taskPage-thHeader">
    Assigned By

    <span
      onClick={() =>
        setActiveFilter("assignedby")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("assignedby")}

</th>
          <th>

  <div className="taskPage-thHeader">
    Priority

    <span
      onClick={() =>
        setActiveFilter("priority")
      }
    >
      ⏷
    </span>
  </div>

 {renderFilterPopup("priority")}

</th>
         <th>

  <div className="taskPage-thHeader">
    Assign Date

    <span
      onClick={() =>
        setActiveFilter("assignDate")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("assignDate")}

</th>
         <th>

  <div className="taskPage-thHeader">
    Due Date

    <span
      onClick={() =>
        setActiveFilter("dueDate")
      }
    >
      ⏷
    </span>
  </div>

  {renderFilterPopup("dueDate")}
</th>
          <th>

  <div className="taskPage-thHeader">
    Department

    <span
      onClick={() =>
        setActiveFilter("department")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("department")}
</th>
          <th>Progress</th>
          <th>

  <div className="taskPage-thHeader">
    Status

    <span
      onClick={() =>
        setActiveFilter("status")
      }
    >
      ⏷
    </span>
  </div>

{renderFilterPopup("status")}
</th>
         <th>

  <div className="taskPage-thHeader">
    Approval

    <span
      onClick={() =>
        setActiveFilter("approval")
      }
    >
      ⏷
    </span>
  </div>

  {renderFilterPopup("approval")}
</th>
          <th>Attachment</th>
          <th>Remarks</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>
{taskData
  .filter((t) => {

    if (kpiFilter === "completed") {
      return Number(t.progress) === 100;
    }

    if (kpiFilter === "progress") {
      return (
        Number(t.progress) > 0 &&
        Number(t.progress) < 100
      );
    }

    if (kpiFilter === "pending") {
      return Number(t.progress) === 0;
    }

    return true;
  })
  .filter((t) => {

  return Object.keys(columnFilters).every((key) => {

    const selected =
      columnFilters[key];

    if (
      !selected ||
      selected.length === 0
    ) {
      return true;
    }

    const actualField =
      fieldMap[key];

    const value =
      t[actualField] ||
      t[key] ||
      "";

    return selected.includes(
      String(value)
    );

  });

})

  .map((t, index) => (

          <tr key={index}>

          <td className="taskPage-sticky-col taskPage-col-1">
   {t.employeeId || t.assigneeId || t.id}

</td>

           <td className="taskPage-sticky-col taskPage-col-2">
  {t.assigneeName || t.employee}
</td>

           <td className="taskPage-sticky-col taskPage-col-3">
  {t.title || t.task}
</td>

           <td>{t.assignedBy || t.manager}</td>

            <td>

              <span
                className={`taskPage-priority ${t.priority}`}
              >
                {t.priority}
              </span>

            </td>

            <td>
  {t.createdAt
    ? new Date(t.createdAt).toLocaleDateString()
    : t.assignDate}
</td>

            <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-GB") : "-"}</td>

            <td>{t.department || t.dept || "HRMS"}</td>
<td>
  <div className="taskPage-progressBox">
    <div
      className="taskPage-progressFill"
      style={{
        width: `${t.progress}%`,
      }}
    />
  </div>

  {role === "employee" ? (
    <input
      type="number"
      min="0"
      max="100"
      value={t.progress}
      onChange={async (e) => {
        const newProgress = parseInt(e.target.value) || 0;

        if (newProgress >= 0 && newProgress <= 100) {
          try {
            await updateProgressApi(t.id, newProgress);
            await loadTasks();
          } catch (err) {
            console.error("Progress update error:", err);
            alert("Failed to update progress");
          }
        }
      }}
      style={{
        width: "50px",
        marginLeft: "8px",
        padding: "4px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    />
  ) : (
    <span
      style={{
        marginLeft: "8px",
        fontWeight: "600",
      }}
    >
      {t.progress}%
    </span>
  )}
</td>

            <td>

              <span
                className={`taskPage-status ${t.status.replace(
                  /\s/g,
                  ""
                )}`}
              >
                {t.status}
              </span>

            </td>

            <td>{t.approval}</td>

<td>

  {role === "employee" ? (
    <>
      <input
        type="file"
        id={`file-${t.id}`}
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e, t)}
      />

      <button
        className="taskPage-uploadBtn"
        onClick={() =>
          document.getElementById(`file-${t.id}`).click()
        }
        style={{
          background:
            uploadedFiles[t.id] || t.attachmentUrl
              ? "#28a745"
              : "#007bff",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {uploadedFiles[t.id] || t.attachmentUrl
          ? "✓ Uploaded"
          : "Upload"}
      </button>
    </>
  ) : null}

  {t.attachmentUrl && (
    <button
      style={{
        marginTop: "5px",
        padding: "4px 8px",
        background: "#17a2b8",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        display: "block",
      }}
      onClick={() => handleView(t)}
    >
      View File
    </button>
  )}

  {uploadedFiles[t.id] && role === "employee" && (
    <div
      style={{
        fontSize: "11px",
        marginTop: "4px",
        color: "#666",
      }}
    >
      {uploadedFiles[t.id].name}
    </div>
  )}

</td>

            <td>
              API Integration Pending
            </td>
<td>
  {role === "employee" ? (
  !t.taskAction || t.taskAction === "Assigned" ? (
    <div style={{ display: "flex", gap: "5px" }}>
      <button
        className="taskPage-actionBtn"
        onClick={() =>
          updateTaskAction(t.id || t._id, "Accepted")
        }
      >
        Accept
      </button>

      <button
        className="taskPage-actionBtn"
        style={{ background: "#dc3545" }}
        onClick={() =>
          updateTaskAction(t.id || t._id, "Rejected")
        }
      >
        Reject
      </button>
    </div>
  ) : (
    <span
      style={{
        color:
          t.taskAction === "Accepted"
            ? "green"
            : "red",
        fontWeight: "600",
      }}
    >
      {t.taskAction}
    </span>
  )
) : (
  <div
    style={{
      position: "relative",
      display: "inline-block",
    }}
  >
  <button
  className="taskPage-actionBtn"
  onClick={() =>
    setOpenActionMenu(
      openActionMenu === (t.id || t._id)
        ? null
        : (t.id || t._id)
    )
  }
>
  {t.taskAction || "Action"} ▼
</button>

    {openActionMenu === (t.id || t._id) && (
      <div
        style={{
          position: "absolute",
          top: "38px",
          left: 0,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "6px",
          minWidth: "140px",
          zIndex: 1000,
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom:
              "1px solid #eee",
          }}
          onClick={() => {
            updateTaskAction(
              t.id || t._id,
              "Withdrawn"
            );
            setOpenActionMenu(null);
          }}
        >
          Withdrawn
        </div>

        <div
          style={{
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            updateTaskAction(
              t.id || t._id,
              "Extended"
            );
            setOpenActionMenu(null);
          }}
        >
          Extended
        </div>
      </div>
    )}
  </div>
)}
</td>
          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

    </div>
  );
}