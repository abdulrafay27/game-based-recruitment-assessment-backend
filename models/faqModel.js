const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose); // Pass mongoose to the plugin

// Define the FAQ schema
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Apply auto-increment on the 'id' field
faqSchema.plugin(mongooseSequence, { inc_field: "faq_id" });

// Create FAQ model
const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
