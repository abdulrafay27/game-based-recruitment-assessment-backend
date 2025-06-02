const User = require("../models/userModel");
const Assessment = require("../models/assessmentModel");
const ModuleResult = require("../models/moduleResultModel");

async function getDashboardSummary(req, res) {
  try {
    // 1. Total candidates (users with role "candidate")
    const totalCandidates = await User.countDocuments({ role: "candidate" });

    // 2. Total assessments completed (count of Assessment documents)
    const totalAssessmentsCompleted = await Assessment.countDocuments();

    // 3. Average completion rate:
    // Let's define completion rate as:
    // (number of completed moduleResults for candidates) / (total moduleResults for candidates) * 100

    // Get all module results for users with role "candidate"
    const candidateUsers = await User.find({ role: "candidate" }, { _id: 1 });
    const candidateUserIds = candidateUsers.map((user) => user._id);

    const totalModuleResults = await ModuleResult.countDocuments({
      user_id: { $in: candidateUserIds },
    });

    const completedModuleResults = await ModuleResult.countDocuments({
      user_id: { $in: candidateUserIds },
      Status: "Completed",
    });

    const averageCompletionRate =
      totalModuleResults > 0
        ? (completedModuleResults / totalModuleResults) * 100
        : 0;

    res.json({
      totalCandidates,
      totalAssessmentsCompleted,
      averageCompletionRate: Number(averageCompletionRate.toFixed(1)),
    });
  } catch (err) {
    console.error("Error in getDashboardSummary:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getDashboardSummary };
