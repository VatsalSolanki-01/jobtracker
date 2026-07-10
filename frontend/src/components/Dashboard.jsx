import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import ApplicationModal from "./ApplicationModal";

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatStatus(status) {
  if (!status) return "-";

  const normalized = status.toLowerCase();

  if (
    normalized === "technical interview 1" ||
    normalized === "technical interview 2"
  ) {
    return "Technical Round";
  }

  return normalized
    .split(" ")
    .map((word) => {
      if (word.toLowerCase() === "hr") {
        return "HR";
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function Dashboard({ user, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  const [form, setForm] = useState({
    company_name: "",
    job_role: "",
    status: "applied",
    applied_date: "",
  });

  const loadApplications = async (
    searchValue = searchTerm,
    sortValue = sortOption
  ) => {
    try {
      const params = {};

      if (searchValue.trim()) {
        params.search = searchValue.trim();
      }

      if (sortValue) {
        params.sort = sortValue;
      }

      const response = await api.get("/applications", { params });
      setApplications(response.data);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error || "Failed to load applications";

      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadApplications(searchTerm, sortOption);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortOption]);

  const openAddModal = () => {
    setEditingApplication(null);

    setForm({
      company_name: "",
      job_role: "",
      status: "applied",
      applied_date: "",
    });

    setShowModal(true);
  };

  const openEditModal = (application) => {
    setEditingApplication(application);

    setForm({
      company_name: application.company_name || "",
      job_role: application.job_role || "",
      status: application.status || "applied",
      applied_date: application.applied_date
        ? application.applied_date.slice(0, 10)
        : "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingApplication(null);

    setForm({
      company_name: "",
      job_role: "",
      status: "applied",
      applied_date: "",
    });
  };

  const saveApplication = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      company_name: form.company_name.trim(),
      job_role: form.job_role.trim(),
      status: form.status,
      applied_date: form.applied_date,
    };

    if (!payload.company_name || !payload.job_role || !payload.status) {
      setMessage("Company name, job role, and status are required");
      return;
    }

    if (!payload.applied_date) {
      setMessage("Application date is required");
      return;
    }

    try {
      if (editingApplication) {
        await api.put(`/applications/${editingApplication.id}`, payload);
        setMessage("Application updated successfully");
      } else {
        await api.post("/applications", payload);
        setMessage("Application added successfully");
      }

      closeModal();
      loadApplications(searchTerm, sortOption);
    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.data?.error || "Operation failed";
      setMessage(errorMessage);
    }
  };

  const deleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);
      setMessage("Application deleted successfully");
      loadApplications(searchTerm, sortOption);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error || "Failed to delete application";

      setMessage(errorMessage);
    }
  };

  const summaryStats = {
    applied: applications.length,
    technicalRound: applications.filter(
      (a) =>
        a.status === "technical interview 1" ||
        a.status === "technical interview 2"
    ).length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    withdrawn: applications.filter((a) => a.status === "withdrawn").length,
  };

  const filteredApplications = useMemo(() => {
    if (statusFilter === "all") {
      return applications;
    }

    if (statusFilter === "selected") {
      return applications.filter((a) => a.status === "selected");
    }

    if (statusFilter === "rejected") {
      return applications.filter((a) => a.status === "rejected");
    }

    if (statusFilter === "applied") {
      return applications;
    }

    return applications;
  }, [applications, statusFilter]);

  const toggleStatusFilter = (filterName) => {
    setStatusFilter((current) => (current === filterName ? "all" : filterName));
  };

  return (
    <div className="container">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h2>Application Summary</h2>
              <p>Track your current pipeline at a glance</p>
            </div>

            <div className="summary-list">
              <button
                type="button"
                className={`summary-item summary-item-clickable ${
                  statusFilter === "applied" ? "summary-item-active" : ""
                }`}
                onClick={() => toggleStatusFilter("applied")}
              >
                <div className="summary-item-left">
                  <span className="summary-item-label">Applied</span>
                  <span className="summary-item-subtext">
                    Total opportunities added
                  </span>
                </div>
                <span className="summary-item-value">
                  {summaryStats.applied}
                </span>
              </button>

              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">Technical Round</span>
                  <span className="summary-item-subtext">
                    Interview round 1 or 2
                  </span>
                </div>
                <span className="summary-item-value">
                  {summaryStats.technicalRound}
                </span>
              </div>

              <button
                type="button"
                className={`summary-item summary-item-clickable ${
                  statusFilter === "selected" ? "summary-item-active" : ""
                }`}
                onClick={() => toggleStatusFilter("selected")}
              >
                <div className="summary-item-left">
                  <span className="summary-item-label">Selected</span>
                  <span className="summary-item-subtext">
                    Final positive outcomes
                  </span>
                </div>
                <span className="summary-item-value">
                  {summaryStats.selected}
                </span>
              </button>

              <button
                type="button"
                className={`summary-item summary-item-clickable ${
                  statusFilter === "rejected" ? "summary-item-active" : ""
                }`}
                onClick={() => toggleStatusFilter("rejected")}
              >
                <div className="summary-item-left">
                  <span className="summary-item-label">Rejected</span>
                  <span className="summary-item-subtext">
                    Applications closed negatively
                  </span>
                </div>
                <span className="summary-item-value">
                  {summaryStats.rejected}
                </span>
              </button>

              <div className="summary-item">
                <div className="summary-item-left">
                  <span className="summary-item-label">Withdrawn</span>
                  <span className="summary-item-subtext">
                    You chose not to continue
                  </span>
                </div>
                <span className="summary-item-value">
                  {summaryStats.withdrawn}
                </span>
              </div>
            </div>

            <div className="sidebar-note">
              <p>
                Click <strong>Applied</strong>, <strong>Selected</strong>, or{" "}
                <strong>Rejected</strong> to filter the table.
              </p>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-top">
            <div className="dashboard-heading">
              <h1>Job Tracker Dashboard</h1>
              <p className="welcome-text">Welcome, {user.name}</p>
            </div>

            <div className="dashboard-top-actions">
              <button className="add-btn" onClick={openAddModal}>
                Add Application
              </button>

              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="toolbar-card">
            <div className="toolbar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by company or role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="company_asc">Company A-Z</option>
                <option value="company_desc">Company Z-A</option>
              </select>
            </div>
          </div>

          {statusFilter !== "all" && (
            <div className="active-filter-bar">
              <span className="active-filter-text">
                Showing{" "}
                {statusFilter === "applied"
                  ? "all applied applications"
                  : `${statusFilter} applications`}
              </span>

              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => setStatusFilter("all")}
              >
                Clear filter
              </button>
            </div>
          )}

          {message && <div className="message">{message}</div>}

          <div className="table-card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.company_name}</td>
                        <td>{application.job_role}</td>
                        <td>{formatStatus(application.status)}</td>
                        <td>{formatDate(application.applied_date)}</td>
                        <td className="action-cell">
                          <button
                            className="update-btn"
                            onClick={() => openEditModal(application)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteApplication(application.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <ApplicationModal
          form={form}
          setForm={setForm}
          editingApplication={editingApplication}
          onSubmit={saveApplication}
          onClose={closeModal}
        />
      )}
    </div>
  );
}