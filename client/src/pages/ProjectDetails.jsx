import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

import {
  getIssues,
  createIssue,
} from "../services/issueService";

import IssueCard from "../components/IssueCard";
import IssueForm from "../components/IssueForm";
import MembersPanel from "../components/MembersPanel";
import ActivityPanel from "../components/ActivityPanel";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);

  const [activeTab, setActiveTab] =
    useState("overview");

  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [showIssueForm, setShowIssueForm] =
    useState(false);

  const [showEditProject, setShowEditProject] =
    useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProject(projectId);

      const projectData =
        data.project || data;

      setProject(projectData);

      setProjectForm({
        name: projectData.name || "",
        description:
          projectData.description || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      setIssuesLoading(true);

      const params = {};

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.priority) {
        params.priority = filters.priority;
      }

      const data = await getIssues(
        projectId,
        params
      );

      setIssues(data.issues || data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load issues."
      );
    } finally {
      setIssuesLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (activeTab === "issues") {
      fetchIssues();
    }
  }, [
    activeTab,
    projectId,
    filters.search,
    filters.status,
    filters.priority,
  ]);

  const currentMember = project?.members?.find(
    (member) => {
      const memberId =
        member.user?._id || member.user;

      return memberId === user?._id;
    }
  );

  const currentUserRole =
    currentMember?.role || "MEMBER";

  const canManageProject =
    currentUserRole === "OWNER" ||
    currentUserRole === "ADMIN";

  const canDeleteProject =
    currentUserRole === "OWNER";

  const canAssignIssues =
    currentUserRole === "OWNER" ||
    currentUserRole === "ADMIN";

  const handleCreateIssue = async (
    issueData
  ) => {
    try {
      setError("");

      await createIssue(
        projectId,
        issueData
      );

      setShowIssueForm(false);
      setActiveTab("issues");

      await fetchIssues();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const data = await updateProject(
        projectId,
        projectForm
      );

      setProject(
        data.project || data
      );

      setShowEditProject(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update project."
      );
    }
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteProject(projectId);

      window.location.href = "/projects";
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">
          Loading project...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-slate-400">
          Project not found.
        </p>
      </div>
    );
  }

  const openIssues = issues.filter(
    (issue) => issue.status !== "DONE"
  ).length;

  const completedIssues = issues.filter(
    (issue) => issue.status === "DONE"
  ).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          to="/projects"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to projects
        </Link>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-3xl font-bold text-blue-500">
              {project.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">
                  {project.name}
                </h1>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                  {currentUserRole}
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-slate-400">
                {project.description ||
                  "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {canManageProject && (
              <button
                onClick={() =>
                  setShowEditProject(
                    !showEditProject
                  )
                }
                className="rounded-lg border border-slate-700 px-5 py-3 font-medium text-slate-300 hover:bg-slate-800"
              >
                Edit Project
              </button>
            )}

            {canDeleteProject && (
              <button
                onClick={handleDeleteProject}
                className="rounded-lg border border-red-900 px-5 py-3 font-medium text-red-400 hover:bg-red-950/40"
              >
                Delete
              </button>
            )}

            <button
              onClick={() =>
                setShowIssueForm(true)
              }
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              + Create Issue
            </button>
          </div>
        </div>

        {/* Edit Project */}
        {showEditProject && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Edit Project
            </h2>

            <form
              onSubmit={handleUpdateProject}
              className="mt-5 space-y-5"
            >
              <input
                type="text"
                required
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <textarea
                rows="4"
                value={
                  projectForm.description
                }
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description:
                      e.target.value,
                  })
                }
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowEditProject(false)
                  }
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Members
            </p>

            <p className="mt-2 text-3xl font-bold">
              {project.members?.length || 0}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Open Issues
            </p>

            <p className="mt-2 text-3xl font-bold">
              {openIssues}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedIssues}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 overflow-x-auto border-b border-slate-800">
          <div className="flex min-w-max gap-7">
            {[
              ["overview", "Overview"],
              ["issues", "Issues"],
              ["members", "Members"],
              ["activity", "Activity"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  setActiveTab(value)
                }
                className={`border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeTab === value
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Create Issue Modal */}
        {showIssueForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Create Issue
                </h2>

                <button
                  onClick={() =>
                    setShowIssueForm(false)
                  }
                  className="text-2xl text-slate-500 hover:text-white"
                >
                  ×
                </button>
              </div>

              <IssueForm
                members={project.members}
                canAssign={canAssignIssues}
                onSubmit={handleCreateIssue}
                onCancel={() =>
                  setShowIssueForm(false)
                }
                submitLabel="Create Issue"
              />
            </div>
          </div>
        )}

        {/* Tab content */}
        <div className="mt-8">

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                  Project Overview
                </h2>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                  {project.description ||
                    "This project doesn't have a description yet."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold">
                  Quick Actions
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() =>
                      setShowIssueForm(true)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-700"
                  >
                    Create Issue
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab("members")
                    }
                    className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    View Members
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab("issues")
                    }
                    className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    View Issues
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab("activity")
                    }
                    className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    View Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Issues */}
          {activeTab === "issues" && (
            <div>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search issues..."
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                />

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">
                    All Statuses
                  </option>
                  <option value="TODO">
                    To Do
                  </option>
                  <option value="IN_PROGRESS">
                    In Progress
                  </option>
                  <option value="REVIEW">
                    Review
                  </option>
                  <option value="DONE">
                    Done
                  </option>
                </select>

                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">
                    All Priorities
                  </option>
                  <option value="LOW">
                    Low
                  </option>
                  <option value="MEDIUM">
                    Medium
                  </option>
                  <option value="HIGH">
                    High
                  </option>
                  <option value="URGENT">
                    Urgent
                  </option>
                </select>
              </div>

              {issuesLoading ? (
                <div className="py-20 text-center text-slate-500">
                  Loading issues...
                </div>
              ) : issues.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
                  <h2 className="text-xl font-semibold">
                    No issues found
                  </h2>

                  <p className="mt-2 text-slate-500">
                    Create an issue or change your filters.
                  </p>

                  <button
                    onClick={() =>
                      setShowIssueForm(true)
                    }
                    className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium hover:bg-blue-700"
                  >
                    + Create Issue
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {issues.map((issue) => (
                    <IssueCard
                      key={issue._id}
                      issue={issue}
                      projectId={projectId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Members */}
          {activeTab === "members" && (
            <MembersPanel
              projectId={projectId}
              project={project}
              setProject={setProject}
              currentUserId={user?._id}
              currentUserRole={currentUserRole}
            />
          )}

          {/* Activity */}
          {activeTab === "activity" && (
            <ActivityPanel
              projectId={projectId}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;