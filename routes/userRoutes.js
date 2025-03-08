const express = require("express");
const {
  registerUser,
  loginUser,
  updateProfile,
  followUser,
  unfollowUser,
  getUserProfile,
} = require("../controllers/userController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", authMiddleware, updateProfile);
router.post("/:id/follow", authMiddleware, followUser);
router.post("/:id/unfollow", authMiddleware, unfollowUser);
router.get("/:id", getUserProfile);
module.exports = router;
