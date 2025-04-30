// In assessmentRoutes.js
const express = require("express");
const router = express.Router();
const assessmentController = require("../controllers/assessmentController");

// Existing routes
router.get("/", assessmentController.getAssessments); // For GET /assessments
router.post("/start", assessmentController.startAssessment); // For POST /assessments/start
router.post("/submit", assessmentController.submitAssessment); // For POST /assessments/submit
router.get("/progress/:userId", assessmentController.getAssessmentProgress); // GET /assessments/progress/:userId
router.get("/key-strengths/:userId", assessmentController.getKeyStrengths); // GET /assessments/key-strengths/:userId
router.get("/challenges/:userId", assessmentController.getPotentialChallenges); // GET /assessments/challenges/:userId
router.get("/career-recommendations/:userId", assessmentController.getCareerRecommendations); // GET /assessments/career-recommendations/:userId
router.get("/development-recommendations/:userId", assessmentController.getDevelopmentRecommendations); // GET /assessments/development-recommendations/:userId


module.exports = router;
