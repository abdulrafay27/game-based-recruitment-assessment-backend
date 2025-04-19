const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes"); // Import auth routes
const assessmentRoutes = require("./assessmentRoutes"); // Import assessment routes
const faqRoutes = require("./faqRoutes"); // Import faqRoutes

// Use the routes
router.use("/auth", authRoutes); // Auth routes
router.use("/assessments", assessmentRoutes); // Assessments routes
router.use("/faqs", faqRoutes); // FAQs routes

module.exports = router;
