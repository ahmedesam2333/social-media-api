const express = require("express");
const {
  createPost,
  getPosts,
  likePost,
  sharePost,
  commentPost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.put("/:id/like", authMiddleware, likePost);
router.put("/:id/share", authMiddleware, sharePost);
router.post("/:id/comment", authMiddleware, commentPost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
