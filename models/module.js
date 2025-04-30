const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose); // Pass mongoose to the plugin

// Define the Module schema
const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    average_time: {
      type: Number,
      required: false,
    },
    max_score: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Apply auto-increment on the 'id' field
moduleSchema.plugin(mongooseSequence, { inc_field: "module_id" });

// Create Module Model
const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
