const express = require("express");

const {
  getProjectActivities,
  getIssueActivities,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

const checkIssueProjectAccess = require("../middleware/issueMiddleware");

const router = express.Router();

router.get(
  "/:projectId/activities",
  protect,
  checkIssueProjectAccess,
  getProjectActivities
);

router.get(
  "/:projectId/issues/:issueId/activities",
  protect,
  checkIssueProjectAccess,
  getIssueActivities
);

module.exports = router;