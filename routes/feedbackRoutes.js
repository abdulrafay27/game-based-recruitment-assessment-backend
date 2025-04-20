//feedbackRoutes
const express = require("express");
const router = express.Router();
const {
  handleFeedbackSubmit,
  getFeedback,
} = require("../controllers/feedbackController");
console.log("Handle Feedback submit: ", handleFeedbackSubmit);

router.post("/submit", handleFeedbackSubmit);
router.get("/:assessmentId", getFeedback);

module.exports = router;
console.log("Feedback Routes Loaded");
