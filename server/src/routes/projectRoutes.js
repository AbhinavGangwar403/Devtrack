const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const {
  checkProjectMember,
  requireProjectRole,
} = require("../middleware/projectMiddleware");

const router = express.Router();

// Create project
router.post("/", protect, createProject);

// Get user's projects
router.get("/", protect, getProjects);

// Get single project
router.get(
  "/:id",
  protect,
  checkProjectMember,
  getProject
);

// Update project
router.put(
  "/:id",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER", "ADMIN"),
  updateProject
);

// Delete project
router.delete(
  "/:id",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER"),
  deleteProject
);

module.exports = router;