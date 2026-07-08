function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ApplicationModal({
  form,
  setForm,
  editingApplication,
  onSubmit,
  onClose,
}) {
  const today = getTodayDate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {editingApplication ? "Edit Application" : "Add Application"}
        </h2>

        <form onSubmit={onSubmit}>
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
            <option value="applied">applied</option>
            <option value="interview scheduled">interview scheduled</option>
            <option value="interview done">interview done</option>
            <option value="selected">selected</option>
            <option value="rejected">rejected</option>
          </select>

          <input
            type="date"
            name="applied_date"
            value={form.applied_date}
            onChange={handleChange}
            max={today}
            required
          />

          <div className="modal-actions">
            <button type="submit">
              {editingApplication ? "Update" : "Save"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}