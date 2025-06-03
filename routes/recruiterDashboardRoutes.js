const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/recruiterDashboardController");

// GET /api/dashboard/summary
router.get("/summary", getDashboardSummary);

module.exports = router;