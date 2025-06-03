const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const faqRoutes = require("./faqRoutes");
const moduleRoutes = require("./moduleRoutes");
const moduleResultRoutes = require("./moduleResultRoutes");
const systemSettingRoutes = require("./systemSettingRoutes");

// Use the routes
router.use("/auth", authRoutes);
router.use("/faqs", faqRoutes);
router.use("/modules", moduleRoutes);
router.use("/moduleResult", moduleResultRoutes);
router.use("/settings", systemSettingRoutes);

module.exports = router;
