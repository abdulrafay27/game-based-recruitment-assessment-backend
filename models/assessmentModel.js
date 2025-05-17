const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const assessmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ModuleResult",
        required: true,
      },
    ],
    total_time_taken: {
      type: Number,
      required: true,
    },
    average_time_per_module: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

assessmentSchema.plugin(mongooseSequence, { inc_field: "assessment_id" });

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
