// src/Pages/BGV.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BGV.css";
import { getAllOnboardingRecords } from "../api/onboardingApi";

// In-memory + localStorage backed storage
let bgvRecords = [];

// load from localStorage on import time if available
try {
  const raw = localStorage.getItem("bgv_records");
  if (raw) bgvRecords = JSON.parse(raw);
} catch (e) {
  bgvRecords = [];
}

// exported function used by Onboarding.jsx
export function addBGVRecord(record) {
  const rec = {
    ...record,
    _id: Date.now() + Math.floor(Math.random() * 999),
  };
  bgvRecords.push(rec);
  try {
    localStorage.setItem("bgv_records", JSON.stringify(bgvRecords));
  } catch (e) {
    console.warn("Could not save BGV record to localStorage", e);
  }
}

// update helper
function saveAll(records) {
  bgvRecords = records;
  try {
    localStorage.setItem("bgv_records", JSON.stringify(bgvRecords));
  } catch (e) {
    console.warn("Could not persist BGV records", e);
  }
}

// ✅ Helper: Check if document is bank-related (confidential)
const isBankDocument = (docName) => {
  if (!docName) return false;
  const lower = docName.toLowerCase();
  return lower.includes('bank') ||
    lower.includes('passbook') ||
    lower.includes('cheque') ||
    lower.includes('account') ||
    lower.includes('statement');
};

// ✅ Helper: Mask confidential document names
const maskDocument = (docName) => {
  if (!docName || docName === 'N/A') return docName;
  return '********** (Confidential) 🔒';
};

// ✅ Helper: Get viewable URL for documents
// Works on localhost AND after Vercel deployment — no logic change, just robust URL resolution
const getDocumentUrl = (docPath) => {
  if (!docPath || docPath === 'N/A') return null;

  // Already a full URL — return as-is
  if (docPath.startsWith('http://') || docPath.startsWith('https://')) return docPath;

  // Base64 data URI — return as-is (works in both envs)
  if (docPath.startsWith('data:')) return docPath;

  // Just a bare filename with no path info — cannot resolve to a URL
  if (!docPath.includes('/')) {
    console.warn('⚠️ Document is just a filename, not a viewable URL:', docPath);
    return null;
  }

  // Resolve against the API base URL (works on localhost AND on Render/Vercel via env var)
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082').replace(/\/$/, '');

  if (docPath.startsWith('/uploads/')) return `${baseUrl}${docPath}`;
  if (docPath.startsWith('uploads/')) return `${baseUrl}/${docPath}`;

  // Any other relative path
  const cleanPath = docPath.startsWith('/') ? docPath : `/${docPath}`;
  return `${baseUrl}${cleanPath}`;
};

// ✅ Helper: View document in new tab
const viewDocument = (docPath, docName) => {
  console.log('🔍 Attempting to view document:', docPath);
  const url = getDocumentUrl(docPath);
  if (!url) {
    if (docPath && !docPath.includes('/') && !docPath.startsWith('data:')) {
      alert(
        `⚠️ Document "${docPath}" cannot be viewed.\n\nThe document was uploaded but not stored on the server.\n\nTo view documents:\n1. Documents must be uploaded to the backend server\n2. Or stored as base64 data in the database\n\nCurrently, only the filename is saved.`
      );
    } else {
      alert('Document not available');
    }
    return;
  }
  if (isBankDocument(docName) || isBankDocument(docPath)) {
    const confirmView = window.confirm(
      '⚠️ CONFIDENTIAL DOCUMENT\n\nThis is a confidential bank document. Do you have authorization to view it?\n\nClick OK to proceed or Cancel to abort.'
    );
    if (!confirmView) return;
  }
  console.log('📄 Opening document:', url);
  window.open(url, '_blank');
};

