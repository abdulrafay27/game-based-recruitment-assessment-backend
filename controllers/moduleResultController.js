const ModuleResult = require("../models/moduleResultModel");
const { updateModuleAverageTime } = require("../services/moduleService");

exports.startModule = async (req, res) => {
  const { user_id, module_id } = req.body;
  if (!user_id || !module_id) {
    return res.status(400).json({ message: "user_id and module_id are required" });
  }

  try {
    // 1️⃣ Already completed?
    const completed = await ModuleResult.findOne({ user_id, module_id, Status: "Completed" });
    if (completed) {
      return res.status(409).json({
        message: "Module already completed",
        module_result: completed
      });
    }

    // 2️⃣ Already started?
    let started = await ModuleResult.findOne({ user_id, module_id, Status: "Started" });
    if (started) {
      return res.status(200).json({
        message: "Module already started",
        module_result: started
      });
    }

    // 3️⃣ New start
    started = new ModuleResult({
      user_id,
      module_id,
      Status: "Started",
      start_time: new Date(),
    });
    await started.save();

    res.status(201).json({
      message: "Module started successfully",
      module_result: started,
    });
  } catch (error) {
    console.error("Error starting module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*
exports.startModule = async (req, res) => {
  const { user_id, module_id } = req.body;

  if (!user_id || !module_id) {
    return res
      .status(400)
      .json({ message: "user_id and module_id are required" });
  }

  try {
    const newModuleResult = new ModuleResult({
      user_id,
      module_id,
      Status: "Started",
      start_time: new Date(),
    });

    await newModuleResult.save();

    res.status(201).json({
      message: "Module started successfully",
      module_result: newModuleResult,
    });
  } catch (error) {
    console.error("Error starting module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}; 
*/

exports.submitModule = async (req, res) => {
  const { user_id, module_id, ModuleScore } = req.body;

  if (!user_id || !module_id || ModuleScore === undefined) {
    return res
      .status(400)
      .json({ message: "user_id, module_id, and ModuleScore are required" });
  }

  try {
    const result = await ModuleResult.findOne({ user_id, module_id });

    if (!result) {
      return res.status(404).json({ message: "ModuleResult not found" });
    }

    const end_time = new Date();
    const module_time = (end_time - result.start_time) / 1000; // in seconds

    result.Status = "Completed";
    result.end_time = end_time;
    result.ModuleScore = ModuleScore;
    result.module_time = module_time;

    await result.save();

    res.status(200).json({
      message: "Module submitted successfully",
      module_result: result,
    });
    await updateModuleAverageTime(module_id);
  } catch (error) {
    console.error("Error submitting module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCompletedCount = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) 
    return res.status(400).json({ message: "user_id required" });
  try {
    const count = await ModuleResult.countDocuments({
      user_id,
      Status: "Completed"
    });
    res.json({ completedModules: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/moduleResults/user/:userId
exports.getUserResults = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const results = await ModuleResult.find({
      user_id: userId,
      Status: "Completed"
    }).select("module_id ModuleScore -_id");
    res.json({ module_results: results });
  } catch (err) {
    console.error("Error fetching user results:", err);
    res.status(500).json({ message: "Server error" });
  }
};

