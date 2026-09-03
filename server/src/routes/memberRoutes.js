const express = require("express");

const {
  addMember,
  removeMember,
  updateMemberRole,
} = require("../controllers/memberController");

const protect = require("../middleware/authMiddleware");

const {
  checkProjectMember,
  requireProjectRole,
} = require("../middleware/projectMiddleware");

const router = express.Router();

router.post(
  "/:id/members",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER", "ADMIN"),
  addMember
);

router.delete(
  "/:id/members/:userId",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER", "ADMIN"),
  removeMember
);

router.patch(
  "/:id/members/:userId",
  protect,
  checkProjectMember,
  requireProjectRole("OWNER"),
  updateMemberRole
);

module.exports = router;