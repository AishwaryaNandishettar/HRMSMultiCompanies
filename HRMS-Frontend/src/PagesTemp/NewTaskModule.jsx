import { useState, useEffect, useContext } from "react";
import styles from "./NewTaskModule.css";
import { TaskContext } from "../Context/TaskContext";
import { AuthContext } from "../Context/Authcontext";
import { getAllEmployees } from "../api/employeeApi";
import {
  acceptTaskApi,
  rejectTaskApi,
  submitTaskApi,
  updateProgressApi,
  approveTaskApi,
  rejectSubmissionApi,
} from "../api/taskApi";

// Status badge configuration
const STATUS_CONFIG = {
  ASSIGNED: { bg: "#FEF3C7", color: "#92400E", label: "NEW" },
  ACCEPTED: { bg: "#DBEAFE", color: "#1E40AF", label: "ACCEPTED" },
  IN_PROGRESS: { bg: "#E0E7FF", color: "#4338CA", label: "IN PROGRESS" },
  SUBMITTED: { bg: "#FCE7F3", color: "#9F1239", label: "SUBMITTED" },
  COMPLETED: { bg: "#D1FAE5", color: "#065F46", label: "COMPLETED" },
  REJECTED: { bg: "#FEE2E2", color: "#991B1B", label: "REJECTED" },
};

