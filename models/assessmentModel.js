//const { poolPromise, sql } = require("../config/db"); // Import sql

// Get all available assessments
async function getAllAssessments() {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query("SELECT * FROM Assessment");
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
    const result = await pool.request()
      .input("assessmentId", sql.Int, assessmentId)
      .query("SELECT * FROM Assessment WHERE id = @assessmentId");
    
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
    await pool.request()
      .input("assessmentId", sql.Int, assessmentId)
      .query("UPDATE Assessment SET status = 'in-progress' WHERE id = @assessmentId");
  } catch (error) {
    console.error("Error starting assessment:", error);
    throw new Error("Error starting assessment");
  }
}


// Submit an assessment and update score (without calculating score here)
async function submitAssessment(assessmentId, responses, score, userId) {
  try {
    const pool = await poolPromise;
    
    // Insert responses into Responses table
    for (const response of responses) {
      await pool.request()
        .input("assessmentId", sql.Int, assessmentId)
        .input("questionId", sql.Int, response.questionId)
        .input("response", sql.NVarChar, response.answer)
        .query("INSERT INTO Responses (assessment_id, question_id, response) VALUES (@assessmentId, @questionId, @response)");
    }
    
    // Set the assessment_date to the current date and update the assessment status
    const assessmentDate = new Date().toISOString(); // Current date and time in ISO format
    await pool.request()
      .input("assessmentId", sql.Int, assessmentId)
      .input("score", sql.Int, score)
      .input("assessmentDate", sql.DateTime, assessmentDate)  // Insert current date
      .input("userId", sql.Int, userId)  // Associate with user
      .query("UPDATE Assessment SET score = @score, assessment_date = @assessmentDate, status = 'completed', user_id = @userId WHERE id = @assessmentId");

    return score;
  } catch (error) {
    console.error("Error submitting assessment:", error);
    throw new Error("Error submitting assessment");
  }
}


const { poolPromise, sql } = require("../config/db");

async function getAssessmentStatusCountsByUser(userId) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT status, COUNT(*) AS count
        FROM Assessment
        WHERE user_id = @userId
        GROUP BY status
      `);

    return result.recordset;
  } catch (error) {
    console.error("Error fetching assessment status counts:", error);
    throw error;
  }
}

// Get assessments by userId
async function getAssessmentByUserId(userId) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT leadershipScore, teamworkScore, communicationScore 
        FROM Assessment 
        WHERE user_id = @userId
      `);

    return result.recordset[0]; // Returns scores for the given user
  } catch (error) {
    console.error("Error fetching user assessment:", error);
    throw new Error("Error fetching user assessment");
  }
}




module.exports = {
  getAllAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getAssessmentStatusCountsByUser,
  getAssessmentByUserId
};

