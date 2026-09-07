// Issue details, editing, comments, and activity.

import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  getProject,
} from "../services/projectService";

import {
  getIssue,
  updateIssue,
  deleteIssue,
  assignIssue,
} from "../services/issueService";

import IssueForm from "../components/IssueForm";
import CommentsPanel from "../components/CommentsPanel";
import ActivityPanel from "../components/ActivityPanel";
import ConfirmModal from "../components/ConfirmModal";
import socket from "../services/socket";

const priorityStyles = {
  LOW: "bg-slate-800 text-slate-300",
  MEDIUM: "bg-blue-900/40 text-blue-400",
  HIGH: "bg-orange-900/40 text-orange-400",
  URGENT: "bg-red-900/40 text-red-400",
};

const IssueDetails = () => {
  const { projectId, issueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [issueData, projectData] =
        await Promise.all([
          getIssue(projectId, issueId),
          getProject(projectId),
        ]);

      setIssue(
        issueData.issue || issueData
      );

      setProject(
        projectData.project ||
          projectData
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load issue."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, issueId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    socket.connect();
    socket.emit("join-project", projectId);

    return () => {
      socket.emit("leave-project", projectId);
      socket.disconnect();
    };
  }, [projectId]);

  const currentMember =
    project?.members?.find(
      (member) =>
        String(
          member.user?._id ||
            member.user
        ) === String(user?._id)
    );

  const role =
    currentMember?.role || "MEMBER";

  const isPrivileged =
    role === "OWNER" ||
    role === "ADMIN";

  const canEdit =
    isPrivileged ||
    issue?.creator?._id === user?._id ||
    issue?.assignee?._id === user?._id;

  const handleUpdate = async (data) => {
    try {
      setError("");

      const response =
        await updateIssue(
          projectId,
          issueId,
          data
        );

      setIssue(
        response.issue || response
      );

      setEditing(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      setError("");

      await deleteIssue(
        projectId,
        issueId
      );

      navigate(
        `/projects/${projectId}`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete issue."
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAssign = async (
    assignee
  ) => {
    try {
      const response =
        await assignIssue(
          projectId,
          issueId,
          assignee
        );

      setIssue(
        response.issue || response
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to assign issue."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">
          Loading issue...
        </p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-slate-400">
          Issue not found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-6xl">

        <Link
          to={`/projects/${projectId}`}
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to project
        </Link>

        {error && (
          <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-500">
                  #{issue._id?.slice(-6)}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    priorityStyles[
                      issue.priority
                    ] ||
                    priorityStyles.MEDIUM
                  }`}
                >
                  {issue.priority}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold">
                {issue.title}
              </h1>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-400">
                {issue.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              {canEdit && (
                <button
                  onClick={() =>
                    setEditing(!editing)
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
                >
                  {editing
                    ? "Cancel"
                    : "Edit"}
                </button>
              )}

              {isPrivileged && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-lg border border-red-900 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs text-slate-500">
                Status
              </p>

              <p className="mt-1 font-medium">
                {issue.status?.replace(
                  "_",
                  " "
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Priority
              </p>

              <p className="mt-1 font-medium">
                {issue.priority}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Created by
              </p>

              <p className="mt-1 font-medium">
                {issue.creator?.name ||
                  "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Assignee
              </p>

              {isPrivileged ? (
                <select
                  value={
                    issue.assignee?._id ||
                    ""
                  }
                  onChange={(e) =>
                    handleAssign(
                      e.target.value ||
                        null
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-white"
                >
                  <option value="">
                    Unassigned
                  </option>

                  {project?.members?.map(
                    (member) => (
                      <option
                        key={
                          member.user?._id ||
                          member.user
                        }
                        value={
                          member.user?._id ||
                          member.user
                        }
                      >
                        {member.user?.name ||
                          "Member"}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <p className="mt-1 font-medium">
                  {issue.assignee?.name ||
                    "Unassigned"}
                </p>
              )}
            </div>
          </div>

          {issue.labels?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {issue.labels.map(
                (label) => (
                  <span
                    key={label}
                    className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-400"
                  >
                    #{label}
                  </span>
                )
              )}
            </div>
          )}
        </div>

        {editing && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Edit Issue
            </h2>

            <IssueForm
              initialData={issue}
              members={project?.members || []}
              canAssign={isPrivileged}
              onSubmit={handleUpdate}
              onCancel={() =>
                setEditing(false)
              }
              submitLabel="Save Changes"
            />
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CommentsPanel
            projectId={projectId}
            issueId={issueId}
          />

          <ActivityPanel
            projectId={projectId}
          />
        </div>

        <ConfirmModal
          open={showDeleteModal}
          title="Delete Issue"
          message="Are you sure you want to delete this issue? This action cannot be undone."
          confirmText="Delete Issue"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );
};

export default IssueDetails;