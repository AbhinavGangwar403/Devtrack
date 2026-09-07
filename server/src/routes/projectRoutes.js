// Project routes.

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
router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get(
  "/:id",
  protect,
  checkProjectMember,
  getProject
);
router.put(
  "/:id",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER", "ADMIN"),
  updateProject
);
router.delete(
  "/:id",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER"),
  deleteProject
);

module.exports = router;