// ✅ Helper: Download document
// For base64 data URIs: converts to Blob first so `download` attribute works
// in all browsers and past Vercel/browser security restrictions.
// For server URLs: uses fetch → Blob → object URL so the browser downloads
// the file instead of navigating to it — works identically on localhost and Vercel.
const downloadDocument = async (docPath, docName) => {
  const url = getDocumentUrl(docPath);
  if (!url) { alert('Document not available for download'); return; }

  if (isBankDocument(docName) || isBankDocument(docPath)) {
    const confirmDl = window.confirm(
      '⚠️ CONFIDENTIAL DOCUMENT\n\nDo you have authorization to download this document?\n\nClick OK to proceed or Cancel to abort.'
    );
    if (!confirmDl) return;
  }

  try {
    let blobUrl;
    let fileName = docName || 'document';

    if (url.startsWith('data:')) {
      // ── Base64 data URI → Blob (bypasses browser data-URI download restrictions)
      const [header, base64Data] = url.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

      // Detect extension from MIME if filename has none
      if (!fileName.includes('.')) {
        const extMap = {
          'application/pdf': '.pdf',
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'image/webp': '.webp',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        };
        fileName += extMap[mime] || '';
      }

      const byteChars = atob(base64Data);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
      const blob = new Blob([byteArray], { type: mime });
      blobUrl = URL.createObjectURL(blob);

    } else {
      // ── Server URL → fetch → Blob (ensures download instead of navigation)
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

  } catch (err) {
    console.error('Download failed:', err);
    // Fallback: open in new tab so user can manually save
    window.open(url, '_blank');
  }
};

export default function BGV() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("");
  const [cibilMin, setCibilMin] = useState("");
  const [cibilMax, setCibilMax] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllOnboardingRecords();
        console.log("Mongo Records:", data);
        const normalized = data.map((r) => ({
          ...r,
          fullName: r.fullName || r.personal?.fullName,
          email: r.email || r.personal?.email,
          phone: r.phone || r.personal?.phone,
          employeeId: r.employeeId || r.job?.employeeId,
          department: r.department || r.job?.department,
          designation: r.designation || r.job?.designation,
          dob: r.dob || r.personal?.dob,
          joiningDate: r.joiningDate || r.job?.joiningDate,
          bgvStatus: r.bgvStatus || r.status || "Pending",
        }));
        setRecords([...normalized].reverse());
      } catch (e) {
        console.error("Error loading BGV records", e);
        const local = JSON.parse(localStorage.getItem("bgv_records")) || [];
        setRecords([...local].reverse());
      }
    };

    loadData();

    const onStorage = (ev) => { if (ev.key === "bgv_records") loadData(); };
    const onFocus = () => loadData();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const applyFilters = () => {
    return records.filter((r) => {
      // ── Skip records with no name AND no email (blank rows) ──
      if (!r.fullName && !r.email) return false;

      const lower = (s) => (s || "").toString().toLowerCase();
      const matchesSearch =
        !search ||
        lower(r.fullName).includes(lower(search)) ||
        lower(r.email).includes(lower(search)) ||
        lower(r.employeeId).includes(lower(search));
      const matchesStatus = statusFilter === "All" || (r.bgvStatus || "Pending") === statusFilter;
      const matchesDept = !deptFilter || r.department === deptFilter;
      const score = Number(r.cibilScore || 0);
      const minOK = !cibilMin || score >= Number(cibilMin);
      const maxOK = !cibilMax || score <= Number(cibilMax);
      return matchesSearch && matchesStatus && matchesDept && minOK && maxOK;
    });
  };

  const filtered = applyFilters();
  console.log("Filtered Records:", filtered);

  // ── Only ONE record open at a time ──
  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  const updateStatus = (id, newStatus) => {
    const next = [...bgvRecords];
    const idx = next.findIndex((x) => x._id === id);
    if (idx === -1) return;
    next[idx].bgvStatus = newStatus;
    saveAll(next);
    setRecords([...next].reverse());
  };

  const exportCSV = () => {
    if (!records.length) return alert("No records to export");
    const header = ["Full Name", "Employee ID", "Email", "Phone", "Department", "BGV Status", "CIBIL Score", "Police Status", "Submitted At"];
    const rows = records.map((r) => [
      r.fullName || "", r.employeeId || "", r.email || "", r.phone || "",
      r.department || "", r.bgvStatus || "Pending", r.cibilScore || "",
      r.policeStatus || "", r.submittedAt || "",
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/\"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bgv_records.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Document list builder ──
  const getDocumentList = (r) => {
    const docs = [];
    const d = r.documents || {};

    if (d.resume)         docs.push({ key: 'resume',          label: 'Resume',           path: d.resume });
    if (d.aadharFile)     docs.push({ key: 'aadharFile',       label: 'Aadhaar',          path: d.aadharFile });
    else if (d.aadhaar)   docs.push({ key: 'aadhaar',          label: 'Aadhaar',          path: d.aadhaar });
    if (d.panFile)        docs.push({ key: 'panFile',          label: 'PAN Card',         path: d.panFile });
    else if (d.pan)       docs.push({ key: 'pan',              label: 'PAN Card',         path: d.pan });
    if (d.bankPassbook)   docs.push({ key: 'bankPassbook',     label: 'Bank Passbook',    path: d.bankPassbook, confidential: true });
    if (d.passbook)       docs.push({ key: 'passbook',         label: 'Bank Passbook',    path: d.passbook,     confidential: true });
    if (d.cancelledCheque) docs.push({ key: 'cancelledCheque', label: 'Cancelled Cheque', path: d.cancelledCheque, confidential: true });
    if (d.cheque)         docs.push({ key: 'cheque',           label: 'Cancelled Cheque', path: d.cheque,       confidential: true });

    const skip = new Set(['resume','aadharFile','aadhaar','panFile','pan','bankPassbook','passbook','cancelledCheque','cheque','photo']);
    Object.entries(d).forEach(([key, value]) => {
      if (skip.has(key) || !value || value === 'N/A') return;
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      docs.push({ key, label, path: value, confidential: isBankDocument(key) || isBankDocument(value) });
    });

    return docs;
  };

  return (
    <div className="bgv-root">

      {/* ── Header ── */}
      <div className="bgv-header">
        <div className="bgv-header-top">
          <h2 className="bgv-title">BGV Dashboard</h2>
          <div className="bgv-header-actions">
            <button className="btn-primary" onClick={() => navigate("/onboarding")}>
              + New Onboarding
            </button>
            <button className="btn-outline" onClick={exportCSV}>
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="bgv-filters">
          <input
            type="text"
            placeholder="Search name / email / emp id…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Clear">Clear</option>
            <option value="Issue Found">Issue Found</option>
          </select>
          <input
            type="number"
            placeholder="CIBIL min"
            value={cibilMin}
            onChange={(e) => setCibilMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="CIBIL max"
            value={cibilMax}
            onChange={(e) => setCibilMax(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bgv-table-wrapper">
        {filtered.length === 0 ? (
          <div className="bgv-empty">
            <div className="bgv-empty-icon">📋</div>
            No BGV records found
          </div>
        ) : (
          <table className="bgv-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <React.Fragment key={r._id}>

                  {/* ── Main row ── */}
                  <tr className="main-row">
                    <td>
                      <div className="emp-cell">
                        <span className="emp-name">
                          {r.fullName || "—"}
                        </span>
                        <span className="emp-sub">
                          {r.email || "—"}
                        </span>
                      </div>
                    </td>
                    <td>{r.employeeId || "—"}</td>
                    <td>{r.department || "—"}</td>
                    <td>
                      <span className={`status-badge ${(r.bgvStatus || "Pending").replace(/\s+/g, "-")}`}>
                        {r.bgvStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        defaultValue={r.bgvStatus || "Pending"}
                        onChange={(e) => updateStatus(r._id, e.target.value)}
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Clear</option>
                        <option>Issue Found</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className={`btn-view-more${expandedId === r._id ? " active" : ""}`}
                        onClick={() => toggleExpand(r._id)}
                      >
                        {expandedId === r._id ? "▲ Hide" : "▼ View More"}
                      </button>
                    </td>
                  </tr>

                  {/* ── Expanded detail row — only this record, not all ── */}
                  {expandedId === r._id && (
                    <tr className="detail-row">
                      <td colSpan={6}>
                        <div className="detail-panel">

                          {/* Personal */}
                          <div className="detail-section">
                            <h4>Personal</h4>
                            <div className="detail-row-item">
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">{r.phone || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Date of Birth</span>
                              <span className="detail-value">{r.dob || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Blood Group</span>
                              <span className="detail-value">{r.bloodGroup || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Address</span>
                              <span className="detail-value">{r.address || "—"}</span>
                            </div>
                            {r.emergencyContactName && (
                              <div className="detail-row-item">
                                <span className="detail-label">Emergency Contact</span>
                                <span className="detail-value">
                                  {r.emergencyContactName}{r.emergencyContactPhone ? ` (${r.emergencyContactPhone})` : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Job */}
                          <div className="detail-section">
                            <h4>Job Details</h4>
                            <div className="detail-row-item">
                              <span className="detail-label">Designation</span>
                              <span className="detail-value">{r.designation || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Joining Date</span>
                              <span className="detail-value">{r.joiningDate || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Last CTC</span>
                              <span className="detail-value">{r.lastCTC || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Reason for Leaving</span>
                              <span className="detail-value">{r.reasonForLeaving || "—"}</span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">CIBIL Score</span>
                              <span className="detail-value">
                                {r.cibilScore || "—"}{r.cibilRemarks ? ` • ${r.cibilRemarks}` : ""}
                              </span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Police Status</span>
                              <span className="detail-value">
                                {r.policeStatus || "—"}{r.policeVerificationNumber ? ` • Ref: ${r.policeVerificationNumber}` : ""}
                              </span>
                            </div>
                            <div className="detail-row-item">
                              <span className="detail-label">Submitted At</span>
                              <span className="detail-value">
                                {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
                              </span>
                            </div>
                          </div>

                          {/* Experience */}
                          <div className="detail-section">
                            <h4>Experience</h4>
                            {r.experience?.length ? (
                              r.experience.map((ex, i) => (
                                <div className="exp-entry" key={i}>
                                  <div className="exp-company">{ex.company} — {ex.designation}</div>
                                  {ex.managerName && <div className="exp-meta">Manager: {ex.managerName}</div>}
                                  {ex.managerFeedback && <div className="exp-meta">Feedback: {ex.managerFeedback}</div>}
                                </div>
                              ))
                            ) : (
                              <div style={{ color: "#9ca3af", fontSize: "13px" }}>No experience entries</div>
                            )}
                          </div>

                          {/* Documents */}
                          <div className="detail-section">
                            <h4>Documents</h4>
                            <div className="docs-grid">
                              {getDocumentList(r).length === 0 ? (
                                <div style={{ color: "#9ca3af", fontSize: "13px" }}>No documents uploaded</div>
                              ) : (
                                getDocumentList(r).map((doc) => (
                                  <div className="doc-item" key={doc.key}>
                                    <span className="doc-name">
                                      {doc.confidential ? "🔒 " : "📄 "}{doc.label}
                                    </span>
                                    <div className="doc-actions">
                                      <button
                                        className={doc.confidential ? "btn-doc-confidential" : "btn-doc-view"}
                                        onClick={() => viewDocument(doc.path, doc.label)}
                                      >
                                        View
                                      </button>
                                      <button
                                        className="btn-doc-download"
                                        onClick={() => downloadDocument(doc.path, doc.label)}
                                      >
                                        Download
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
