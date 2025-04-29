const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const assessmentRoutes = require("./assessmentRoutes");
const faqRoutes = require("./faqRoutes");
const resultsRoutes = require("./resultsRoutes");
const moduleRoutes = require("./moduleRoutes");
const moduleResultRoutes = require("./moduleResultRoutes");

// Use the routes
router.use("/auth", authRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/faqs", faqRoutes);
router.use("/results", resultsRoutes);
router.use("/modules", moduleRoutes);
router.use("/moduleResult", moduleResultRoutes);

module.exports = router;
