const express = require('express');
const router = express.Router();
const Assessment = require('../models/assessmentModel');
const ModuleResult = require('../models/moduleResultModel');
const User = require('../models/userModel');

// Get analytics data
router.get("/", async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    // Monthly Completion
    const monthlyCompletion = await ModuleResult.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$Status", "Completed"] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [
                { $in: ["$Status", ["Not Started", "Started"]] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          completed: 1,
          pending: 1,
          name: {
            $let: {
              vars: {
                monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              },
              in: { $arrayElemAt: ["$$monthNames", { $subtract: ["$_id.month", 1] }] }
            }
          }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    // Skills Distribution
    const skillsDistribution = await ModuleResult.aggregate([
      {
        $group: {
          _id: "$module_id",
          candidates: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "modules", // Adjust collection name if needed
          localField: "_id",
          foreignField: "_id",
          as: "module"
        }
      },
      { $unwind: "$module" },
      {
        $project: {
          _id: 0,
          name: "$module.name",
          candidates: 1
        }
      }
    ]);

    // Assessment Trends
    const assessmentTrends = await Assessment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          assessments: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          assessments: 1,
          name: {
            $let: {
              vars: {
                monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              },
              in: { $arrayElemAt: ["$$monthNames", { $subtract: ["$_id.month", 1] }] }
            }
          }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json({
      monthlyCompletion,
      skillsDistribution,
      assessmentTrends
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;