import { useEffect, useState } from "react";
import { getProjectActivities } from "../services/activityService";

const formatAction = (action) => {
  if (!action) return "";

  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
};

const ActivityPanel = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data =
          await getProjectActivities(projectId);

        setActivities(data.activities || data);
      } catch (error) {
        console.error(
          "Failed to load activities:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [projectId]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">
        Recent Activity
      </h2>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">
          Loading activity...
        </p>
      ) : activities.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No activity yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex gap-4 border-b border-slate-800 pb-4 last:border-0"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-sm font-bold text-blue-500">
                {activity.user?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">
                    {activity.user?.name ||
                      "Unknown user"}
                  </span>{" "}
                  {formatAction(activity.action)}
                </p>

                {activity.issue?.title && (
                  <p className="mt-1 text-sm text-slate-500">
                    Issue: {activity.issue.title}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-600">
                  {activity.createdAt
                    ? new Date(
                        activity.createdAt
                      ).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityPanel;