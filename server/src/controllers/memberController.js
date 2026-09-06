const Project = require("../models/project");
const User = require("../models/user");
const createActivity = require("../utils/activityLogger");

// GET MEMBERS
const getMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      members: project.members,
    });
  } catch (error) {
    console.error("Get members error:", error);

    res.status(500).json({
      message: "Server error while fetching members",
    });
  }
};

// ADD MEMBER
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const project = req.project;

    const alreadyMember = project.members.some(
      (member) =>
        member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        message: "User is already a member of this project",
      });
    }

    const newRole = role || "MEMBER";

    if (!["ADMIN", "MEMBER"].includes(newRole)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    project.members.push({
      user: user._id,
      role: newRole,
    });

    await project.save();

    await createActivity({
      project: project._id,
      user: req.user.userId,
      action: "MEMBER_ADDED",
      metadata: {
        member: user._id,
        role: newRole,
      },
    });

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.status(200).json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Add member error:", error);

    res.status(500).json({
      message: "Server error while adding member",
    });
  }
};

// REMOVE MEMBER
const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const project = req.project;

    const member = project.members.find(
      (member) =>
        member.user.toString() === userId
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (member.role === "OWNER") {
      return res.status(400).json({
        message: "Project owner cannot be removed",
      });
    }

    project.members = project.members.filter(
      (member) =>
        member.user.toString() !== userId
    );

    await project.save();

    await createActivity({
      project: project._id,
      user: req.user.userId,
      action: "MEMBER_REMOVED",
      metadata: {
        member: userId,
      },
    });

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.status(200).json({
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Remove member error:", error);

    res.status(500).json({
      message: "Server error while removing member",
    });
  }
};

// UPDATE MEMBER ROLE
const updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const project = req.project;

    const member = project.members.find(
      (member) =>
        member.user.toString() === userId
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (member.role === "OWNER") {
      return res.status(400).json({
        message: "Owner role cannot be changed",
      });
    }

    member.role = role;

    await project.save();

    await createActivity({
      project: project._id,
      user: req.user.userId,
      action: "MEMBER_ROLE_CHANGED",
      metadata: {
        member: userId,
        role,
      },
    });

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.status(200).json({
      message: "Member role updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update member role error:", error);

    res.status(500).json({
      message: "Server error while updating member role",
    });
  }
};

module.exports = {
  getMembers,
  addMember,
  removeMember,
  updateMemberRole,
};