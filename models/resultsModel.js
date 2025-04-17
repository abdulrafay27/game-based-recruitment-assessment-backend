const { poolPromise } = require("../config/db");

const getResultsByUserId = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request().input("userId", userId).query(`
      SELECT * FROM results
      WHERE assessment_id IN (
        SELECT id FROM Assessment WHERE user_id = @userId
      )
    `);
  return result.recordset;
};

const getResultsByAssessmentId = async (assessmentId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("assessmentId", assessmentId)
    .query("SELECT * FROM results WHERE assessment_id = @assessmentId");
  return result.recordset;
};

module.exports = {
  getResultsByUserId,
  getResultsByAssessmentId,
};
