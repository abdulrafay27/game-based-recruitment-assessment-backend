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
    const result = await pool
      .request()
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

// Submit assessment results
exports.submitAssessment = async (req, res) => {
  const { assessmentId, responses } = req.body;
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

    // Calculate score (Placeholder, you'll adjust based on your scoring system)
    const score = Math.floor(Math.random() * 100);
    await pool
      .request()
      .input("assessmentId", sql.Int, assessmentId)
      .input("score", sql.Int, score)
      .query(
        "UPDATE Assessment SET score = @score, status = 'completed' WHERE id = @assessmentId"
      );

    res
      .status(200)
      .json({ message: "Assessment submitted", result: { score } });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
