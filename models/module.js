const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const moduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: false,
      enum: ["personality", "aptitude", "behavioral", "cognitive"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      required: false,
    },
    questions: {
      type: Number,
      default: 0,
      min: 0,
    },
    average_time: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    max_score: {
      type: Number,
      required: false,
    },
    webgl_url: {  //for Unity WebGL URL
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

moduleSchema.plugin(mongooseSequence, { inc_field: "module_id" });

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
