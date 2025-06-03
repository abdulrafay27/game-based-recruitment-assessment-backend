const express = require("express");
const router = express.Router();
const { getDashboardSummary , getTopCandidates, getAllCandidateResults} = require("../controllers/recruiterDashboardController");

// GET /api/dashboard/summary
router.get("/summary", getDashboardSummary);
router.get("/top-candidates", getTopCandidates);
router.get("/all-candidates-results", getAllCandidateResults);

module.exports = router;