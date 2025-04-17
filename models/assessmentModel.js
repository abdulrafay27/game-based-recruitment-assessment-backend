const { poolPromise, sql } = require("../config/db"); // Import sql

// Get all available assessments
async function getAllAssessments() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Assessments");
    return result.recordset; // Returns an array of assessments
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Error fetching assessments");
  }
}

// Get an assessment by its ID
async function getAssessmentById(assessmentId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("assessmentId", sql.Int, assessmentId)
      .query("SELECT * FROM Assessments WHERE id = @assessmentId");

    return result.recordset[0]; // Returns a single assessment
  } catch (error) {
    console.error("Error fetching assessment:", error);
    throw new Error("Error fetching assessment");
  }
}

// Start an assessment (update status to in-progress)
async function startAssessment(assessmentId) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("assessmentId", sql.Int, assessmentId)
      .query(
        "UPDATE Assessments SET status = 'in-progress' WHERE id = @assessmentId"
      );
  } catch (error) {
    console.error("Error starting assessment:", error);
    throw new Error("Error starting assessment");
  }
}

// Submit an assessment and calculate the score
async function submitAssessment(assessmentId, responses) {
  try {
    const pool = await poolPromise;

    // Insert responses into Responses table
    for (const response of responses) {
      await pool
        .request()
        .input("assessmentId", sql.Int, assessmentId)
        .input("questionId", sql.Int, response.questionId)
        .input("response", sql.NVarChar, response.answer)
        .query(
          "INSERT INTO Responses (assessment_id, question_id, response) VALUES (@assessmentId, @questionId, @response)"
        );
    }

    // Calculate the score (using a placeholder score calculation for now)
    const score = Math.floor(Math.random() * 100);

    // Update the assessment with the calculated score and change status to completed
    await pool
      .request()
      .input("assessmentId", sql.Int, assessmentId)
      .input("score", sql.Int, score)
      .query(
        "UPDATE Assessments SET score = @score, status = 'completed' WHERE id = @assessmentId"
      );

    return score;
  } catch (error) {
    console.error("Error submitting assessment:", error);
    throw new Error("Error submitting assessment");
  }
}

// Get responses for a specific assessment
async function getResponsesForAssessment(assessmentId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("assessmentId", sql.Int, assessmentId)
      .query("SELECT * FROM Responses WHERE assessment_id = @assessmentId");

    return result.recordset; // Returns an array of responses for the assessment
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw new Error("Error fetching responses");
  }
}

// Example function to get all questions related to a specific module
async function getQuestionsByModule(moduleId) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("moduleId", sql.Int, moduleId)
      .query("SELECT * FROM Questions WHERE module_id = @moduleId");

    return result.recordset; // Returns an array of questions for the module
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Error fetching questions");
  }
}

module.exports = {
  getAllAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getResponsesForAssessment,
  getQuestionsByModule,
};
