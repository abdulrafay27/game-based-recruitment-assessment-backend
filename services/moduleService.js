const Module = require("../models/module");
const ModuleResult = require("../models/moduleResultModel");
const mongoose = require("mongoose");

const updateModuleAverageTime = async (moduleId) => {
  try {
    const moduleObjectId = new mongoose.Types.ObjectId(moduleId);

    const result = await ModuleResult.aggregate([
      { $match: { module_id: moduleObjectId, module_time: { $ne: null } } },
      {
        $group: {
          _id: "$module_id",
          avgTime: { $avg: "$module_time" },
        },
      },
    ]);

    if (result.length > 0) {
      const avgTime = result[0].avgTime;
      await Module.findByIdAndUpdate(moduleId, { average_time: avgTime });
    }
  } catch (err) {
    console.error("Failed to update average_time:", err.message);
  }
};

module.exports = { updateModuleAverageTime };
