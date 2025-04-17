const express = require("express");
const router = express.Router();
const {
  fetchUserResults,
  fetchAssessmentResults,
} = require("../controllers/resultsController");

router.get("/:userId", fetchUserResults);
router.get("/assessment/:assessmentId", fetchAssessmentResults);

module.exports = router;
console.log("Result Routes Loaded");
