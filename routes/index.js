const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const faqRoutes = require("./faqRoutes");
const moduleRoutes = require("./moduleRoutes");
const moduleResultRoutes = require("./moduleResultRoutes");
const recruiterDasboardRoutes = require("./recruiterDashboardRoutes");
const analyticsRoutes = require("./analytics");
// Use the routes
router.use("/auth", authRoutes);
router.use("/faqs", faqRoutes);
router.use("/modules", moduleRoutes);
router.use("/moduleResult", moduleResultRoutes);
router.use("/dashboard", recruiterDasboardRoutes);
router.use("/analytics", analyticsRoutes);
module.exports = router;
