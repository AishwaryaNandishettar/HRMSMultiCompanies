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
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);

  const fileInputRef = useRef();
  const documentInputRefs = {
    resume: useRef(),
    aadhaar: useRef(),
    offerLetter: useRef(),
    pan: useRef(),
    education: useRef(),
  };
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

        // Document fields (Base64 strings)
        resumeDocument: "",
        aadhaarDocument: "",
        offerLetterDocument: "",
        panDocument: "",
        educationDocument: "",
      }));

      setUploadRows((prev) => [...prev, ...normalized]);
    };

    reader.readAsBinaryString(file);
  };

  // Handle document upload for a specific employee row
  const handleDocumentUpload = (rowIndex, docType, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const updated = [...uploadRows];
      updated[rowIndex][`${docType}Document`] = base64;
      setUploadRows(updated);
    };
    reader.readAsDataURL(file);
  };

  const openDocUploadModal = (index) => {
    setSelectedRow(index);
    setShowDocUploadModal(true);
  };

  const closeDocUploadModal = () => {
    setSelectedRow(null);
    setShowDocUploadModal(false);
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
                <th>Documents</th>
                <th>Actions</th>
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
                      onClick={() => openDocUploadModal(index)}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      📄 Upload Docs
                      {(emp.resumeDocument || emp.aadhaarDocument || emp.offerLetterDocument || emp.panDocument || emp.educationDocument) && " ✓"}
                    </button>
                  </td>

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

      {/* Document Upload Modal */}
      {showDocUploadModal && selectedRow !== null && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0 }}>Upload Documents for {uploadRows[selectedRow]?.fullName || uploadRows[selectedRow]?.name || "Employee"}</h3>
              <button onClick={closeDocUploadModal} style={{
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666"
              }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Resume */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>
                  Resume {uploadRows[selectedRow]?.resumeDocument && "✅"}
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => handleDocumentUpload(selectedRow, "resume", e.target.files[0])}
                  style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              {/* Aadhaar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>
                  Aadhaar Card {uploadRows[selectedRow]?.aadhaarDocument && "✅"}
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocumentUpload(selectedRow, "aadhaar", e.target.files[0])}
                  style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              {/* Offer Letter */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>
                  Offer Letter {uploadRows[selectedRow]?.offerLetterDocument && "✅"}
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleDocumentUpload(selectedRow, "offerLetter", e.target.files[0])}
                  style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              {/* PAN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>
                  PAN Card {uploadRows[selectedRow]?.panDocument && "✅"}
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocumentUpload(selectedRow, "pan", e.target.files[0])}
                  style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              {/* Education Certificate */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>
                  Education Certificate {uploadRows[selectedRow]?.educationDocument && "✅"}
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocumentUpload(selectedRow, "education", e.target.files[0])}
                  style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>

              <button
                onClick={closeDocUploadModal}
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}