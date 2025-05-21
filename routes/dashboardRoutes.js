const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/summary', dashboardController.getSummary);
router.get('/completion-trend', dashboardController.getCompletionTrend);
router.get('/module-scores', dashboardController.getModuleScores);
router.get('/top-strengths', dashboardController.getTopStrengths);

router.get("/candidate-growth", dashboardController.getCandidateGrowth);
router.get("/skills-distribution", dashboardController.getSkillsDistribution);
router.get("/assessment-completion", dashboardController.getAssessmentCompletion);


module.exports = router;
console.log("dashboard.js loaded");