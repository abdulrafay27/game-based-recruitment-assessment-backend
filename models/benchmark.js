const mongoose = require("mongoose");

const BenchmarkSchema = new mongoose.Schema({
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  min_score: {
    type: Number,
    required: true,
  },
  max_score: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keyStrengths:{
    type: String,
    required: false,
  },
  potentialChallenges:{
    type: String,
    required: false,
  },
  developmentRecommendations:{
    type: String,
    required: false,
  },
  careerRecommendations:{
    type: String,
    required: false,
  },

});

module.exports = mongoose.model("Benchmark", BenchmarkSchema);
