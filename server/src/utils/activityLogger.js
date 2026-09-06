const Activity = require("../models/activity");

const createActivity = async ({
  project,
  issue = null,
  user,
  action,
  metadata = {},
}) => {
  try {
    return await Activity.create({
      project,
      issue,
      user,
      action,
      metadata,
    });
  } catch (error) {
    console.error("Activity creation error:", error);
    return null;
  }
};

module.exports = createActivity;