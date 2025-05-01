const express = require("express");
const router = express.Router();
const moduleResultsController = require("../controllers/moduleResultController");

router.post("/start-module", moduleResultsController.startModule);
router.put("/submit-module", moduleResultsController.submitModule);
router.get("/completed-count",moduleResultsController.getCompletedCount);

module.exports = router;
