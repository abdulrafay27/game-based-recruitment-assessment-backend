const faqModel = require("../models/faqModel"); // Import the updated faqModel

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await faqModel.find(); // Use Mongoose's find method to fetch all FAQs

    if (faqs.length === 0) {
      return res.status(404).json({ message: "No FAQs found" });
    }

    res.status(200).json({
      message: "FAQs fetched successfully",
      faqs: faqs,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new FAQ
exports.addFAQ = async (req, res) => {
  const { id, question, answer } = req.body;

  try {
    // Create and save the new FAQ
    const newFAQ = new faqModel({
      id,
      question,
      answer,
      created_at: new Date(), // Set created_at to current date
      updated_at: new Date(), // Set updated_at to current date
    });

    await newFAQ.save(); // Save the FAQ to MongoDB

    res.status(201).json({ message: "FAQ added successfully" });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
