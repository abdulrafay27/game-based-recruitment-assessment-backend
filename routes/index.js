const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const assessmentRoutes = require("./assessmentRoutes");
const faqRoutes = require("./faqRoutes");
const resultsRoutes = require("./resultsRoutes");
const feedbackRoutes = require("./feedbackRoutes");

// Use the routes
router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/faqs", faqRoutes);
router.use("/results", resultsRoutes);
router.use("/feedback", feedbackRoutes);

module.exports = router;
