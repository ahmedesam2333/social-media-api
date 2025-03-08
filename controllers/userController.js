const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  const { email, password, about } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ email, password, about });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Follow a User
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(userToFollow.id)) {
      currentUser.following.push(userToFollow.id);
      userToFollow.followers.push(currentUser.id);
      await currentUser.save();
      await userToFollow.save();
    }

    res.json({ message: "User followed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a User
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow.id
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser.id
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "User unfollowed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers following",
      "username photo"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  followUser,
  unfollowUser,
  getUserProfile,
};
