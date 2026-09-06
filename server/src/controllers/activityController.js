const Activity = require("../models/activity");

const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    const activities = await Activity.find({
      project: projectId,
    })
      .populate("user", "name email")
      .populate("issue", "title")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      activities,
    });
  } catch (error) {
    console.error("Get activities error:", error);

    res.status(500).json({
      message: "Server error while fetching activities",
    });
  }
};

const getIssueActivities = async (req, res) => {
  try {
    const { projectId, issueId } = req.params;

    const activities = await Activity.find({
      project: projectId,
      issue: issueId,
    })
      .populate("user", "name email")
      .populate("issue", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      activities,
    });
  } catch (error) {
    console.error("Get issue activities error:", error);

    res.status(500).json({
      message: "Server error while fetching issue activities",
    });
  }
};

module.exports = {
  getProjectActivities,
  getIssueActivities,
};