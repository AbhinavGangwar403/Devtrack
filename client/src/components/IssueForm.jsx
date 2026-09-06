import { useEffect, useState } from "react";

const IssueForm = ({
  initialData,
  members = [],
  canAssign = false,
  onSubmit,
  onCancel,
  submitLabel = "Create Issue",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    assignee: "",
    labels: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "MEDIUM",
        status: initialData.status || "TODO",
        assignee:
          initialData.assignee?._id ||
          initialData.assignee ||
          "",
        labels: initialData.labels?.join(", ") || "",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate)
              .toISOString()
              .split("T")[0]
          : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignee: formData.assignee || null,
        labels: formData.labels
          .split(",")
          .map((label) => label.trim())
          .filter(Boolean),
        dueDate: formData.dueDate || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Title
        </label>

        <input
          type="text"
          name="title"
          required
          maxLength={200}
          value={formData.title}
          onChange={handleChange}
          placeholder="Describe the issue"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Description
        </label>

        <textarea
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain the issue..."
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Priority / Status */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Priority
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">
              In Progress
            </option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      {/* Assignee */}
      {canAssign && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Assignee
          </label>

          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="">
              Unassigned
            </option>

            {members.map((member) => {
              const memberUser = member.user;

              return (
                <option
                  key={memberUser?._id || memberUser}
                  value={memberUser?._id || memberUser}
                >
                  {memberUser?.name || "Member"}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Labels */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Labels
        </label>

        <input
          type="text"
          name="labels"
          value={formData.labels}
          onChange={handleChange}
          placeholder="bug, frontend, urgent"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <p className="mt-1 text-xs text-slate-500">
          Separate labels with commas.
        </p>
      </div>

      {/* Due date */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Due date
        </label>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default IssueForm;