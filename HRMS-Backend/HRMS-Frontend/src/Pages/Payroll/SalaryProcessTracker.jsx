import React, { useState } from "react";
import "./SalaryProcessTracker.css";

const STAGES = [
  { id: 1, label: "Attendance Finalized",  icon: "📅" },
  { id: 2, label: "Leave Verification",    icon: "✅" },
  { id: 3, label: "Payroll Calculation",   icon: "🧮" },
  { id: 4, label: "Payroll Review",        icon: "🔍" },
  { id: 5, label: "Payroll Approval",      icon: "👍" },
  { id: 6, label: "Salary Processing",     icon: "⚙️" },
  { id: 7, label: "Bank Transfer",         icon: "🏦" },
  { id: 8, label: "Payslips Generated",    icon: "📄" },
  { id: 9, label: "Completed",             icon: "🎉" },
];

const MONTH_LABEL = () => {
  const now = new Date();
  return now.toLocaleString("default", { month: "long", year: "numeric" });
};

const SalaryProcessTracker = ({ role }) => {
  const storageKey = "payroll_tracker_stage";
  const saved = parseInt(localStorage.getItem(storageKey) || "0", 10);
  const [currentStage, setCurrentStage] = useState(saved); // 0 = not started

  const canEdit = role === "admin" || role === "hr" || role === "finance";

  const handleStageClick = (stageId) => {
    if (!canEdit) return;
    const next = stageId === currentStage ? stageId - 1 : stageId;
    const clamped = Math.max(0, next);
    setCurrentStage(clamped);
    localStorage.setItem(storageKey, String(clamped));
  };

  const progressPct =
    STAGES.length > 1
      ? ((currentStage - 1) / (STAGES.length - 1)) * 100
      : 0;

  return (
    <div className="spt-wrapper">
      {/* ── Header row ── */}
      <div className="spt-header">
        <div className="spt-title-block">
          <span className="spt-icon-title">📊</span>
          <div>
            <p className="spt-title">Salary Process Tracker</p>
            <p className="spt-sub">
              Monthly payroll status for{" "}
              <strong>{MONTH_LABEL()}</strong>
            </p>
          </div>
        </div>

        <div className="spt-badge-block">
          {currentStage === 0 && (
            <span className="spt-badge not-started">Not Started</span>
          )}
          {currentStage > 0 && currentStage < STAGES.length && (
            <span className="spt-badge in-progress">
              In Progress — Stage {currentStage}/{STAGES.length}
            </span>
          )}
          {currentStage === STAGES.length && (
            <span className="spt-badge completed">✔ Completed</span>
          )}
          {canEdit && (
            <span className="spt-hint">
              {currentStage === STAGES.length
                ? "Click last stage to reset"
                : "Click a stage to mark progress"}
            </span>
          )}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="spt-bar-wrap">
        <div
          className="spt-bar-fill"
          style={{
            width: currentStage > 0 ? `${progressPct}%` : "0%",
          }}
        />
      </div>

      {/* ── Stages ── */}
      <div className="spt-stages">
        {STAGES.map((stage) => {
          const done    = currentStage >= stage.id;
          const active  = currentStage + 1 === stage.id;
          const pending = !done && !active;

          return (
            <div
              key={stage.id}
              className={`spt-stage ${done ? "done" : active ? "active" : "pending"} ${canEdit ? "clickable" : ""}`}
              onClick={() => handleStageClick(stage.id)}
              title={canEdit ? `Click to mark up to: ${stage.label}` : stage.label}
            >
              {/* circle */}
              <div className="spt-circle">
                {done ? (
                  <span className="spt-check">✓</span>
                ) : (
                  <span className="spt-num">{stage.id}</span>
                )}
              </div>

              {/* label */}
              <div className="spt-label-wrap">
                <span className="spt-stage-icon">{stage.icon}</span>
                <span className="spt-stage-label">{stage.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalaryProcessTracker;
