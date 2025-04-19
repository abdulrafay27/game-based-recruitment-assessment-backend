const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController"); // Import faqController

// Route to get all FAQs
router.get("/", faqController.getFAQs);

// Route to add a new FAQ
router.post("/", faqController.addFAQ);

module.exports = router;
