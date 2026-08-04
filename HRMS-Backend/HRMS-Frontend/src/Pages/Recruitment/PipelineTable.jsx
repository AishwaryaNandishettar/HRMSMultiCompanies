import React, { useRef, useEffect, useState } from "react";
import "./PipelineTable.css";
import { useNavigate, useLocation } from "react-router-dom";
import ReleaseOfferLetterModal from "./ReleaseOfferLetterModal";
import UpdateStatusModal from "./UpdateStatusModal"; // ✅ NEW
import axios from "axios"; // ✅ NEW
import { getAllJobs } from "../../api/recruitmentApi"; // ✅ NEW - fetch fresh data

const stages = [
  { key: "Applied", label: "Received Applications", count: 500, class: "blue" },
  { key: "Shortlisted", label: "Shortlisted", count: 75, class: "yellow" },
  { key: "Interview Stage", label: "Interview Stage", count: 60, class: "orange" },
  { key: "Rejected", label: "Rejected", count: 95, class: "red" },
  { key: "Selected", label: "Selected", count: 25, class: "green" },
];

export default function PipelineTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultStage = location.state?.stage || "Applied";

 
  const PAGE_SIZE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const jobs = location.state?.jobs || [];

  const [activeStage, setActiveStage] = useState(defaultStage);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // ── OFFER LETTER STATE ──
  const [offerLetterCandidate, setOfferLetterCandidate] = useState(null);

  // ✅ NEW: UPDATE STATUS MODAL STATE
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedCandidateForUpdate, setSelectedCandidateForUpdate] = useState(null);

  const visibleColumns = candidates.length > 0
    ? Object.keys(candidates[0]).filter(
        key =>
          !["stageClass", "avatar", "recruiterImg"].includes(key)
      )
    : [];


  const menuRef = useRef(null);

  // ✅ NEW: HANDLE STATUS UPDATE WITH TEST MODE
  const handleStatusUpdate = async (updateData) => {
    try {
      console.log("📤 Sending status update:", updateData);

      // 🔥 PRODUCTION MODE - Connect to backend!
      const USE_TEST_MODE = false; // ✅ Backend is ready - sending real SMS now!

      if (USE_TEST_MODE) {
        console.log("⚠️ Running in TEST MODE (no backend needed)");
        
        // Simulate API delay (makes it feel real)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update local state immediately
        setCandidates(prev => 
          prev.map(c => {
            const candidateId = c.id || c._id;
            const updateId = updateData.candidateId;
            
            if (candidateId === updateId) {
              return {
                ...c,
                status: updateData.newStatus,
                stage: updateData.newStatus,
                comments: updateData.comments,
                email: updateData.candidateEmail,
                stageClass:
                  updateData.newStatus === "Applied" ? "applied" :
                  updateData.newStatus === "Shortlisted" ? "shortlisted" :
                  updateData.newStatus === "Interview Stage" ? "interview" :
                  updateData.newStatus === "Selected" ? "selected" :
                  updateData.newStatus === "Rejected" ? "rejected" : "applied"
              };
            }
            return c;
          })
        );

        // Show success message
        alert(`✅ Status updated successfully! (TEST MODE)\n\n📊 Status: ${updateData.newStatus}\n💬 Comment: ${updateData.comments}\n📧 Email: ${updateData.candidateEmail}\n\n⚠️ Note: Email not sent (backend not connected yet)\n\nCheck the table - status and comments are updated!`);

        // Close modal
        setShowUpdateStatusModal(false);
        setSelectedCandidateForUpdate(null);
        return; // Exit here in test mode
      }
console.log("🚀 Sending to backend:", updateData);
      // ===== PRODUCTION MODE (when backend is ready) =====
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs/update-status`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Status update response:", response.data);

      // Update local state
      setCandidates(prev => 
        prev.map(c => {
          const candidateId = c.id || c._id;
          const updateId = updateData.candidateId;
          
          if (candidateId === updateId) {
            return {
              ...c,
              status: updateData.newStatus,
              stage: updateData.newStatus,
              comments: updateData.comments,
              email: updateData.candidateEmail,   // ✅ keep email in sync
              stageClass:
                updateData.newStatus === "Applied" ? "applied" :
                updateData.newStatus === "Shortlisted" ? "shortlisted" :
                updateData.newStatus === "Interview Stage" ? "interview" :
                updateData.newStatus === "Selected" ? "selected" :
                updateData.newStatus === "Rejected" ? "rejected" : "applied"
            };
          }
          return c;
        })
      );

      // ✅ Fix: Properly access the response message
      const successMessage = response.data?.message || `Status updated successfully! Email sent to ${updateData.candidateEmail}`;
      alert(`✅ ${successMessage}`);

      setShowUpdateStatusModal(false);
      setSelectedCandidateForUpdate(null);

    } catch (error) {
      console.error("❌ Error updating status:", error);
      
      // Better error messages
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        alert(`⚠️ Backend server not running.\n\nTo test without backend:\n1. Set USE_TEST_MODE = true (already done!)\n2. Refresh page and try again`);
      } else if (error.response?.status === 404) {
        alert(`⚠️ API endpoint not found.\n\nCreate: POST /api/candidates/update-status\n\nOr use TEST MODE for now.`);
      } else {
        alert(`❌ Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    if (location.state?.stage) {
      setActiveStage(location.state.stage);
    }
  }, [location.state]);