const PRIORITY_CONFIG = {
  HIGH: { color: "#DC2626", icon: "🔴" },
  MEDIUM: { color: "#F59E0B", icon: "🟡" },
  LOW: { color: "#10B981", icon: "🟢" },
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { bg: "#F3F4F6", color: "#6B7280", label: status };
  return (
    <span className={styles.statusBadge} style={{ background: config.bg, color: config.color }}>
      {config.label}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || { color: "#6B7280", icon: "⚪" };
  return (
    <span className={styles.priorityBadge} style={{ color: config.color }}>
      {config.icon} {priority}
    </span>
  );
};

export default function NewTaskModule() {
  const { user } = useContext(AuthContext);
  const { tasks, fetchTasks, addTask, updateTask } = useContext(TaskContext);

  // User role detection
  const role = (user?.role || "employee").toLowerCase();
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isEmployee = role === "employee";
  const canManage = isAdmin || isManager;
  const userEmail = user?.email || "";

  // State management
  const [employees, setEmployees] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectType, setRejectType] = useState(""); // 'assignment' or 'submission'
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      await fetchTasks();
      setLoading(false);
    };
    loadTasks();
  }, []);

  // Load employees for assignee dropdown
  useEffect(() => {
    if (!canManage) return;
    getAllEmployees()
      .then((res) => {
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        const allEmps = Array.isArray(list) ? list : [];

        if (isManager) {
          const teamEmps = allEmps.filter(
            (e) => (e.managerEmail || "").toLowerCase() === userEmail.toLowerCase()
          );
          setEmployees(teamEmps.length > 0 ? teamEmps : allEmps);
        } else {
          setEmployees(allEmps);
        }
      })
      .catch(() => {});
  }, [canManage, userEmail, isManager]);

  // Keep selected task in sync
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find((t) => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks, selectedTask]);

  // Filter tasks based on role
  const myTasks = isEmployee
    ? tasks.filter((t) => t.assignee === userEmail)
    : tasks;

  // Apply filters
  const filteredTasks = myTasks.filter((task) => {
    const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
    const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Calculate KPIs
  const kpis = {
    total: myTasks.length,
    assigned: myTasks.filter((t) => t.status === "ASSIGNED").length,
    inProgress: myTasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "ACCEPTED").length,
    submitted: myTasks.filter((t) => t.status === "SUBMITTED").length,
    completed: myTasks.filter((t) => t.status === "COMPLETED").length,
    rejected: myTasks.filter((t) => t.status === "REJECTED").length,
  };

  // Create task handler
  const handleCreateTask = async () => {
    if (!form.title.trim() || !form.assignee.trim()) {
      alert("Task title and assignee are required.");
      return;
    }

    try {
      await addTask({
        title: form.title,
        description: form.description,
        assignee: form.assignee,
        priority: form.priority,
        dueDate: form.dueDate || null,
        status: "ASSIGNED",
        progress: 0,
        history: [],
      });

      setForm({ title: "", description: "", assignee: "", priority: "MEDIUM", dueDate: "" });
      setShowCreateForm(false);
      await fetchTasks();
    } catch (error) {
      alert("Failed to create task. Please try again.");
    }
  };

  // Employee actions
  const handleAcceptTask = async (id) => {
    try {
      await acceptTaskApi(id);
      await fetchTasks();
    } catch {
      alert("Failed to accept task.");
    }
  };

  const handleRejectTask = async () => {
    if (!selectedTask) return;
    try {
      if (rejectType === "assignment") {
        await rejectTaskApi(selectedTask.id, rejectReason);
      } else if (rejectType === "submission") {
        await rejectSubmissionApi(selectedTask.id, rejectReason);
      }
      setShowRejectModal(false);
      setRejectReason("");
      setRejectType("");
      await fetchTasks();
    } catch {
      alert("Failed to reject task.");
    }
  };

  const handleUpdateProgress = async (id, progress) => {
    try {
      await updateProgressApi(id, progress);
      updateTask(id, { progress });
    } catch {
      // Silent fail
    }
  };

  const handleSubmitTask = async (id) => {
    try {
      await submitTaskApi(id);
      await fetchTasks();
    } catch {
      alert("Failed to submit task.");
    }
  };

  // Manager/Admin actions
  const handleApproveTask = async (id) => {
    try {
      await approveTaskApi(id);
      await fetchTasks();
    } catch {
      alert("Failed to approve task.");
    }
  };

  const openRejectModal = (type) => {
    setRejectType(type);
    setShowRejectModal(true);
  };

  // Delete task (admin only)
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await updateTask(id, { status: "DELETED" });
      setSelectedTask(null);
      await fetchTasks();
    } catch {
      alert("Failed to delete task.");
    }
  };

  return (
    <div className={styles.newTaskContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Task Management</h1>
          <p className={styles.pageSubtitle}>
            {isEmployee
              ? "View and manage your assigned tasks"
              : `Manage tasks for ${isManager ? "your team" : "all employees"}`}
          </p>
        </div>
        {canManage && (
          <button
            className={styles.createTaskBtn}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "✕ Cancel" : "+ Create Task"}
          </button>
        )}
      </div>

      {/* KPI Dashboard */}
      <div className={styles.kpiDashboard}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "#EEF2FF" }}>
            📊
          </div>
          <div className={styles.kpiContent}>
            <h3 className={styles.kpiValue}>{kpis.total}</h3>
            <p className={styles.kpiLabel}>Total Tasks</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "#FEF3C7" }}>
            📋
          </div>
          <div className={styles.kpiContent}>
            <h3 className={styles.kpiValue}>{kpis.assigned}</h3>
            <p className={styles.kpiLabel}>Assigned</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "#E0E7FF" }}>
            ⚙️
          </div>
          <div className={styles.kpiContent}>
            <h3 className={styles.kpiValue}>{kpis.inProgress}</h3>
            <p className={styles.kpiLabel}>In Progress</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "#FCE7F3" }}>
            📤
          </div>
          <div className={styles.kpiContent}>
            <h3 className={styles.kpiValue}>{kpis.submitted}</h3>
            <p className={styles.kpiLabel}>Submitted</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "#D1FAE5" }}>
            ✅
          </div>
          <div className={styles.kpiContent}>
            <h3 className={styles.kpiValue}>{kpis.completed}</h3>
            <p className={styles.kpiLabel}>Completed</p>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon} style={{ background: "#FEE2E2" }}>
            ❌
          </div>
          <div className={styles.kpiContent}>
            <h3 className={styles.kpiValue}>{kpis.rejected}</h3>
            <p className={styles.kpiLabel}>Rejected</p>
          </div>
        </div>
      </div>

      {/* Create Task Form */}
      {canManage && showCreateForm && (
        <div className={styles.createFormCard}>
          <h2 className={styles.formTitle}>Create New Task</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Task Title *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Assign To *</label>
              {employees.length > 0 ? (
                <select
                  className={styles.formSelect}
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id || emp.email} value={emp.email || emp.workEmail || ""}>
                      {emp.fullName} ({emp.email || emp.workEmail})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="email"
                  className={styles.formInput}
                  placeholder="Enter employee email"
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                />
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Priority</label>
              <select
                className={styles.formSelect}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Due Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Description</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Enter task description (optional)"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.btnPrimary} onClick={handleCreateTask}>
              Create Task
            </button>
            <button className={styles.btnSecondary} onClick={() => setShowCreateForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="ALL">All Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Task List */}
        <div className={styles.taskListSection}>
          <div className={styles.taskListHeader}>
            <h2 className={styles.sectionTitle}>Tasks ({filteredTasks.length})</h2>
          </div>

          <div className={styles.taskList}>
            {loading ? (
              <div className={styles.emptyState}>
                <div className={styles.loader}></div>
                <p>Loading tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📭</span>
                <p>No tasks found</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${styles.taskCard} ${
                    selectedTask?.id === task.id ? styles.taskCardActive : ""
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className={styles.taskCardHeader}>
                    <h3 className={styles.taskCardTitle}>{task.title}</h3>
                    {isAdmin && (
                      <button
                        className={styles.deleteIconBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        title="Delete Task"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <p className={styles.taskCardMeta}>
                    {canManage ? `Assigned to: ${task.assignee}` : `By: ${task.assignedBy || "Manager"}`}
                  </p>

                  <div className={styles.taskCardFooter}>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>

                  {task.dueDate && (
                    <p className={styles.taskCardDue}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Detail Panel */}
        <div className={styles.taskDetailSection}>
          {selectedTask ? (
            <div className={styles.taskDetail}>
              {/* Detail Header */}
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailTitle}>{selectedTask.title}</h2>
                  <div className={styles.detailBadges}>
                    <StatusBadge status={selectedTask.status} />
                    <PriorityBadge priority={selectedTask.priority} />
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedTask.description && (
                <div className={styles.detailSection}>
                  <h3 className={styles.detailSectionTitle}>Description</h3>
                  <p className={styles.detailDescription}>{selectedTask.description}</p>
                </div>
              )}

              {/* Task Info Grid */}
              <div className={styles.detailInfoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Assigned To</span>
                  <span className={styles.infoValue}>{selectedTask.assignee || "—"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Assigned By</span>
                  <span className={styles.infoValue}>{selectedTask.assignedBy || "—"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Due Date</span>
                  <span className={styles.infoValue}>
                    {selectedTask.dueDate
                      ? new Date(selectedTask.dueDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Created</span>
                  <span className={styles.infoValue}>
                    {selectedTask.createdAt
                      ? new Date(selectedTask.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Progress Section */}
              <div className={styles.detailSection}>
                <div className={styles.progressHeader}>
                  <h3 className={styles.detailSectionTitle}>Progress</h3>
                  <span className={styles.progressPercent}>{selectedTask.progress || 0}%</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${selectedTask.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Reject Reason */}
              {selectedTask.rejectReason && (
                <div className={styles.detailSection}>
                  <h3 className={styles.detailSectionTitle}>Rejection Reason</h3>
                  <div className={styles.rejectReasonBox}>
                    <p>{selectedTask.rejectReason}</p>
                  </div>
                </div>
              )}

              {/* Employee Actions */}
              {isEmployee && selectedTask.assignee === userEmail && (
                <div className={styles.actionsSection}>
                  {selectedTask.status === "ASSIGNED" && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.btnSuccess}
                        onClick={() => handleAcceptTask(selectedTask.id)}
                      >
                        ✓ Accept Task
                      </button>
                      <button
                        className={styles.btnDanger}
                        onClick={() => openRejectModal("assignment")}
                      >
                        ✗ Reject Task
                      </button>
                    </div>
                  )}

                  {(selectedTask.status === "ACCEPTED" || selectedTask.status === "IN_PROGRESS") && (
                    <div className={styles.progressControl}>
                      <label className={styles.progressLabel}>Update Progress</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress || 0}
                        className={styles.progressSlider}
                        onChange={(e) =>
                          handleUpdateProgress(selectedTask.id, parseInt(e.target.value))
                        }
                      />
                      <button
                        className={styles.btnPrimary}
                        onClick={() => handleSubmitTask(selectedTask.id)}
                      >
                        Submit for Approval
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Manager/Admin Actions */}
              {canManage && selectedTask.status === "SUBMITTED" && (
                <div className={styles.actionsSection}>
                  <p className={styles.actionNote}>
                    This task has been submitted for your approval.
                  </p>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.btnSuccess}
                      onClick={() => handleApproveTask(selectedTask.id)}
                    >
                      ✓ Approve & Complete
                    </button>
                    <button
                      className={styles.btnDanger}
                      onClick={() => openRejectModal("submission")}
                    >
                      ↩ Send Back
                    </button>
                  </div>
                </div>
              )}

              {/* History Timeline */}
              <div className={styles.detailSection}>
                <h3 className={styles.detailSectionTitle}>Activity History</h3>
                <div className={styles.timeline}>
                  {selectedTask.history && selectedTask.history.length > 0 ? (
                    selectedTask.history.map((entry, index) => (
                      <div key={index} className={styles.timelineItem}>
                        <div className={styles.timelineDot}></div>
                        <p className={styles.timelineText}>{entry}</p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyTimeline}>No activity yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetail}>
              <span className={styles.emptyDetailIcon}>📋</span>
              <h3>Select a Task</h3>
              <p>Choose a task from the list to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {rejectType === "assignment" ? "Reject Task Assignment" : "Send Task Back"}
              </h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowRejectModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.formLabel}>Reason (optional)</label>
              <textarea
                className={styles.formTextarea}
                placeholder="Enter reason for rejection..."
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnDanger} onClick={handleRejectTask}>
                Confirm Reject
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
