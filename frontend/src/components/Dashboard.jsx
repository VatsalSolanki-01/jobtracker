import { useEffect, useState } from "react";
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
  const [allApplications, setAllApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    job_role: "",
    location: "",
    status: "applied",
    applied_date: "",
  });

  const loadSummaryApplications = async () => {
    try {
      const response = await api.get("/applications");
      setAllApplications(response.data);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Failed to load application summary";
      setMessage(errorMessage);
    }
  };

  const loadApplications = async (
    searchValue = searchTerm,
    sortValue = sortOption,
    filterValue = statusFilter
  ) => {
    try {
      const params = {};

      if (searchValue.trim()) {
        params.search = searchValue.trim();
      }

      if (sortValue) {
        params.sort = sortValue;
      }

      if (filterValue) {
        params.status = filterValue;
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

  const refreshDashboardData = async (
    searchValue = searchTerm,
    sortValue = sortOption,
    filterValue = statusFilter
  ) => {
    await Promise.all([
      loadSummaryApplications(),
      loadApplications(searchValue, sortValue, filterValue),
    ]);
  };

  useEffect(() => {
    loadSummaryApplications();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadApplications(searchTerm, sortOption, statusFilter);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortOption, statusFilter]);

  const openAddModal = () => {
    setEditingApplication(null);

    setForm({
      company_name: "",
      job_role: "",
      location: "",
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
      location: application.location || "",
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
      location: "",
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
      location: form.location.trim(),
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
      await refreshDashboardData(searchTerm, sortOption, statusFilter);
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
      await refreshDashboardData(searchTerm, sortOption, statusFilter);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error || "Failed to delete application";

      setMessage(errorMessage);
    }
  };

  const handleStatusFilter = (filterKey) => {
    setStatusFilter((prev) => (prev === filterKey ? "" : filterKey));
  };

  const clearAllFilters = async () => {
    setSearchTerm("");
    setSortOption("newest");
    setStatusFilter("");
    await refreshDashboardData("", "newest", "");
  };

  const summaryStats = {
    applied: allApplications.filter(
      (a) =>
        a.status !== "selected" &&
        a.status !== "rejected" &&
        a.status !== "withdrawn"
    ).length,
    technicalRound: allApplications.filter(
      (a) =>
        a.status === "technical interview 1" ||
        a.status === "technical interview 2"
    ).length,
    selected: allApplications.filter((a) => a.status === "selected").length,
    rejected: allApplications.filter((a) => a.status === "rejected").length,
    withdrawn: allApplications.filter((a) => a.status === "withdrawn").length,
  };

  return (
    <div className="container">
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

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="summary-panel">
            <div className="summary-panel-header">
              <h3>Application Summary</h3>
              <p>Quick view of your pipeline</p>
            </div>

            <div className="summary-list">
              <button
                className={`summary-item summary-item-button ${
                  statusFilter === "applied" ? "summary-item-active" : ""
                }`}
                onClick={() => handleStatusFilter("applied")}
                type="button"
              >
                <div className="summary-item-text">
                  <span className="summary-label">Applied</span>
                  <span className="summary-hint">Active opportunities</span>
                </div>
                <span className="summary-value">{summaryStats.applied}</span>
              </button>

              <div className="summary-item">
                <div className="summary-item-text">
                  <span className="summary-label">Technical Round</span>
                  <span className="summary-hint">
                    Round 1 + Round 2 combined
                  </span>
                </div>
                <span className="summary-value">
                  {summaryStats.technicalRound}
                </span>
              </div>

              <button
                className={`summary-item summary-item-button ${
                  statusFilter === "selected" ? "summary-item-active" : ""
                }`}
                onClick={() => handleStatusFilter("selected")}
                type="button"
              >
                <div className="summary-item-text">
                  <span className="summary-label">Selected</span>
                  <span className="summary-hint">Final successful outcomes</span>
                </div>
                <span className="summary-value">{summaryStats.selected}</span>
              </button>

              <button
                className={`summary-item summary-item-button ${
                  statusFilter === "rejected" ? "summary-item-active" : ""
                }`}
                onClick={() => handleStatusFilter("rejected")}
                type="button"
              >
                <div className="summary-item-text">
                  <span className="summary-label">Rejected</span>
                  <span className="summary-hint">Applications closed</span>
                </div>
                <span className="summary-value">{summaryStats.rejected}</span>
              </button>

              <div className="summary-item">
                <div className="summary-item-text">
                  <span className="summary-label">Withdrawn</span>
                  <span className="summary-hint">Applications you dropped</span>
                </div>
                <span className="summary-value">{summaryStats.withdrawn}</span>
              </div>
            </div>

            <div className="summary-filter-actions">
              <button
                type="button"
                className={`filter-chip ${
                  statusFilter === "applied" ? "filter-chip-active" : ""
                }`}
                onClick={() => handleStatusFilter("applied")}
              >
                Applied
              </button>

              <button
                type="button"
                className={`filter-chip ${
                  statusFilter === "selected" ? "filter-chip-active" : ""
                }`}
                onClick={() => handleStatusFilter("selected")}
              >
                Selected
              </button>

              <button
                type="button"
                className={`filter-chip ${
                  statusFilter === "rejected" ? "filter-chip-active" : ""
                }`}
                onClick={() => handleStatusFilter("rejected")}
              >
                Rejected
              </button>
            </div>

            {(statusFilter || searchTerm || sortOption !== "newest") && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        </aside>

        <section className="dashboard-main">
          <div className="toolbar-card">
            <div className="toolbar">
              <input
                type="text"
                className="search-input"
                placeholder="Search by company, role, or location"
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

          {message && <div className="message">{message}</div>}

          <div className="table-card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-row">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    applications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.company_name}</td>
                        <td>{application.job_role}</td>
                        <td>{application.location || "-"}</td>
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
        </section>
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