const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const assessmentRoutes = require("./assessmentRoutes");
const faqRoutes = require("./faqRoutes");
const resultsRoutes = require("./resultsRoutes");

// Use the routes
router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/faqs", faqRoutes);
router.use("/results", resultsRoutes);

module.exports = router;
