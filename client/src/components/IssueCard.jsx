import { Link } from "react-router-dom";

const priorityStyles = {
  LOW: "bg-slate-800 text-slate-300",
  MEDIUM: "bg-blue-900/40 text-blue-400",
  HIGH: "bg-orange-900/40 text-orange-400",
  URGENT: "bg-red-900/40 text-red-400",
};

const statusStyles = {
  TODO: "bg-slate-800 text-slate-300",
  IN_PROGRESS: "bg-blue-900/40 text-blue-400",
  REVIEW: "bg-purple-900/40 text-purple-400",
  DONE: "bg-green-900/40 text-green-400",
};

const IssueCard = ({ issue, projectId }) => {
  return (
    <Link
      to={`/projects/${projectId}/issues/${issue._id}`}
      className="block rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-slate-800"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            #{issue._id?.slice(-6)}
          </p>

          <h3 className="mt-1 truncate text-lg font-semibold text-white">
            {issue.title}
          </h3>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            priorityStyles[issue.priority] ||
            priorityStyles.MEDIUM
          }`}
        >
          {issue.priority}
        </span>
      </div>

      {issue.description && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-400">
          {issue.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[issue.status] ||
            statusStyles.TODO
          }`}
        >
          {issue.status.replace("_", " ")}
        </span>

        <div className="text-right">
          {issue.assignee ? (
            <p className="text-xs text-slate-400">
              Assigned to{" "}
              <span className="text-slate-200">
                {issue.assignee.name}
              </span>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Unassigned
            </p>
          )}
        </div>
      </div>

      {issue.labels?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {issue.labels.map((label) => (
            <span
              key={label}
              className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-400"
            >
              #{label}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default IssueCard;