const APPLICATION_STATUSES = [
  "applied",
  "hr screening",
  "technical interview 1",
  "technical interview 2",
  "final/offer discussion",
  "selected",
  "rejected",
  "withdrawn",
];

export default function ApplicationModal({
  form,
  setForm,
  editingApplication,
  onSubmit,
  onClose,
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editingApplication ? "Edit Application" : "Add Application"}</h2>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Company Name"
            value={form.company_name}
            onChange={(e) =>
              setForm({ ...form, company_name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Job Role"
            value={form.job_role}
            onChange={(e) => setForm({ ...form, job_role: e.target.value })}
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="date-field-group">
            <label htmlFor="applied-date">Application Date</label>
            <input
              id="applied-date"
              type="date"
              max={today}
              value={form.applied_date}
              onChange={(e) =>
                setForm({ ...form, applied_date: e.target.value })
              }
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              {editingApplication ? "Update" : "Save"}
            </button>

            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}