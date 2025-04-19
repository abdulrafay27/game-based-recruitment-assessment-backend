const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");

// ✅ Add this ping route
router.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

// Your existing routes
router.get("/", assessmentController.getAssessments);
router.post("/start", assessmentController.startAssessment);
router.post("/submit", assessmentController.submitAssessment);

module.exports = router;
