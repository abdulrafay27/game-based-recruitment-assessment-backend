const mongoose = require("mongoose");

// Define the FAQ schema based on the provided JSON schema
const faqSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true, // Ensure unique IDs
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set the creation time
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set the update time
  },
});

// Create FAQ model
const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
