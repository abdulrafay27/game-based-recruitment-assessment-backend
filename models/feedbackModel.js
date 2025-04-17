const { poolPromise } = require("../config/db");

const submitFeedback = async ({ assessment_id, rating, feedback_text }) => {
  const pool = await poolPromise;
  console.log(assessment_id);
  await pool
    .request()
    .input("assessment_id", assessment_id)
    .input("rating", rating)
    .input("feedback_text", feedback_text || "").query(`
      INSERT INTO Feedback (assessment_id, rating, feedback_text)
      VALUES (@assessment_id, @rating, @feedback_text)
    `);
};
const getFeedbackByAssessmentId = async (assessment_id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("assessment_id", assessment_id)
    .query("SELECT * FROM Feedback WHERE assessment_id = @assessment_id");
  return result.recordset;
};

module.exports = { submitFeedback, getFeedbackByAssessmentId };
