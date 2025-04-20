const {
  submitFeedback,
  getFeedbackByAssessmentId,
} = require("../models/feedbackModel");

const handleFeedbackSubmit = async (req, res) => {
  console.log("Feedback API hit");
  const { assessment_id, rating, feedback_text } = req.body;
  try {
    await submitFeedback({ assessment_id, rating, feedback_text });
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await getFeedbackByAssessmentId(req.params.assessmentId);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handleFeedbackSubmit, getFeedback };
