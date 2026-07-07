import { useEffect, useState } from "react";
import { api } from "../api";
import ApplicationModal from "./ApplicationModal";

export default function Dashboard({ user, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    job_role: "",
    status: "applied",
  });

  const loadApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error || "Failed to load applications";

      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const openAddModal = () => {
    setEditingApplication(null);
    setForm({
      company_name: "",
      job_role: "",
      status: "applied",
    });
    setShowModal(true);
  };

  const openEditModal = (application) => {
    setEditingApplication(application);

    setForm({
      company_name: application.company_name,
      job_role: application.job_role,
      status: application.status,
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
    });
  };

  const saveApplication = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      company_name: form.company_name.trim(),
      job_role: form.job_role.trim(),
      status: form.status,
    };

    if (!payload.company_name || !payload.job_role || !payload.status) {
      setMessage("Company name, job role, and status are required");
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
      loadApplications();
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
      loadApplications();
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.error || "Failed to delete application";

      setMessage(errorMessage);
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interviewScheduled: applications.filter(
      (a) => a.status === "interview scheduled"
    ).length,
    interviewDone: applications.filter(
      (a) => a.status === "interview done"
    ).length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Job Tracker Dashboard</h1>
          <p className="welcome-text">Welcome, {user.name}</p>
        </div>

        <div className="header-actions">
          <button className="add-btn" onClick={openAddModal}>
            Add Application
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Applications</p>
        </div>

        <div className="stat-card">
          <h3>{stats.applied}</h3>
          <p>Applied</p>
        </div>

        <div className="stat-card">
          <h3>{stats.interviewScheduled}</h3>
          <p>Interview Scheduled</p>
        </div>

        <div className="stat-card">
          <h3>{stats.interviewDone}</h3>
          <p>Interview Done</p>
        </div>

        <div className="stat-card">
          <h3>{stats.selected}</h3>
          <p>Selected</p>
        </div>

        <div className="stat-card">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-row">
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr key={application.id}>
                <td>{application.company_name}</td>
                <td>{application.job_role}</td>
                <td>{application.status}</td>
                <td>
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