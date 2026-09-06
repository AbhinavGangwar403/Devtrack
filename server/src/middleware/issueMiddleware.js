const Project = require("../models/project");

const checkIssueProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

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
    console.error("Issue project access error:", error);

    res.status(500).json({
      message: "Server error while checking project access",
    });
  }
};

module.exports = checkIssueProjectAccess;