import { useState } from "react";
import {
  addMember,
  removeMember,
  updateMemberRole,
} from "../services/memberService";

const MembersPanel = ({
  projectId,
  project,
  setProject,
  currentUserId,
  currentUserRole,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canManageMembers =
    currentUserRole === "OWNER" ||
    currentUserRole === "ADMIN";

  const isOwner =
    currentUserRole === "OWNER";

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await addMember(
        projectId,
        {
          email,
          role,
        }
      );

      const updatedProject =
        data.project || data;

      if (updatedProject.members) {
        setProject(updatedProject);
      }

      setEmail("");
      setRole("MEMBER");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add member."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (
      !window.confirm(
        "Remove this member from the project?"
      )
    ) {
      return;
    }

    try {
      setError("");

      const data = await removeMember(
        projectId,
        userId
      );

      const updatedProject =
        data.project || data;

      if (updatedProject.members) {
        setProject(updatedProject);
      } else {
        setProject((prev) => ({
          ...prev,
          members: prev.members.filter(
            (member) =>
              (member.user?._id || member.user) !==
              userId
          ),
        }));
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to remove member."
      );
    }
  };

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      setError("");

      const data = await updateMemberRole(
        projectId,
        userId,
        newRole
      );

      const updatedProject =
        data.project || data;

      if (updatedProject.members) {
        setProject(updatedProject);
      } else {
        setProject((prev) => ({
          ...prev,
          members: prev.members.map(
            (member) => {
              const id =
                member.user?._id ||
                member.user;

              return id === userId
                ? {
                    ...member,
                    role: newRole,
                  }
                : member;
            }
          ),
        }));
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update role."
      );
    }
  };

  return (
    <div className="space-y-6">
      {canManageMembers && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Add Member
          </h2>

          {error && (
            <div className="mt-4 rounded-lg bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleAdd}
            className="mt-5 grid gap-4 md:grid-cols-[1fr_180px_auto]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="member@example.com"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="MEMBER">
                Member
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Adding..."
                : "Add Member"}
            </button>
          </form>
        </div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Project Members
          </h2>

          <span className="text-sm text-slate-500">
            {project.members?.length || 0} members
          </span>
        </div>

        {error && !canManageMembers && (
          <div className="mt-4 rounded-lg bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {project.members?.map((member) => {
            const memberUser = member.user;

            const memberId =
              memberUser?._id || memberUser;

            const isCurrentUser =
              memberId === currentUserId;

            return (
              <div
                key={memberId}
                className="flex flex-col gap-4 rounded-lg bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 font-semibold text-blue-500">
                    {memberUser?.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="font-medium">
                      {memberUser?.name ||
                        "Unknown user"}

                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-400">
                          You
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-slate-500">
                      {memberUser?.email || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isOwner &&
                  member.role !== "OWNER" ? (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(
                          memberId,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                      <option value="MEMBER">
                        MEMBER
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>
                    </select>
                  ) : (
                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300">
                      {member.role}
                    </span>
                  )}

                  {canManageMembers &&
                    member.role !== "OWNER" &&
                    memberId !== currentUserId && (
                      <button
                        onClick={() =>
                          handleRemove(memberId)
                        }
                        className="rounded-lg border border-red-900 px-3 py-2 text-xs text-red-400 hover:bg-red-950/40"
                      >
                        Remove
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembersPanel;