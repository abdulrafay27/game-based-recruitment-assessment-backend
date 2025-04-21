const { poolPromise, sql } = require("../config/db"); // Import sql

// Get a list of available assessments
exports.getAssessments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Assessment");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No assessments found" });
    }

    res.status(200).json({
      message: "Available assessments",
      assessments: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Start a specific assessment
exports.startAssessment = async (req, res) => {
  const { assessmentId } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("assessmentId", sql.Int, assessmentId)
      .query(
        "UPDATE Assessment SET status = 'in-progress' WHERE id = @assessmentId"
      );
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Assessment started successfully" });
    } else {
      res.status(404).json({ message: "Assessment not found" });
    }
  } catch (error) {
    console.error("Error starting assessment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Submit assessment results (without calculating the score)
exports.submitAssessment = async (req, res) => {
  const { assessmentId, responses, score, userId } = req.body; // Get score and userId from frontend
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
      .input("score", sql.Int, score)  // Use score from frontend
      .input("assessmentDate", sql.DateTime, assessmentDate)  // Insert current date
      .input("userId", sql.Int, userId)  // Associate with user
      .query("UPDATE Assessment SET score = @score, assessment_date = @assessmentDate, status = 'completed', user_id = @userId WHERE id = @assessmentId");

    res.status(200).json({ message: "Assessment submitted successfully", result: { score } });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
