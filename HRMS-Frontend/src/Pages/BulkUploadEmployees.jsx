import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../api/axios";
import "./Employeedirectory.css";
import { getAllEmployees } from "../api/employeeApi";

export default function BulkUploadEmployees() {
    const navigate = useNavigate();
  const [uploadRows, setUploadRows] = useState([]);
  const [uploadSaving, setUploadSaving] = useState(false);

  const fileInputRef = useRef();
  useEffect(() => {
  fetchEmployees();
}, []);

const fetchEmployees = async () => {
  try {
    console.log("FETCH STARTED");

    const res = await api.get("/api/employees");

    console.log("FULL RESPONSE:", res);
    console.log("RESPONSE DATA:", res.data);

    // IMPORTANT FIX
    const employees =
      res.data?.employees ||
      res.data?.data ||
      res.data ||
      [];

    console.log("FINAL EMPLOYEES:", employees);

    setUploadRows(Array.isArray(employees) ? employees : []);

  } catch (err) {
    console.error("FETCH ERROR:", err);

    if (err.response) {
      console.log("ERROR RESPONSE:", err.response.data);
      console.log("STATUS:", err.response.status);
    }
  }
};

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });

      const ws = wb.Sheets[wb.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const normalized = json.map((row) => ({
        fullName: row.fullName || "",
        employeeId: row.employeeId || "",
        email: row.email || "",
        phone: row.phone || "",

        department: row.department || "",
        designation: row.designation || "",
        location: row.location || "",
        manager: row.manager || "",

        dob: row.dob || "",
        doj: row.doj || "",

        bankAccountNumber: row.bankAccountNumber || "",
        ifsc: row.ifsc || "",

        uan: row.uan || "",
        pf: row.pf || "",
        esic: row.esic || "",

        previousCompany: row.previousCompany || "",
        previousDesignation: row.previousDesignation || "",
        totalExperience: row.totalExperience || "",

        aadhaar: row.aadhaar || "",
        pan: row.pan || "",
      }));

      setUploadRows((prev) => [...prev, ...normalized]);
    };

    reader.readAsBinaryString(file);
  };

 const handleBulkUploadSave = async () => {
  try {
    setUploadSaving(true);

    const res = await api.post("/api/employee/bulk-upload", uploadRows);

    console.log("BULK SAVE RESPONSE:", res.data);

    await fetchEmployees(); // refresh immediately

    alert("Employees Uploaded Successfully");
  } catch (err) {
    console.error(err);
    alert("Upload Failed");
  } finally {
    setUploadSaving(false);
  }
};

  const downloadSampleTemplate = () => {
const sample = [
  {
    fullName: "",
    employeeId: "",
    email: "",
    phone: "",

    department: "",
    designation: "",
    location: "",
    manager: "",

    dob: "",
    doj: "",

    bankAccountNumber: "",
    ifsc: "",

    uan: "",
    pf: "",
    esic: "",

    previousCompany: "",
    previousDesignation: "",
    totalExperience: "",

    aadhaar: "",
    pan: "",
  },
];
    const ws = XLSX.utils.json_to_sheet(sample);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    XLSX.writeFile(wb, "Bulk_Upload_Template.xlsx");
  };

  const handleInputChange = (index, field, value) => {
  const updated = [...uploadRows];

  updated[index][field] = value;

  setUploadRows(updated);
};

const removeRow = (index) => {
  const updated = uploadRows.filter((_, i) => i !== index);

  setUploadRows(updated);
};
  return (
  <div className="directory-container bulk-upload-page">
      <div className="directory-header">
        <h2>Bulk Employee Upload</h2>

       {/* Back Button */}
<div
  style={{
    marginBottom: "16px",
    position: "relative",
    zIndex: 9999,
    display: "inline-block",
  }}
>
  <button
    type="button"
    onClick={() => navigate(-1)}
    style={{
      padding: "10px 18px",
      background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      pointerEvents: "auto",
      position: "relative",
      zIndex: 9999,
    }}
  >
    ← Back
  </button>
</div>
        <div className="header-actions">
          <button
            className="export-btn"
            onClick={downloadSampleTemplate}
          >
            ⬇ Download Template
          </button>

          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleExcelUpload}
          />

          <button
            className="export-btn"
            onClick={handleBulkUploadSave}
            disabled={uploadSaving}
          >
            {uploadSaving ? "Uploading..." : "Final Upload"}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="employee-table">
            <thead>
              <tr className="table-head">
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Phone</th>

                <th>Department</th>
                <th>Designation</th>
                <th>Location</th>
                <th>Manager</th>

                <th>DOB</th>
                <th>DOJ</th>

                <th>Bank Account</th>
                <th>IFSC</th>

                <th>UAN</th>
                <th>PF</th>
                <th>ESIC</th>

                <th>Previous Company</th>
                <th>Previous Designation</th>
                <th>Total Experience</th>

                <th>Aadhaar</th>
                <th>PAN</th>
                  {/* ADD HERE */}
 
              </tr>
            </thead>

            <tbody>
              {uploadRows.map((emp, index) => (
                <tr key={index}>
                 <td>
  <input
   value={emp.fullName || emp.name || ""}
    onChange={(e) =>
      handleInputChange(index, "fullName", e.target.value)
    }
    className="bulk-input"
  />
</td>
               <td>
  <input
    value={emp.employeeId || ""}
    onChange={(e) =>
      handleInputChange(index, "employeeId", e.target.value)
    }
    className="bulk-input"
  />
</td>
                <td>
  <input
    value={emp.email || ""}
    onChange={(e) =>
      handleInputChange(index, "email", e.target.value)
    }
    className="bulk-input"
  />
</td>
                  <td>{emp.phone}</td>

                <td>
  <input
    value={emp.department || ""}
    onChange={(e) =>
      handleInputChange(index, "department", e.target.value)
    }
    className="bulk-input"
  />
</td>
                  <td>{emp.designation}</td>
                  <td>{emp.location}</td>
                  <td>{emp.manager}</td>

                  <td>{emp.dob}</td>
                  <td>{emp.doj}</td>

                  <td>{emp.bankAccountNumber}</td>
                  <td>{emp.ifsc}</td>

                  <td>{emp.uan}</td>
                  <td>{emp.pf}</td>
                  <td>{emp.esic}</td>

                  <td>{emp.previousCompany}</td>
                  <td>{emp.previousDesignation}</td>
                  <td>{emp.totalExperience}</td>

                  <td>{emp.aadhaar}</td>
                  <td>{emp.pan}</td>
                  <td>
  <button
    onClick={() => removeRow(index)}
    style={{
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer"
    }}
  >
    Delete
  </button>
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