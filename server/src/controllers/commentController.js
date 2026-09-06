const Comment = require("../models/comment");
const Issue = require("../models/issue");
const createActivity = require("../utils/activityLogger");

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { projectId, issueId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const issue = await Issue.findOne({
      _id: issueId,
      project: projectId,
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const comment = await Comment.create({
      issue: issueId,
      author: req.user.userId,
      content: content.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email");

    await createActivity({
      project: projectId,
      issue: issueId,
      user: req.user.userId,
      action: "COMMENT_ADDED",
      metadata: {
        commentId: comment._id,
      },
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);

    res.status(500).json({
      message: "Server error while adding comment",
    });
  }
};

// GET COMMENTS
const getComments = async (req, res) => {
  try {
    const { projectId, issueId } = req.params;

    const issue = await Issue.findOne({
      _id: issueId,
      project: projectId,
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    const comments = await Comment.find({
      issue: issueId,
    })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Server error while fetching comments",
    });
  }
};

module.exports = {
  addComment,
  getComments,
};