const Issue = require("../models/issue");
const Project = require("../models/project");
const User = require("../models/user");

// CREATE ISSUE
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      labels,
      dueDate,
      assignee,
    } = req.body;

    const { projectId } = req.params;

    if (!title) {
      return res.status(400).json({
        message: "Issue title is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Verify assignee is a project member
    if (assignee) {
      const isMember = project.members.some(
        (member) =>
          member.user.toString() === assignee
      );

      if (!isMember) {
        return res.status(400).json({
          message: "Assignee must be a project member",
        });
      }
    }

    const issue = await Issue.create({
      title,
      description: description || "",
      project: projectId,
      creator: req.user.userId,
      assignee: assignee || null,
      priority: priority || "MEDIUM",
      labels: labels || [],
      dueDate: dueDate || null,
      status: "TODO",
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate("creator", "name email")
      .populate("assignee", "name email");

    res.status(201).json({
      message: "Issue created successfully",
      issue: populatedIssue,
    });
  } catch (error) {
    console.error("Create issue error:", error);

    res.status(500).json({
      message: "Server error while creating issue",
    });
  }
};


// GET ALL ISSUES FOR A PROJECT
const getIssues = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      search,
      status,
      priority,
      assignee,
      page = 1,
      limit = 10,
    } = req.query;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const query = {
      project: projectId,
    };
    

    // Search
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Assignee filter
    if (assignee) {
      query.assignee = assignee;
    }

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate("creator", "name email")
        .populate("assignee", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Issue.countDocuments(query),
    ]);

    res.status(200).json({
      issues,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get issues error:", error);

    res.status(500).json({
      message: "Server error while fetching issues",
    });
  }
};



// GET SINGLE ISSUE
const getIssue = async (req, res) => {
  try {
    const { projectId, issueId } = req.params;

    const issue = await Issue.findOne({
      _id: issueId,
      project: projectId,
    })
      .populate("creator", "name email")
      .populate("assignee", "name email");

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.status(200).json({
      issue,
    });
  } catch (error) {
    console.error("Get issue error:", error);

    res.status(500).json({
      message: "Server error while fetching issue",
    });
  }
};




// UPDATE ISSUE
const updateIssue = async (req, res) => {
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

    const userId = req.user.userId;
    const userRole = req.projectRole;

    const isPrivileged =
      userRole === "OWNER" ||
      userRole === "ADMIN";

    const isCreator =
      issue.creator.toString() === userId;

    const isAssignee =
      issue.assignee &&
      issue.assignee.toString() === userId;

    if (!isPrivileged && !isCreator && !isAssignee) {
      return res.status(403).json({
        message: "You cannot modify this issue",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      labels,
      dueDate,
    } = req.body;

    if (title !== undefined) {
      issue.title = title;
    }

    if (description !== undefined) {
      issue.description = description;
    }

    if (status !== undefined) {
      issue.status = status;
    }

    if (priority !== undefined) {
      issue.priority = priority;
    }

    if (labels !== undefined) {
      issue.labels = labels;
    }

    if (dueDate !== undefined) {
      issue.dueDate = dueDate;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("creator", "name email")
      .populate("assignee", "name email");

    res.status(200).json({
      message: "Issue updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Update issue error:", error);

    res.status(500).json({
      message: "Server error while updating issue",
    });
  }
};



// DELETE ISSUE
const deleteIssue = async (req, res) => {
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

    if (
      req.projectRole !== "OWNER" &&
      req.projectRole !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "Only project owners and admins can delete issues",
      });
    }

    await Issue.deleteOne({
      _id: issueId,
    });

    res.status(200).json({
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Delete issue error:", error);

    res.status(500).json({
      message: "Server error while deleting issue",
    });
  }
};




// ASSIGN ISSUE
const assignIssue = async (req, res) => {
  try {
    const { projectId, issueId } = req.params;
    const { assignee } = req.body;

    if (!assignee) {
      return res.status(400).json({
        message: "Assignee is required",
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

    if (
      req.projectRole !== "OWNER" &&
      req.projectRole !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "Only owners and admins can assign issues",
      });
    }

    const project = await Project.findById(projectId);

    const isMember = project.members.some(
      (member) =>
        member.user.toString() === assignee
    );

    if (!isMember) {
      return res.status(400).json({
        message: "Assignee must be a project member",
      });
    }

    issue.assignee = assignee;

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("creator", "name email")
      .populate("assignee", "name email");

    res.status(200).json({
      message: "Issue assigned successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Assign issue error:", error);

    res.status(500).json({
      message: "Server error while assigning issue",
    });
  }
};



module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  assignIssue,
};