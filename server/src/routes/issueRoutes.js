const express = require("express");

const {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  assignIssue,
} = require("../controllers/issueController");

const protect = require("../middleware/authMiddleware");

const checkIssueProjectAccess = require("../middleware/issueMiddleware");

const router = express.Router();

// Create issue
router.post(
  "/:projectId/issues",
  protect,
  checkIssueProjectAccess,
  createIssue
);

// Get issues
router.get(
  "/:projectId/issues",
  protect,
  checkIssueProjectAccess,
  getIssues
);

// Get single issue
router.get(
  "/:projectId/issues/:issueId",
  protect,
  checkIssueProjectAccess,
  getIssue
);

// Update issue
router.put(
  "/:projectId/issues/:issueId",
  protect,
  checkIssueProjectAccess,
  updateIssue
);

// Delete issue
router.delete(
  "/:projectId/issues/:issueId",
  protect,
  checkIssueProjectAccess,
  deleteIssue
);

// Assign issue
router.patch(
  "/:projectId/issues/:issueId/assign",
  protect,
  checkIssueProjectAccess,
  assignIssue
);

module.exports = router;