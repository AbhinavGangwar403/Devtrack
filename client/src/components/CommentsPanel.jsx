import { useEffect, useState } from "react";
import {
  addComment,
  getComments,
} from "../services/commentService";

const CommentsPanel = ({ projectId, issueId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);

      const data = await getComments(
        projectId,
        issueId
      );

      setComments(data.comments || data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load comments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [projectId, issueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setPosting(true);
      setError("");

      const data = await addComment(
        projectId,
        issueId,
        content.trim()
      );

      const newComment =
        data.comment || data;

      setComments((prev) => [
        ...prev,
        newComment,
      ]);

      setContent("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add comment."
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">
        Comments
      </h2>

      {error && (
        <div className="mt-4 rounded-lg bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-5"
      >
        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          rows="3"
          placeholder="Write a comment..."
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={
              posting || !content.trim()
            }
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {posting
              ? "Posting..."
              : "Add Comment"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-lg bg-slate-800 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {comment.author?.name ||
                    "Unknown user"}
                </p>

                <p className="text-xs text-slate-500">
                  {comment.createdAt
                    ? new Date(
                        comment.createdAt
                      ).toLocaleString()
                    : ""}
                </p>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsPanel;