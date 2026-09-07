const Activity = require("../models/activity");
const { getIO } = require("./socket");

const createActivity = async ({
  project,
  issue = null,
  user,
  action,
  metadata = {},
}) => {
  try {
    const activity =
      await Activity.create({
        project,
        issue,
        user,
        action,
        metadata,
      });

    const populatedActivity =
      await Activity.findById(activity._id)
        .populate("user", "name email")
        .populate("issue", "title");

    const io = getIO();

    io.to(`project:${project}`).emit(
      "activity-created",
      populatedActivity
    );

    return populatedActivity;
  } catch (error) {
    console.error(
      "Activity creation error:",
      error
    );

    return null;
  }
};

module.exports = createActivity;