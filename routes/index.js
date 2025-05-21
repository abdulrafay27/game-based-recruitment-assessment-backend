const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const faqRoutes = require("./faqRoutes");
const moduleRoutes = require("./moduleRoutes");
const moduleResultRoutes = require("./moduleResultRoutes");
const dashboardRoutes = require("./dashboardRoutes");

// Use the routes
router.use("/auth", authRoutes);
router.use("/faqs", faqRoutes);
router.use("/modules", moduleRoutes);
router.use("/moduleResult", moduleResultRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
