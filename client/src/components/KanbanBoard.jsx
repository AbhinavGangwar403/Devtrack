import { useState } from "react";
import { Link } from "react-router-dom";
import { updateIssue } from "../services/issueService";

const columns = [
  {
    id: "TODO",
    title: "To Do",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
  },
  {
    id: "REVIEW",
    title: "Review",
  },
  {
    id: "DONE",
    title: "Done",
  },
];

const priorityStyles = {
  LOW: "bg-slate-800 text-slate-300",
  MEDIUM: "bg-blue-900/40 text-blue-400",
  HIGH: "bg-orange-900/40 text-orange-400",
  URGENT: "bg-red-900/40 text-red-400",
};

const KanbanBoard = ({
  projectId,
  issues,
  setIssues,
}) => {
  const [draggedIssue, setDraggedIssue] =
    useState(null);

  const [dragOverColumn, setDragOverColumn] =
    useState(null);

  const [updatingIssue, setUpdatingIssue] =
    useState(null);

  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);

    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData(
      "text/plain",
      issue._id
    );
  };

  const handleDragEnd = () => {
    setDraggedIssue(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    setDragOverColumn(columnId);
  };

  const handleDrop = async (
    e,
    newStatus
  ) => {
    e.preventDefault();

    setDragOverColumn(null);

    if (!draggedIssue) {
      return;
    }

    if (draggedIssue.status === newStatus) {
      setDraggedIssue(null);
      return;
    }

    const issueId = draggedIssue._id;
    const previousStatus =
      draggedIssue.status;

    // Optimistic UI update
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue._id === issueId
          ? {
              ...issue,
              status: newStatus,
            }
          : issue
      )
    );

    setUpdatingIssue(issueId);

    try {
      const response = await updateIssue(
        projectId,
        issueId,
        {
          status: newStatus,
        }
      );

      const updatedIssue =
        response.issue || response;

      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === issueId
            ? updatedIssue
            : issue
        )
      );
    } catch (error) {
      // Rollback if API fails
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === issueId
            ? {
                ...issue,
                status: previousStatus,
              }
            : issue
        )
      );

      console.error(
        "Failed to update issue status:",
        error
      );
    } finally {
      setUpdatingIssue(null);
      setDraggedIssue(null);
    }
  };

  const handleStatusChange = async (
    issue,
    newStatus
  ) => {
    if (issue.status === newStatus) {
      return;
    }

    const previousStatus =
      issue.status;

    setIssues((prevIssues) =>
      prevIssues.map((item) =>
        item._id === issue._id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    setUpdatingIssue(issue._id);

    try {
      const response = await updateIssue(
        projectId,
        issue._id,
        {
          status: newStatus,
        }
      );

      const updatedIssue =
        response.issue || response;

      setIssues((prevIssues) =>
        prevIssues.map((item) =>
          item._id === issue._id
            ? updatedIssue
            : item
        )
      );
    } catch (error) {
      setIssues((prevIssues) =>
        prevIssues.map((item) =>
          item._id === issue._id
            ? {
                ...item,
                status: previousStatus,
              }
            : item
        )
      );

      console.error(
        "Failed to update issue status:",
        error
      );
    } finally {
      setUpdatingIssue(null);
    }
  };

  return (
    <div className="grid min-h-[500px] gap-5 overflow-x-auto pb-4 xl:grid-cols-4">
      {columns.map((column) => {
        const columnIssues = issues.filter(
          (issue) =>
            issue.status === column.id
        );

        const isDropTarget =
          dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) =>
              handleDragOver(
                e,
                column.id
              )
            }
            onDragLeave={() =>
              setDragOverColumn(null)
            }
            onDrop={(e) =>
              handleDrop(
                e,
                column.id
              )
            }
            className={`flex min-h-[500px] min-w-[280px] flex-col rounded-xl border p-4 transition ${
              isDropTarget
                ? "border-blue-500 bg-blue-950/20"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            {/* Column header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">
                  {column.title}
                </h2>

                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {columnIssues.length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-1 flex-col gap-3">
              {columnIssues.map(
                (issue) => (
                  <div
                    key={issue._id}
                    draggable={
                      updatingIssue !==
                      issue._id
                    }
                    onDragStart={(e) =>
                      handleDragStart(
                        e,
                        issue
                      )
                    }
                    onDragEnd={
                      handleDragEnd
                    }
                    className={`group rounded-lg border border-slate-800 bg-slate-950 p-4 shadow-sm transition ${
                      updatingIssue ===
                      issue._id
                        ? "cursor-wait opacity-60"
                        : "cursor-grab hover:-translate-y-0.5 hover:border-blue-500/50 active:cursor-grabbing"
                    }`}
                  >
                    {/* Issue link */}
                    <Link
                      to={`/projects/${projectId}/issues/${issue._id}`}
                      className="block"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-600">
                            #
                            {issue._id?.slice(
                              -6
                            )}
                          </p>

                          <h3 className="mt-1 line-clamp-2 font-medium text-white group-hover:text-blue-400">
                            {issue.title}
                          </h3>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                            priorityStyles[
                              issue.priority
                            ] ||
                            priorityStyles.MEDIUM
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </div>

                      {issue.description && (
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                          {
                            issue.description
                          }
                        </p>
                      )}
                    </Link>

                    {/* Assignee */}
                    <div className="mt-4 flex items-center justify-between">
                      {issue.assignee ? (
                        <span className="truncate text-xs text-slate-500">
                          {issue.assignee.name}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">
                          Unassigned
                        </span>
                      )}

                      {updatingIssue ===
                        issue._id && (
                        <span className="text-[10px] text-blue-400">
                          Updating...
                        </span>
                      )}
                    </div>

                    {/* Labels */}
                    {issue.labels?.length >
                      0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {issue.labels
                          .slice(0, 3)
                          .map(
                            (label) => (
                              <span
                                key={
                                  label
                                }
                                className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-500"
                              >
                                #
                                {label}
                              </span>
                            )
                          )}
                      </div>
                    )}

                    {/* Status selector */}
                    <div className="mt-4 border-t border-slate-800 pt-3">
                      <select
                        value={
                          issue.status
                        }
                        disabled={
                          updatingIssue ===
                          issue._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            issue,
                            e.target.value
                          )
                        }
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                        className="w-full rounded-md border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-slate-400 outline-none focus:border-blue-500"
                      >
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
                    </div>
                  </div>
                )
              )}

              {/* Empty column */}
              {columnIssues.length ===
                0 && (
                <div
                  className={`flex flex-1 items-center justify-center rounded-lg border border-dashed p-6 text-center transition ${
                    isDropTarget
                      ? "border-blue-500 bg-blue-950/20"
                      : "border-slate-800"
                  }`}
                >
                  <p className="text-xs text-slate-600">
                    Drop issues here
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;