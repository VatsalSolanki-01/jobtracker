import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    company_name: "",
    job_role: "",
    status: ""
  });

  const loadData = async () => {
    const res = await api.get("/applications");
    setApplications(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addApplication = async (e) => {
    e.preventDefault();
    await api.post("/applications", form);
    setForm({ company_name: "", job_role: "", status: "" });
    loadData();
  };

  const deleteApp = async (id) => {
    await api.delete(`/applications/${id}`);
    loadData();
  };

  const updateStatus = async (app) => {
    const status = prompt("Enter status", app.status);
    if (!status) return;

    await api.put(`/applications/${app.id}`, {
      ...app,
      status
    });

    loadData();
  };

  return (
    <div className="container">
      <h2>Job Tracker</h2>

      <form onSubmit={addApplication}>
        <input
          name="company_name"
          placeholder="Company"
          value={form.company_name}
          onChange={handleChange}
        />

        <input
          name="job_role"
          placeholder="Role"
          value={form.job_role}
          onChange={handleChange}
        />

        <input
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
        />

        <button type="submit">Add</button>
      </form>

      <div>
        {applications.map((app) => (
          <div key={app.id} className="card">
            <p>{app.company_name}</p>
            <p>{app.job_role}</p>
            <p>{app.status}</p>

            <button onClick={() => updateStatus(app)}>Update</button>
            <button onClick={() => deleteApp(app.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}