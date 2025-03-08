const Post = require("../models/Post");

// Create Post with Image
const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      image: req.body.image,
      user: req.user.id,
    });
    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Posts with User Info
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username photo");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Like Post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) post.likes.push(req.user.id);
    await post.save();
    res.json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Share Post
const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.shares.includes(req.user.id)) post.shares.push(req.user.id);
    await post.save();
    res.json({ message: "Post shared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Comment on Post
const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();
    res.json({ message: "Comment added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  likePost,
  sharePost,
  commentPost,
  deletePost,
};
