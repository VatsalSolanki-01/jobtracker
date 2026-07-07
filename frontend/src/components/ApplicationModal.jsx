export default function ApplicationModal({
  form,
  setForm,
  editingApplication,
  onSubmit,
  onClose,
}) {
  const statusOptions = [
    "applied",
    "interview scheduled",
    "interview done",
    "selected",
    "rejected",
  ];

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
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit" className="primary-btn">
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