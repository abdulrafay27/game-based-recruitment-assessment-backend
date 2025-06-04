// controllers/recruiterDashboardController.js

const User = require("../models/userModel");                     
const Module = require("../models/module");                        
const ModuleResult = require("../models/moduleResultModel");      

async function getDashboardSummary(req, res) {
  try {
    // 1. Total candidates (users with role "candidate")
    const totalCandidates = await User.countDocuments({ role: "candidate" });      

    // 2. Find all active modules first
    const activeModules = await Module.find({ status: "active" }).select("_id");     
    const activeModuleIds = activeModules.map((m) => m._id);
    const numActive = activeModuleIds.length;                                       // total number of active modules

    // 3. Count how many candidates have completed ALL active modules.
    const completedAllCandidatesAgg = await ModuleResult.aggregate([
      {
        $match: {
          module_id: { $in: activeModuleIds },
          Status: "Completed",
        },
      },
      {
        $group: {
          _id: "$user_id",
          completedCount: { $addToSet: "$module_id" }, // distinct module_ids per user
        },
      },
      {
        $project: {
          countDistinct: { $size: "$completedCount" }, // count distinct completed modules
        },
      },
      {
        $match: {
          countDistinct: numActive, // only users who completed all active modules
        },
      },
      {
        $count: "usersCompletedAll", // total count of such users
      },
    ]);                                                                       

    // Extract total assessments completed (or 0 if none)
    const totalAssessmentsCompleted =
      (completedAllCandidatesAgg.length > 0
        ? completedAllCandidatesAgg[0].usersCompletedAll
        : 0);

    // 4. Compute average completion rate among candidate users:
    const candidateUsers = await User.find(
      { role: "candidate" },
      { _id: 1 }
    );                                                                           
    const candidateUserIds = candidateUsers.map((u) => u._id);

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

    // 5. Return JSON summary
    return res.json({
      totalCandidates,
      totalAssessmentsCompleted,
      averageCompletionRate: Number(averageCompletionRate.toFixed(1)),
    });
  } catch (err) {
    console.error("Error in getDashboardSummary:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// Get top candidates and their scores across completed modules
async function getTopCandidates(req, res) {
  try {
    // Find all candidate users with basic info
    const candidateUsers = await User.find({ role: "candidate" }).select("_id full_name email");
    const candidateUserIds = candidateUsers.map(u => u._id);

    // Aggregate average ModuleScore per candidate for completed modules
    const agg = await ModuleResult.aggregate([
      {
        $match: {
          user_id: { $in: candidateUserIds },
          Status: "Completed",
          ModuleScore: { $exists: true }
        }
      },
      {
        $group: {
          _id: "$user_id",
          averageScore: { $avg: "$ModuleScore" },
          totalModulesCompleted: { $sum: 1 }
        }
      },
      {
        $sort: { averageScore: -1 } // Highest average score first
      },
      {
        $limit: 10 // Top 10 candidates; you can adjust or make dynamic
      }
    ]);

    // Merge aggregated data with user info
    const topCandidates = agg.map(item => {
      const user = candidateUsers.find(u => u._id.equals(item._id));
      return {
        user_id: item._id,
        name: user ? user.full_name : "Unknown",
        email: user ? user.email : "Unknown",
        averageScore: item.averageScore.toFixed(2),
        totalModulesCompleted: item.totalModulesCompleted
      };
    });

    res.status(200).json({ topCandidates });
  } catch (err) {
    console.error("Error in getTopCandidates:", err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAllCandidateResults(req, res) {
  try {
    // Find all candidates
    const candidates = await User.find({ role: "candidate" }).select("_id name email");

    const candidateUserIds = candidates.map(c => c._id);

    // Find all completed ModuleResults for these users, including module scores
    const results = await ModuleResult.find({
      user_id: { $in: candidateUserIds },
      Status: "Completed"
    }).select("user_id module_id ModuleScore").lean();

    // Group results by user_id for easier consumption
    const groupedResults = {};
    for (const r of results) {
      if (!groupedResults[r.user_id]) groupedResults[r.user_id] = [];
      groupedResults[r.user_id].push({
        module_id: r.module_id,
        ModuleScore: r.ModuleScore
      });
    }

    // Attach user info
    const allCandidateResults = candidates.map(c => ({
      user_id: c._id,
      name: c.name,
      email: c.email,
      modules: groupedResults[c._id] || []
    }));

    res.status(200).json({ allCandidateResults });
  } catch (error) {
    console.error("Error in getAllCandidateResults:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { 
  getDashboardSummary,
  getTopCandidates,
  getAllCandidateResults,
};

