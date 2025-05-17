const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with this email already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create and save the new User
    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save(); // Save the user to MongoDB

    res.status(201).json({ message: "User Registered successfully" });
  } catch (error) {
    console.error("Error adding User:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ id }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserByName = async (req, res) => {
  const { full_name } = req.body;
  try {
    const user = await User.findOne({ full_name }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTotalCandidates = async (req, res) => {
  try {
    const candidateCount = await User.countDocuments({ role: "candidate" });
    res.status(200).json({ totalCandidates: candidateCount });
  } catch (error) {
    console.error("Error fetching total candidates:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching total candidates" });
  }
};

// controllers/authController.js
exports.getAllCandidates = async (req, res) => {
  try {
    // fetch all users whose role is “candidate”
    const candidates = await User.find({ role: "candidate" }).select("-password");
    res.status(200).json({ candidates });
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: { $in: ["candidate", "recruiter"] } });
    res.status(200).json({ totalUsers: userCount });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching total users" });
  }
};
