import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../services/projectService";
import { getIssues } from "../services/issueService";

import AnalyticsPanel from "../components/AnalyticsPanel";
import { getProjectAnalytics } from "../services/analyticsService";

import socket from "../services/socket";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);

  const [analytics, setAnalytics] = useState(null);
  const [selectedProjectId, setSelectedProjectId] =
    useState("");

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const projectData = await getProjects();

      const projectList =
        projectData.projects ||
        projectData ||
        [];

      setProjects(projectList);

      // Select the first project for dashboard analytics
      if (projectList.length > 0) {
        setSelectedProjectId(
          projectList[0]._id
        );
      }

      const issueResults = [];

      for (const project of projectList.slice(0, 5)) {
        try {
          const issueData = await getIssues(
            project._id,
            {
              limit: 5,
            }
          );

          const issues =
            issueData.issues ||
            issueData ||
            [];

          issueResults.push(
            ...issues.map((issue) => ({
              ...issue,
              projectName: project.name,
            }))
          );
        } catch {
          // Ignore individual project failures
        }
      }

      setRecentIssues(
        issueResults.slice(0, 8)
      );
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load analytics for selected project
   */
  const loadAnalytics = async () => {
    if (!selectedProjectId) {
      return;
    }

    try {
      const data =
        await getProjectAnalytics(
          selectedProjectId
        );

      setAnalytics(data);
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );

      setAnalytics(null);
    }
  };

  /*
   * Load dashboard data
   */
  useEffect(() => {
    fetchDashboard();
  }, []);

  /*
   * Load analytics whenever
   * selected project changes
   */
  useEffect(() => {
    loadAnalytics();
  }, [selectedProjectId]);

  /*
   * Refresh analytics when
   * issues change in real time
   */
  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    const refreshAnalytics = () => {
      loadAnalytics();
    };

    socket.on(
      "issue-created",
      refreshAnalytics
    );

    socket.on(
      "issue-updated",
      refreshAnalytics
    );

    socket.on(
      "issue-deleted",
      refreshAnalytics
    );

    return () => {
      socket.off(
        "issue-created",
        refreshAnalytics
      );

      socket.off(
        "issue-updated",
        refreshAnalytics
      );

      socket.off(
        "issue-deleted",
        refreshAnalytics
      );
    };
  }, [selectedProjectId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const completed = recentIssues.filter(
    (issue) => issue.status === "DONE"
  ).length;

  const open = recentIssues.filter(
    (issue) => issue.status !== "DONE"
  ).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-1 text-slate-400">
            Overview of your development work.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Projects
            </p>

            <p className="mt-2 text-4xl font-bold">
              {projects.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Open Issues
            </p>

            <p className="mt-2 text-4xl font-bold">
              {open}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-4xl font-bold">
              {completed}
            </p>
          </div>

        </div>

        {/* Analytics */}
        {projects.length > 0 && (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Project Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  View analytics for a project.
                </p>
              </div>

              <select
                value={selectedProjectId}
                onChange={(event) =>
                  setSelectedProjectId(
                    event.target.value
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
              >
                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

            </div>

            {analytics ? (
              <AnalyticsPanel
                analytics={analytics}
              />
            ) : (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading analytics...
              </p>
            )}

          </div>
        )}

        {/* Projects */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Your Projects
            </h2>

            <Link
              to="/projects"
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              View all →
            </Link>

          </div>

          {projects.length === 0 ? (
            <div className="py-10 text-center">

              <p className="text-slate-500">
                No projects yet.
              </p>

              <Link
                to="/projects"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium hover:bg-blue-700"
              >
                Create Project
              </Link>

            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {projects
                .slice(0, 6)
                .map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="rounded-lg bg-slate-800 p-4 transition hover:bg-slate-700"
                  >
                    <h3 className="font-semibold">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {project.members?.length ||
                        0}{" "}
                      members
                    </p>
                  </Link>
                ))}

            </div>
          )}

        </div>

        {/* Recent Issues */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-semibold">
            Recent Issues
          </h2>

          {recentIssues.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No issues yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">

              {recentIssues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/projects/${issue.project}/issues/${issue._id}`}
                  className="flex flex-col gap-2 rounded-lg bg-slate-800 p-4 transition hover:bg-slate-700 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>
                    <p className="font-medium">
                      {issue.title}
                    </p>

                    <p className="text-xs text-slate-500">
                      {issue.projectName}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {issue.status?.replace(
                        "_",
                        " "
                      )}
                    </span>

                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {issue.priority}
                    </span>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;