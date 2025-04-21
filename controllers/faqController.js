const faqModel = require("../models/faqModel"); // Import the faqModel

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await faqModel.getAllFAQs(); // Fetch all FAQs using the model

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
  const { question, answer } = req.body;
  try {
    await faqModel.addFAQ(question, answer); // Add FAQ using the model

    res.status(201).json({ message: "FAQ added successfully" });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
