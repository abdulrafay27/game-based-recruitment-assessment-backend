const Assessment = require('../models/assessmentModel');
const User = require('../models/userModel');
const Module = require('../models/module');
const ModuleResult = require('../models/moduleResultModel');

exports.getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const averageScoreResult = await Assessment.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);
    const completedAssessments = await Assessment.countDocuments({ isCompleted: true });
    const completionRate = totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0;

    res.json({
      totalUsers,
      totalAssessments,
      averageScore: averageScoreResult[0]?.avgScore || 0,
      completionRate: completionRate.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Dashboard summary error' });
  }
};

exports.getCompletionTrend = async (req, res) => {
  const range = req.query.range || 'weekly';
  let groupFormat;

  switch (range) {
    case 'daily': groupFormat = '%Y-%m-%d'; break;
    case 'monthly': groupFormat = '%Y-%m'; break;
    case 'weekly':
    default: groupFormat = '%Y-%U'; break;
  }

  try {
    const trend = await Assessment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const labels = trend.map(item => item._id);
    const completionCounts = trend.map(item => item.count);

    res.json({ labels, completionCounts });
  } catch (error) {
    res.status(500).json({ error: 'Completion trend error' });
  }
};

exports.getModuleScores = async (req, res) => {
  try {
    const modules = ['Leadership', 'Teamwork', 'Communication', 'Decision Making'];

    const pipeline = modules.map(module => ({
      $group: {
        _id: module,
        averageScore: { $avg: `$moduleScores.${module}` }
      }
    }));

    const results = await Assessment.aggregate([
      { $project: { moduleScores: 1 } },
      { $replaceRoot: { newRoot: "$moduleScores" } },
      { $facet: pipeline.reduce((acc, group) => {
        acc[group.$group._id] = [{ $group: group.$group }];
        return acc;
      }, {}) }
    ]);

    const formatted = Object.entries(results[0]).map(([module, data]) => ({
      module,
      averageScore: data[0]?.averageScore || 0
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Module scores error' });
  }
};

exports.getTopStrengths = async (req, res) => {
  try {
    const strengthThreshold = 55;
    const modules = ['Leadership', 'Teamwork', 'Communication', 'Decision Making'];

    const result = await Assessment.aggregate([
      { $project: { moduleScores: 1 } },
      { $replaceRoot: { newRoot: "$moduleScores" } },
      {
        $project: modules.reduce((acc, m) => {
          acc[m] = {
            $cond: [{ $gte: [`$${m}`, strengthThreshold] }, 1, 0]
          };
          return acc;
        }, {})
      },
      {
        $group: modules.reduce((acc, m) => {
          acc._id = null;
          acc[m] = { $sum: `$${m}` };
          return acc;
        }, {})
      }
    ]);

    const topModules = Object.entries(result[0] || {})
      .filter(([k]) => k !== '_id')
      .map(([skill, count]) => ({ skill, percentageAboveThreshold: count }))
      .sort((a, b) => b.percentageAboveThreshold - a.percentageAboveThreshold)
      .slice(0, 5);

    res.json(topModules);
  } catch (error) {
    res.status(500).json({ error: 'Top strengths error' });
  }
};

exports.getCandidateGrowth = async (req, res) => {
  try {
    const growthData = await User.aggregate([
      { $match: { role: "candidate" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" }
            ]
          },
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({ growth: growthData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching growth data", error });
  }
};

exports.getSkillsDistribution = async (req, res) => {
  try {
    const distribution = await Module.aggregate([
      {
        $lookup: {
          from: "moduleresults",
          localField: "_id",
          foreignField: "module_id",
          as: "results"
        }
      },
      {
        $project: {
          module: "$name",
          averageScore: {
            $avg: "$results.ModuleScore"
          }
        }
      }
    ]);

    res.status(200).json({ distribution });
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills distribution", error });
  }
};

exports.getAssessmentCompletion = async (req, res) => {
  try {
    const completionStats = await ModuleResult.aggregate([
      { $match: { Status: "Completed" } },
      {
        $group: {
          _id: "$user_id",
          completedModules: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $project: {
          userId: "$_id",
          completedModules: 1,
          user: { $arrayElemAt: ["$userInfo.full_name", 0] }
        }
      }
    ]);

    res.status(200).json({ completionStats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching completion stats", error });
  }
};
