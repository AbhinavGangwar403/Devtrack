// Issue routes.

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
router.post(
  "/:projectId/issues",
  protect,
  checkIssueProjectAccess,
  createIssue
);
router.get(
  "/:projectId/issues",
  protect,
  checkIssueProjectAccess,
  getIssues
);
router.get(
  "/:projectId/issues/:issueId",
  protect,
  checkIssueProjectAccess,
  getIssue
);
router.put(
  "/:projectId/issues/:issueId",
  protect,
  checkIssueProjectAccess,
  updateIssue
);
router.delete(
  "/:projectId/issues/:issueId",
  protect,
  checkIssueProjectAccess,
  deleteIssue
);
router.patch(
  "/:projectId/issues/:issueId/assign",
  protect,
  checkIssueProjectAccess,
  assignIssue
);

module.exports = router;