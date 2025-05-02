const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

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

moduleSchema.plugin(mongooseSequence, { inc_field: "module_id" });

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
