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
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

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

      const errorMessage =
        error.response?.data?.error || "Operation failed";

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

  const totalApplications = applications.length;

  const technicalRoundCount = applications.filter((application) =>
    [
      "technical interview 1",
      "technical interview 2",
      "final/offer discussion",
      "selected",
    ].includes((application.status || "").toLowerCase())
  ).length;

  const selectedCount = applications.filter(
    (application) => (application.status || "").toLowerCase() === "selected"
  ).length;

  const rejectedCount = applications.filter(
    (application) => (application.status || "").toLowerCase() === "rejected"
  ).length;

  const withdrawnCount = applications.filter(
    (application) => (application.status || "").toLowerCase() === "withdrawn"
  ).length;

  const summaryItems = [
    {
      label: "Applied",
      value: totalApplications,
      helper: "Total opportunities tracked",
    },
    {
      label: "Technical Round",
      value: technicalRoundCount,
      helper: "Reached technical/final stage",
    },
    {
      label: "Selected",
      value: selectedCount,
      helper: "Offers converted",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      helper: "Closed by employer",
    },
    {
      label: "Withdrawn",
      value: withdrawnCount,
      helper: "You exited the process",
    },
  ];

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

      {message && <div className="message">{message}</div>}

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h2>Pipeline Summary</h2>
              <p>Quick view of how your applications are progressing</p>
            </div>

            <div className="summary-stack">
              {summaryItems.map((item) => (
                <div className="summary-row" key={item.label}>
                  <div className="summary-row-content">
                    <span className="summary-row-label">{item.label}</span>
                    <span className="summary-row-helper">{item.helper}</span>
                  </div>

                  <div className="summary-row-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="dashboard-main">
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

          <div className="table-card">
            <div className="table-card-header">
              <div>
                <h2>Your Applications</h2>
                <p>{applications.length} records in the current view</p>
              </div>
            </div>

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
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    applications.map((application) => (
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