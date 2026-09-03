const Project = require("../models/project");

const checkProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const member = project.members.find(
      (member) =>
        member.user.toString() === req.user.userId
    );

    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    req.project = project;
    req.projectRole = member.role;

    next();
  } catch (error) {
    console.error("Project authorization error:", error);

    res.status(500).json({
      message: "Server error while checking project access",
    });
  }
};

const requireProjectRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.projectRole)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = {
  checkProjectMember,
  requireProjectRole,
};