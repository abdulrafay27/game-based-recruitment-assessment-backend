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
    //    We use an aggregation on ModuleResult:
    //    - Match only ModuleResults where:
    //         • module_id ∈ activeModuleIds
    //         • Status === "Completed"
    //    - Group by user_id, count distinct module_id per user.
    //    - Only keep those groups whose count equals numActive.
    //    - Finally, count how many such users exist.
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
          completedCount: { $addToSet: "$module_id" }, // use $addToSet to count distinct module_ids
        },
      },
      {
        $project: {
          countDistinct: { $size: "$completedCount" }, // how many distinct active modules this user completed
        },
      },
      {
        $match: {
          countDistinct: numActive, // only those users who completed _all_ active modules
        },
      },
      {
        $count: "usersCompletedAll", // yield { usersCompletedAll: <number> }
      },
    ]);                                                                       

    // If aggregation returns an array with one document { usersCompletedAll: X }, extract X; otherwise zero.
    const totalAssessmentsCompleted =
      (completedAllCandidatesAgg.length > 0
        ? completedAllCandidatesAgg[0].usersCompletedAll
        : 0);

    // 4. Compute average completion rate (unchanged from before):
    //    (completedModuleResults_for_candidateUsers) / (totalModuleResults_for_candidateUsers) * 100
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

module.exports = { getDashboardSummary };
