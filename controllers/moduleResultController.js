const ModuleResult = require("../models/moduleResultModel");

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
  } catch (error) {
    console.error("Error submitting module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
