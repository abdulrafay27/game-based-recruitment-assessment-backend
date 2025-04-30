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
      .query("UPDATE Assessment SET status = 'in-progress' WHERE id = @assessmentId");

    res.status(200).json({ message: "Assessment started successfully" });
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


exports.getAssessmentProgress = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const statusCounts = await assessmentModel.getAssessmentStatusCountsByUser(userId);

    const counts = {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };

    let totalModules = 0;

    statusCounts.forEach(({ status, count }) => {
      if (status === "completed") counts.completed = count;
      else if (status === "in-progress") counts.inProgress = count;
      else counts.notStarted += count;

      totalModules += count;
    });

    const percentage = totalModules > 0
      ? Math.round((counts.completed / totalModules) * 100)
      : 0;

    res.status(200).json({
      message: "Assessment progress fetched successfully",
      data: {
        percentage: `${percentage}%`,
        modulesCompletedText: `${counts.completed} out of ${totalModules} modules done`,
        breakdown: counts,
      },
    });
  } catch (error) {
    console.error("Error in getAssessmentProgress:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// In assessmentController.js
const assessmentModel = require("../models/assessmentModel");

// Function to calculate key strengths
exports.getKeyStrengths = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const assessmentData = await assessmentModel.getAssessmentByUserId(userId);

    const keyStrengths = [];

    // Evaluate leadership and other modules' strength
    if (assessmentData.leadershipScore > 55) {
      keyStrengths.push("Leadership skill is a key strength.");
    }
    if (assessmentData.teamworkScore > 55) {
      keyStrengths.push("Teamwork skill is a key strength.");
    }
    if (assessmentData.communicationScore > 55) {
      keyStrengths.push("Communication skill is a key strength.");
    }

    if (keyStrengths.length > 0) {
      res.status(200).json({
        message: "Key strengths fetched successfully.",
        keyStrengths: keyStrengths.join(" "),
      });
    } else {
      res.status(200).json({
        message: "No key strengths found for this user.",
      });
    }
  } catch (error) {
    console.error("Error fetching key strengths:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// In assessmentController.js
exports.getPotentialChallenges = async (req, res) => {
  const userId = parseInt(req.params.userId); // Get userId from request parameters
  try {
    const assessmentData = await assessmentModel.getAssessmentByUserId(userId);

    const challenges = [];

    if (assessmentData.leadershipScore < 55) {
      challenges.push("Leadership skill is a potential challenge.");
    }
    if (assessmentData.teamworkScore < 55) {
      challenges.push("Teamwork skill is a potential challenge.");
    }
    if (assessmentData.communicationScore < 55) {
      challenges.push("Communication skill is a potential challenge.");
    }

    if (challenges.length > 0) {
      res.status(200).json({
        message: "Potential challenges fetched successfully.",
        challenges: challenges.join(" "),
      });
    } else {
      res.status(200).json({
        message: "No potential challenges found for this user.",
      });
    }
  } catch (error) {
    console.error("Error fetching potential challenges:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Make sure these imports match the actual paths to your functions
const { getAssessmentByUserId } = require("../models/assessmentModel");

exports.getCareerRecommendations = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const assessmentData = await getAssessmentByUserId(userId);

    // Logic for generating career recommendations...
    const careerRecommendations = [];
    if (assessmentData.leadershipScore > 70) {
      careerRecommendations.push("Consider a leadership role in management or senior positions.");
    } else if (assessmentData.leadershipScore >= 50) {
      careerRecommendations.push("Consider a leadership training course to enhance your skills.");
    } else {
      careerRecommendations.push("Consider working on building your leadership capabilities through mentorship.");
    }

    res.status(200).json({
      message: "Career recommendations fetched successfully.",
      recommendations: careerRecommendations.join(" "),
    });
  } catch (error) {
    console.error("Error fetching career recommendations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDevelopmentRecommendations = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const assessmentData = await getAssessmentByUserId(userId);

    // Logic for generating development recommendations...
    const developmentRecommendations = [];
    if (assessmentData.leadershipScore > 70) {
      developmentRecommendations.push("Work on further developing your leadership skills by taking advanced leadership courses.");
    } else if (assessmentData.leadershipScore >= 50) {
      developmentRecommendations.push("Consider joining leadership workshops to enhance your decision-making abilities.");
    } else {
      developmentRecommendations.push("Find a mentor who can guide you in developing your leadership abilities.");
    }

    res.status(200).json({
      message: "Development recommendations fetched successfully.",
      recommendations: developmentRecommendations.join(" "),
    });
  } catch (error) {
    console.error("Error fetching development recommendations:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



