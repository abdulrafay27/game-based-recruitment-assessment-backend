const {
  getResultsByUserId,
  getResultsByAssessmentId,
} = require("../models/resultsModel");

const fetchUserResults = async (req, res) => {
  try {
    const results = await getResultsByUserId(req.params.userId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchAssessmentResults = async (req, res) => {
  try {
    const results = await getResultsByAssessmentId(req.params.assessmentId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  fetchUserResults,
  fetchAssessmentResults,
};
