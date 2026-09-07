const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  getProjectAnalytics,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get(
  "/:projectId/analytics",
  protect,
  getProjectAnalytics
);

module.exports = router;