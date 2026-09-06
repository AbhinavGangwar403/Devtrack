const express = require("express");

const {
  addComment,
  getComments,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const checkIssueProjectAccess = require("../middleware/issueMiddleware");

const router = express.Router();

router.post(
  "/:projectId/issues/:issueId/comments",
  protect,
  checkIssueProjectAccess,
  addComment
);

router.get(
  "/:projectId/issues/:issueId/comments",
  protect,
  checkIssueProjectAccess,
  getComments
);

module.exports = router;