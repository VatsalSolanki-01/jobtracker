import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    job_role: "",
    status: "applied",
  });

  const statusOptions = [
    "applied",
    "interview scheduled",
    "interview done",
    "selected",
    "rejected",
  ];

  const loadApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load applications");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addApplication = async (e) => {
    e.preventDefault();

    try {
      await api.post("/applications", form);

      setForm({
        company_name: "",
        job_role: "",
        status: "applied",
      });

      setShowModal(false);
      setMessage("Application added successfully");

      loadApplications();
    } catch (error) {
      console.error(error);
      setMessage("Failed to add application");
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      setMessage("Application deleted successfully");
      loadApplications();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete application");
    }
  };

  const updateStatus = async (application) => {
    const currentIndex = statusOptions.indexOf(application.status);

    if (currentIndex === -1 || currentIndex === statusOptions.length - 1) {
      return;
    }

    const nextStatus = statusOptions[currentIndex + 1];

    try {
      await api.put(`/applications/${application.id}`, {
        ...application,
        status: nextStatus,
      });

      setMessage("Status updated successfully");
      loadApplications();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update application");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Job Tracker Dashboard</h1>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          Add Application
        </button>
      </div>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

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
                    onClick={() => updateStatus(application)}
                  >
                    Next Status
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
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Application</h2>

            <form onSubmit={addApplication}>
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={form.company_name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="job_role"
                placeholder="Job Role"
                value={form.job_role}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="submit">
                  Save
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}