const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");

// Correct route names
router.get("/", assessmentController.getAssessments); // For GET /assessments
router.post("/start", assessmentController.startAssessment); // For POST /assessments/start
router.post("/submit", assessmentController.submitAssessment); // For POST /assessments/submit

module.exports = router;
