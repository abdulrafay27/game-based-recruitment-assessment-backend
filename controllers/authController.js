const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const Assessment = require("../models/assessmentModel"); 
const Module = require("../models/module");
const ModuleResult = require("../models/moduleResultModel");


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
    const user = await User.findOne({id}).select("-password");

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

// /api/auth/getuserprofile/:userId
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const foundUser = await User.findById(userId).select("-password");
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: foundUser });
  } catch (err) {
    console.error("Error fetching user results:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// /api/auth/updateprofile/:id
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, date_of_birth, location, education } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { full_name, phone, date_of_birth, location, education },
      { new: true, runValidators: true, context: 'query' }
    ).select("-password");
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
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

// // controllers/authController.js
// exports.getAllCandidates = async (req, res) => {
//   try {
//     // fetch all users whose role is “candidate”
//     const candidates = await User.find({ role: "candidate" }).select("-password");
//     res.status(200).json({ candidates });
//   } catch (err) {
//     console.error("Error fetching candidates:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

//changes by M
// exports.getAllCandidates = async (req, res) => {
//   try {
//     // fetch all candidates
//     const candidates = await User.find({ role: "candidate" }).select("-password");

//     // for each candidate, check if they have a completed assessment
//     const candidatesWithStatus = await Promise.all(
//       candidates.map(async (candidate) => {
//         // find assessment for the user
//         const assessment = await Assessment.findOne({ user_id: candidate._id });

//         let status = "not-started"; // default status
//         if (assessment) {
//           // You can customize logic here based on your data
//           status = "completed";
//         } else {
//           // Optionally, check ModuleResult for "in-progress" status if you want
//           // status = "in-progress";
//         }

//         return {
//           ...candidate.toObject(),
//           status,
//         };
//       })
//     );

//     res.status(200).json({ candidates: candidatesWithStatus });
//   } catch (err) {
//     console.error("Error fetching candidates:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
exports.getAllCandidates = async (req, res) => {
  try {
    // Get total modules dynamically
    const totalModules = await Module.countDocuments();

    // Fetch all users with role "candidate"
    const candidates = await User.find({ role: "candidate" });

    // Get each user's completed modules and compute status
    const results = await Promise.all(
      candidates.map(async (candidate) => {
        const completedCount = await ModuleResult.countDocuments({ user_id: candidate._id });

        let status = "Not Started";
        if (completedCount === totalModules && totalModules !== 0) {
          status = "Completed";
        } else if (completedCount > 0) {
          status = "Started";
        }

        return {
          ...candidate.toObject(),
          status,
        };
      })
    );

    res.status(200).json({ candidates: results });
  } catch (err) {
    console.error("Error fetching candidate statuses:", err);
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

