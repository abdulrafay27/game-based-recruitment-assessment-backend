const Module = require("../models/module");
const Benchmark = require("../models/benchmark");

// Create a new module
// POST /api/modules
exports.addModule = async (req, res) => {
  const {
    name,
    type,
    description,
    questions,
    timeLimit,
    status,
    webgl_url,
  } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required." });
  }

  try {
    const newModule = new Module({
      name,
      type,
      description: description || "",
      questions: questions || 0,
      average_time: timeLimit || 0,
      status: status || "draft",
      webgl_url: webgl_url || "",
      updated: Date.now(),
    });

    await newModule.save();
    return res.status(201).json({
      message: "Module added successfully",
      module: newModule,
    });
  } catch (error) {
    console.error("Error adding Module:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();

    if (modules.length == 0) {
      res.status(404).json({ message: "No Modules Found" });
    }
    res
      .status(200)
      .json({ message: "Modules fetched successfully", modules: modules });
  } catch {
    console.error("Error fetching Modules: ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllActiveModules = async (req, res) => {
  try {
    const modules = await Module.find({status : "active"});

    if (modules.length == 0) {
      res.status(404).json({ message: "No Modules Found" });
    }
    res
      .status(200)
      .json({ message: "Modules fetched successfully", modules: modules });
  } catch {
    console.error("Error fetching Modules: ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getModuleCount = async (req, res) => {
  try {
    const count = await Module.countDocuments();
    res.status(200).json({ totalModules: count });
  } catch (error) {
    console.error("Error getting module count:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// /api/modules/total-modules-candidates
exports.getModuleCountForCandidates = async (req, res) => {
  try {
    const count = await Module.countDocuments({ status: "active" });
    res.status(200).json({ totalModules: count });
  } catch (error) {
    console.error("Error getting module count:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);  // Include the webgl_url in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing module
// PUT /api/modules/:id
exports.updateModule = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    description,
    questions,
    timeLimit,
    status,
    webgl_url,
  } = req.body;

  try {
    const moduleToUpdate = await Module.findById(id);
    if (!moduleToUpdate) {
      return res.status(404).json({ message: "Module not found" });
    }

    // Update only provided fields
    if (name !== undefined) moduleToUpdate.name = name;
    if (type !== undefined) moduleToUpdate.type = type;
    if (description !== undefined) moduleToUpdate.description = description;
    if (questions !== undefined) moduleToUpdate.questions = questions;
    if (timeLimit !== undefined) moduleToUpdate.timeLimit = timeLimit;
    if (status !== undefined) moduleToUpdate.status = status;
    if (webgl_url !== undefined) moduleToUpdate.webgl_url = webgl_url;

    moduleToUpdate.updated = Date.now();

    const updatedModule = await moduleToUpdate.save();
    return res.status(200).json({
      message: "Module updated successfully",
      module: updatedModule,
    });
  } catch (error) {
    console.error("Error updating Module:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a module
// DELETE /api/modules/:id
exports.deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Module.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Module not found" });
    }
    // Also delete any benchmarks tied to this module (optional)
    await Benchmark.deleteMany({ module_id: id });
    return res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting Module:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Change only the status field of a module
// PATCH /api/modules/:id/status
exports.changeModuleStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "active", "inactive", or "draft"

  if (!["active", "inactive", "draft"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const moduleToUpdate = await Module.findById(id);
    if (!moduleToUpdate) {
      return res.status(404).json({ message: "Module not found" });
    }

    moduleToUpdate.status = status;
    moduleToUpdate.updated = Date.now();
    const updatedModule = await moduleToUpdate.save();

    return res.status(200).json({
      message: "Module status updated successfully",
      module: updatedModule,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBenchmarksByModuleId = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find({ module_id: req.params.id });
    res.status(200).json({ benchmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBenchmark = async (req, res) => {
  const { module_id, min_score, max_score, description } = req.body;

  try {
    const newBenchmark = new Benchmark({
      module_id,
      min_score,
      max_score,
      description,
    });

    await newBenchmark.save();
    res.status(201).json({ message: "Benchmark added successfully" });
  } catch (error) {
    console.error("Error adding Benchmark:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};