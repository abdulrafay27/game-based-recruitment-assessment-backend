const Module = require("../models/module");

exports.addModule = async (req, res) => {
  const { name } = req.body;

  try {
    // Create and save the new Module
    const newModule = new Module({
      name,
    });

    await newModule.save(); // Save the module to mongoDB

    res.status(201).json({ message: "Module added successfully" });
  } catch (error) {
    console.error("Error adding Module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
