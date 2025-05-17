const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

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

faqSchema.plugin(mongooseSequence, { inc_field: "faq_id" });

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
