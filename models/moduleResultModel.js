const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const moduleResultSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    ModuleScore: {
      type: Number,
      required: false,
    },
    Status: {
      type: String,
      enum: ["Not Started", "Started", "Completed"],
      default: "Not Started",
    },
    start_time: {
      type: Date,
      required: false,
    },
    end_time: {
      type: Date,
      required: false,
    },
    module_time: {
      type: Number, // Time in seconds or milliseconds
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-increment for module_result_id
moduleResultSchema.plugin(mongooseSequence, { inc_field: "module_result_id" });

const ModuleResult = mongoose.model("ModuleResult", moduleResultSchema);
module.exports = ModuleResult;
