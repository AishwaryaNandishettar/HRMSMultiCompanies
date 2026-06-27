import React, { useEffect, useState } from "react";
import { useNavigate, useParams , useLocation} from "react-router-dom";
import "./ATSTable.css";
import { getAllJobs } from "../../api/recruitmentApi";

export default function ATSTable() {
    const navigate = useNavigate();

    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showExport, setShowExport] = useState(false);
    const [viewJob, setViewJob] = useState(null);

    const PAGE_SIZE = 15;
    const { type } = useParams();

    const exportData = (exportType) => {
        const dataToExport = filteredData;
        if (!dataToExport.length) return alert("No data");

        const exportCols = columns.filter(c => c.key !== "description");
        const headers = exportCols.map(c => c.label);
        const keys = exportCols.map(c => c.key);

        const body = dataToExport.map(r =>
            keys.map(k => `"${String(r[k] ?? "").replace(/"/g, '""')}"`)
        );

        const content = [
            headers.join(","),
            ...body.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${pageTitle}.${exportType === "excel" ? "xls" : exportType}`;
        link.click();
        setShowExport(false);
    };

    const columns = [
        { key: "jobTitle", label: "Job Title" },
        { key: "department", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "ctc", label: "CTC" },
        { key: "postedDate", label: "Posted Date" },
        { key: "status", label: "Status", type: "badge" },
        { key: "description", label: "Description" }
    ];

    /* =========================
       PAGE TITLE
    ========================== */
    const pageTitle =
        type === "interview-scheduled" ? "Interview Scheduled"
        : type === "positions-filled"  ? "Positions Filled"
        : type === "new-applications"  ? "New Applicants"
        : "Open Positions";

    /* =========================
       FETCH DATA (BACKEND)
    ========================== */
    const fetchJobs = async () => {
        try {
            const stateJobs = location.state?.jobs;
            const stage = location.state?.stage;

            if (Array.isArray(stateJobs) && stateJobs.length > 0) {
                setJobs(stateJobs);
                return;
            }

            const res = await getAllJobs();
            let data = Array.isArray(res) ? res : [];

            if (stage) {
                const normalized = stage.toLowerCase();
                data = data.filter(job => {
                    const status = (job.status || "").toLowerCase();
                    if (normalized === "selected") return status === "selected";
                    if (normalized === "shortlisted") return status === "shortlisted";
                    if (normalized === "interview stage") return status.includes("interview");
                    return status.includes(normalized);
                });
            }

            setJobs(data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [location.state, type]);

    const sourceData =
        Array.isArray(location.state?.jobs) && location.state.jobs.length > 0
            ? location.state.jobs
            : jobs;

    const filteredData = sourceData.filter(row =>
        Object.values(row).some(v =>
            String(v).toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    const paginatedData = filteredData.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    /* =========================
       KPI COUNTS (computed from sourceData — no logic change)
    ========================== */
    const totalCount     = sourceData.length;
    const openCount      = sourceData.filter(j => (j.status || "").toLowerCase() === "open").length;
    const closedCount    = sourceData.filter(j => (j.status || "").toLowerCase() === "closed").length;
    const selectedCount  = sourceData.filter(j => (j.status || "").toLowerCase() === "selected").length;
    const interviewCount = sourceData.filter(j => (j.status || "").toLowerCase().includes("interview")).length;
    const rejectedCount  = sourceData.filter(j => (j.status || "").toLowerCase() === "rejected").length;

    /* KPI config per page type */
    const kpiCards =
        type === "open-positions" ? [
            { label: "Total Open",    value: totalCount,     color: "#2563eb" },
            { label: "Open",          value: openCount,      color: "#16a34a" },
            { label: "Closed",        value: closedCount,    color: "#dc2626" },
        ] :
        type === "new-applications" ? [
            { label: "Total",         value: totalCount,     color: "#2563eb" },
            { label: "Open",          value: openCount,      color: "#16a34a" },
            { label: "Rejected",      value: rejectedCount,  color: "#dc2626" },
            { label: "Interview",     value: interviewCount, color: "#f59e0b" },
            { label: "Selected",      value: selectedCount,  color: "#0891b2" },
        ] :
        type === "positions-filled" ? [
            { label: "Total Filled",  value: totalCount,     color: "#16a34a" },
            { label: "Selected",      value: selectedCount,  color: "#2563eb" },
        ] :
        type === "interview-scheduled" ? [
            { label: "Total",         value: totalCount,     color: "#f59e0b" },
            { label: "Interview",     value: interviewCount, color: "#f97316" },
        ] : [];

    /* =========================
       UI
    ========================== */
    return (
        <div className="ats-wrapper">

            {/* ── Header ── */}
            <div className="ats-header">
                <button className="ats-back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <h2 className="ats-title">{pageTitle}</h2>
            </div>

            {/* ── KPI Cards ── */}
            {kpiCards.length > 0 && (
               <div
  className={`ats-kpi-row ${
    type === "positions-filled" ||
    type === "interview-scheduled"
      ? "ats-kpi-row-two-cards"
      : ""
  }`}
>
                    {kpiCards.map((card, i) => (
                        <div key={i} className="ats-kpi-card" style={{ background: `linear-gradient(135deg, ${card.color}dd, ${card.color})` }}>
                            <div className="ats-kpi-left">
                                <div className="ats-kpi-label">{card.label}</div>
                                <div className="ats-kpi-value">{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Search + Export toolbar ── */}
            <div className="ats-toolbar">
                <div className="ats-search-wrap">
                    <span className="ats-search-icon">🔍</span>
                    <input
                        type="text"
                        className="ats-search"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="ats-export-btn" onClick={() => setShowExport(true)}>
                    ⬇ Export
                </button>
            </div>

            {/* ── Export Modal ── */}
            {showExport && (
                <div className="export-overlay" onClick={() => setShowExport(false)}>
                    <div className="export-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Export Format</h3>
                        <button onClick={() => exportData("csv")}>CSV</button>
                        <button onClick={() => exportData("excel")}>Excel</button>
                        <button onClick={() => exportData("txt")}>Notepad (TXT)</button>
                        <button className="cancel-btn" onClick={() => setShowExport(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {filteredData.length === 0 ? (
                <p className="ats-empty">No Matching Records Found</p>
            ) : (
                <div className="ats-table-wrapper">
                    <table className="ats-table">
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, i) => (
                                <tr key={i}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.key === "description" ? (
                                                <button className="ats-view-btn" onClick={() => setViewJob(row)}>View</button>
                                            ) : col.type === "badge" ? (
                                                <span className={`ats-badge ats-badge-${(row[col.key] || "").toLowerCase().replace(/\s+/g, "-")}`}>
                                                    {row[col.key]}
                                                </span>
                                            ) : (
                                                row[col.key] ?? "-"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="ats-pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}

            {/* ── View Job Modal ── */}
            {viewJob && (
                <div className="export-overlay" onClick={() => setViewJob(null)}>
                    <div className="export-modal" style={{ width: 400, textAlign: "left" }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: 16 }}>{viewJob.jobTitle}</h3>
                        <p><strong>Department:</strong> {viewJob.department}</p>
                        <p><strong>Designation:</strong> {viewJob.designation}</p>
                        <p><strong>CTC:</strong> {viewJob.ctc}</p>
                        <p><strong>Status:</strong> {viewJob.status}</p>
                        <p><strong>Posted:</strong> {viewJob.postedDate}</p>
                        <p style={{ marginTop: 8 }}>{viewJob.description || "No description available."}</p>
                        <button className="cancel-btn" style={{ marginTop: 16 }} onClick={() => setViewJob(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
