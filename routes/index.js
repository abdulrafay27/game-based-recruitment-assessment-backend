const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const assessmentRoutes = require("./assessmentRoutes"); // Import the correct route file
const resultsRoutes = require("./resultsRoutes");
const feedbackRoutes = require("./feedbackRoutes");

router.use("/auth", authRoutes); // Auth routes
router.use("/assessments", assessmentRoutes); // Use assessments routes
router.use("/results", resultsRoutes);
router.use("/feedback", feedbackRoutes);

module.exports = router;