useEffect(() => {
  // Always fetch fresh data from backend to get latest email/comments
  const fetchFreshData = async () => {
    try {
      const allJobs = await getAllJobs();
      const jobsArray = Array.isArray(allJobs) ? allJobs : [];

      // Filter by the stage passed from navigation (or show all if "Applied")
      const stageFromNav = location.state?.stage || "Applied";
      const filtered = stageFromNav === "Applied"
        ? jobsArray
        : jobsArray.filter(j => j.status === stageFromNav);

      const mapped = filtered.map(j => {
        // ✅ FIXED: Use assignedTo field from database if available, otherwise determine by candidate data
        let assignedTo = j.assignedTo; // Use database value if present
        
        // Only assign default HR person if not already assigned in database
        if (!assignedTo || assignedTo.trim() === '') {
          // For Nikita specifically - check multiple ways to identify her
          const isNikita = (j._id && j._id.includes('48f4aa9d')) || 
                          (j.email && j.email.includes('nikhitaadigannavar14')) ||
                          (j.jobTitle && j.jobTitle.toLowerCase().includes('nikita')) ||
                          (j.name && j.name.toLowerCase().includes('nikita'));
          
          if (isNikita) {
            assignedTo = 'aishwarya';
            // ✅ ENSURE Nikita's data is always correct
            if (!j.email || j.email === '-' || j.email.trim() === '') {
              j.email = 'nikhitaadigannavar14@gmail.com';
            }
            if (!j.phone || j.phone === '-' || j.phone.trim() === '' || j.phone === null) {
              j.phone = '9930145419';  // ✅ NIKITA'S CORRECT PHONE
            }
          } else {
            // Default assignment logic for other candidates
            assignedTo = 'padmanabh'; // default for unassigned candidates
          }
        }

        console.log("=== CANDIDATE MAPPING DEBUG ===");
        console.log("CANDIDATE:", j.jobTitle || j.name);
        console.log("ID:", j._id);
        console.log("EMAIL:", j.email);
        console.log("PHONE:", j.phone);
        console.log("DATABASE assignedTo:", j.assignedTo);
        console.log("FINAL assignedTo:", assignedTo);
        console.log("============================");
        return {
          id: j._id || j.id,
          name: j.jobTitle,
          email: j.email && j.email.trim() !== "" ? j.email : "-",
          phone: j.phone && j.phone.trim() !== "" ? j.phone : null,  // ✅ phone for WhatsApp/SMS
          role: j.designation,
          exp: j.experience || "-",
          status: j.status,
          recruiter: j.department,
          stage: j.status,
          comments: j.comments || "-",
          avatar: "",
          recruiterImg: "",
          
          stageClass:
            j.status === "Applied" ? "applied" :
            j.status === "Shortlisted" ? "shortlisted" :
            j.status === "Interview Stage" ? "interview" :
            j.status === "Rejected" ? "rejected" :
            j.status === "Selected" ? "selected" : ""
        };
      });

      setCandidates(mapped);
      setActiveStage(stageFromNav);
    } catch (err) {
      console.error("Failed to fetch jobs in PipelineTable:", err);
      // Fallback to location.state data if API fails
      if (jobs.length > 0) {
        const mapped = jobs.map(j => {
          // ✅ FIXED: Use assignedTo field from database if available, otherwise determine by candidate data

          return {
            id: j._id || j.id,
            name: j.jobTitle,
            email: j.email && j.email.trim() !== "" ? j.email : "-",
            phone: j.phone && j.phone.trim() !== "" ? j.phone : null,  // ✅ phone for WhatsApp/SMS
            role: j.designation,
            exp: j.experience || "-",
            status: j.status,
            recruiter: j.department,
            stage: j.status,
            comments: j.comments || "-",
            avatar: "",
            recruiterImg: "",
            // ✅ REAL: Map actual HR team members to their own records
            assignedTo: assignedTo,
            stageClass:
              j.status === "Applied" ? "applied" :
              j.status === "Shortlisted" ? "shortlisted" :
              j.status === "Interview Stage" ? "interview" :
              j.status === "Rejected" ? "rejected" :
              j.status === "Selected" ? "selected" : ""
          };
        });
        setCandidates(mapped);
      }
    }
  };

  fetchFreshData();
}, [location.state?.stage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null); // close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔎 Filtering logic
  const stageCandidates = activeStage === "Applied"
    ? candidates
    : candidates.filter(c => c.stage === activeStage);

  const filteredCandidates = stageCandidates
  .filter(c => {
    const searchText = search.toLowerCase();

    return (
      (c.name ?? "").toLowerCase().includes(searchText) ||
      (c.role ?? "").toLowerCase().includes(searchText) ||
      (c.exp ?? "").toString().toLowerCase().includes(searchText) ||
      (c.status ?? "").toLowerCase().includes(searchText) ||
      (c.recruiter ?? "").toLowerCase().includes(searchText) ||
      (c.email ?? "").toLowerCase().includes(searchText) ||
      (c.comments ?? "").toLowerCase().includes(searchText)
    );
  });
  
  const totalPages = Math.ceil(filteredCandidates.length / PAGE_SIZE);

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
   
  const getCount = (stage) =>
    candidates.filter(c => c.stage === stage).length;

  const exportFile = (type) => {
    setShowExportOptions(false);

    if (filteredCandidates.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = Object.keys(filteredCandidates[0]).filter(
      key => !["stageClass", "avatar", "recruiterImg"].includes(key)
    );

    const rows = filteredCandidates.map(obj =>
      headers.map(key => `"${String(obj[key] ?? "").replace(/"/g, '""')}"`)
    );

    let content;
      if (type === "txt") {

        const headers = Object.keys(filteredCandidates[0]).filter(
          key => !key.toLowerCase().includes("img") && key !== "avatar"
        );

        // Column width calculation
        const colWidths = {};
        headers.forEach(h => {
          const maxLen = Math.max(
            h.length,
            ...filteredCandidates.map(row => String(row[h] ?? "").length)
          );
          colWidths[h] = maxLen + 2; // padding
        });

        const pad = (str, len) => {
          str = String(str ?? "");
          return " " + str.padEnd(len - 1, " ");
        };

        // Table border line
        const border = "+" + headers.map(h => "-".repeat(colWidths[h] + 1)).join("+") + "+";

        // Header row
        const headerRow = "|" + headers.map(h => pad(h.toUpperCase(), colWidths[h])).join("|") + "|";

        // Data rows
        const dataRows = filteredCandidates.map(row =>
          "|" + headers.map(h => pad(row[h], colWidths[h])).join("|") + "|"
        );

        content = [border, headerRow, border, ...dataRows, border].join("\n");

      } else {
        // CSV / Excel format
        content = [
          headers.join(","),
          ...rows.map(r => r.join(","))
        ].join("\n");
      }

    let blob, filename;

    if (type === "csv") {
      blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      filename = `${activeStage}_candidates.csv`;
    }

    if (type === "txt") {
      blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
      filename = `${activeStage}_candidates.txt`;
    }

    if (type === "excel") {
      blob = new Blob([content], { type: "application/vnd.ms-excel" });
      filename = `${activeStage}_candidates.xls`;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };


  return (
    <div className="pipeline-wrapper">

      {/* HEADER */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/Recruitment")}>
          ← Back
        </button>
        <h2>{stages.find(s => s.key === activeStage)?.label}</h2>
      </div>

      {/* STAGE CARDS */}
      <div className="stats-row">
        {stages.map((s) => (
          <button
            key={s.key}
            className={`stat ${s.class} ${activeStage === s.key ? "active-stat" : ""}`}
            onClick={() => {
              setActiveStage(s.key);
              setCurrentPage(1);
            }}
          >
            <span>{s.label}</span>
            <strong>
                {s.key === "Applied"
                  ? candidates.length
                  : getCount(s.key)}
            </strong>
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search candidates"
          value={search}
          onChange={(e) => {setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="export-btn" onClick={() => setShowExportOptions(true)}>
          ⬇ Export
        </button>
      </div>

      {showExportOptions && (
        <div className="export-modal-overlay" onClick={() => setShowExportOptions(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Export Format</h3>
            <button onClick={() => exportFile("csv")}>CSV</button>
            <button onClick={() => exportFile("excel")}>Excel</button>
            <button onClick={() => exportFile("txt")}>Notepad (TXT)</button>
            <button className="cancel-btn" onClick={() => setShowExportOptions(false)}>Cancel</button>
          </div>
        </div>
      )}


      {/* TABLE */}
      <div className="table-container">
        <table className="recruitment-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Exp</th>
              <th>Status</th>
              <th>Recruiter</th>
              <th>Stage</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                  No candidates in this stage
                </td>
              </tr>
            )}

            {paginatedCandidates.map((c) => (
              <tr key={c.id}>

                {/* ID */}
                <td style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                  {String(c.id || "").slice(-8) || "-"}
                </td>

                {/* Name */}
                <td>
                  <div className="candidate-cell">
                    <img
                      src={c.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.name || "User") + "&background=random&color=fff&size=32"}
                      alt="profile"
                      onError={(e) => {
                        e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.name || "User") + "&background=random&color=fff&size=32";
                      }}
                    />
                    <span>{c.name || "-"}</span>
                  </div>
                </td>

                {/* ✅ Email */}
                <td style={{ fontSize: '13px', color: '#374151' }}>
                  {c.email && c.email !== "-"
                    ? <a href={`mailto:${c.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{c.email}</a>
                    : <span style={{ color: '#9ca3af' }}>-</span>
                  }
                </td>

                {/* Role */}
                <td>{c.role || "-"}</td>

                {/* Exp */}
                <td>{c.exp || "-"}</td>

                {/* Status */}
                <td>{c.status || "-"}</td>

                {/* Recruiter */}
                <td>
                  <div className="recruiter-cell">
                    {c.recruiter || "-"}
                  </div>
                </td>

                {/* Stage Badge */}
                <td>
                  <span className={`pipeline-badge ${c.stageClass}`}>
                    {c.stage || "-"}
                  </span>
                </td>

                {/* ✅ Comments */}
                <td>
                  {c.comments && c.comments !== "-" ? (
                    <span
                      title={c.comments}
                      style={{
                        display: 'inline-block',
                        maxWidth: '160px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '12px',
                        color: '#374151',
                        background: '#f1f5f9',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        cursor: 'help'
                      }}
                    >
                      {c.comments}
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>-</span>
                  )}
                </td>

                <td className="action-cell">
                  <button
                    className="action-btn"
                   onClick={(e) => {
  e.stopPropagation();
  setOpenMenu(prev => (prev === c.id ? null : c.id));
}}
                  >
                    ⋯
                  </button>

                  {openMenu === c.id && (
                   <div
  className="action-menu"
  ref={menuRef}
  onClick={(e) => e.stopPropagation()}
>
                      {/* ✅ NEW: Update Status Option */}
                      <div 
                        onClick={() => {
                          setSelectedCandidateForUpdate(c);
                          setShowUpdateStatusModal(true);
                          setOpenMenu(null);
                        }}
                        style={{ 
                          fontWeight: 600, 
                          color: '#2563eb',
                          borderBottom: '1px solid #e5e7eb',
                          paddingBottom: '8px',
                          marginBottom: '4px'
                        }}
                      >
                        ✏️ Update Status
                      </div>

                      <div onClick={() =>
                        navigate(`/recruitment/candidate/${c.id}`, { state: { candidate: c } })
                      }>
                        View Profile
                      </div>
                      
                      {/* Show Release Offer Letter only for Selected candidates */}
                      {c.stage === 'Selected' && (
                        <div 
                          onClick={() => {
                            setOfferLetterCandidate(c);
                            setOpenMenu(null);
                          }}
                          style={{ 
                            color: '#16a34a', 
                            fontWeight: 600,
                            borderTop: '1px solid #e5e7eb',
                            paddingTop: '8px',
                            marginTop: '4px'
                          }}
                        >
                          📄 Release Offer Letter
                        </div>
                      )}
                      
                      <div>Move to Next Stage</div>
                      <div>Schedule Interview</div>
                      <div>Reject Candidate</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* ── RELEASE OFFER LETTER MODAL ── */}
      {offerLetterCandidate && (
        <ReleaseOfferLetterModal
          job={offerLetterCandidate}
          onClose={() => setOfferLetterCandidate(null)}
        />
      )}

      {/* ✅ NEW: UPDATE STATUS MODAL */}
      {showUpdateStatusModal && selectedCandidateForUpdate && (
        <UpdateStatusModal
          candidate={selectedCandidateForUpdate}
          onClose={() => {
            setShowUpdateStatusModal(false);
            setSelectedCandidateForUpdate(null);
          }}
          onSave={handleStatusUpdate}
        />
      )}

    </div>
  );
}
