// Project analytics summary and breakdowns.

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

const priorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const AnalyticsPanel = ({
  analytics,
}) => {
  if (!analytics) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-500">
        Loading analytics...
      </div>
    );
  }

  const {
    summary,
    byStatus,
    byPriority,
  } = analytics;

  const statusMap =
    Object.fromEntries(
      byStatus.map((item) => [
        item._id,
        item.count,
      ])
    );

  const priorityMap =
    Object.fromEntries(
      byPriority.map((item) => [
        item._id,
        item.count,
      ])
    );

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">
            Total Issues
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {summary.total}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {summary.completed}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-500">
            Completion Rate
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            {summary.completionPercentage}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-lg font-semibold text-white">
            Issues by Status
          </h2>

          <div className="space-y-4">
            {Object.entries(
              statusLabels
            ).map(
              ([status, label]) => {
                const count =
                  statusMap[status] ||
                  0;

                const percentage =
                  summary.total === 0
                    ? 0
                    : (count /
                        summary.total) *
                      100;

                return (
                  <div key={status}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">
                        {label}
                      </span>

                      <span className="text-white">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-lg font-semibold text-white">
            Issues by Priority
          </h2>

          <div className="space-y-4">
            {Object.entries(
              priorityLabels
            ).map(
              ([priority, label]) => {
                const count =
                  priorityMap[
                    priority
                  ] || 0;

                const percentage =
                  summary.total === 0
                    ? 0
                    : (count /
                        summary.total) *
                      100;

                return (
                  <div key={priority}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">
                        {label}
                      </span>

                      <span className="text-white">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;