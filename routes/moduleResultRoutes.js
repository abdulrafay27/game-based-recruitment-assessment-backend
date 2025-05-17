const express = require("express");
const router = express.Router();
const moduleResultsController = require("../controllers/moduleResultController");

router.post("/start-module", moduleResultsController.startModule);
router.put("/submit-module", moduleResultsController.submitModule);
router.get("/completed-count", moduleResultsController.getCompletedCount);
router.get("/user/:userId", moduleResultsController.getUserResults);
router.get(
  "/all/user/:userId",
  moduleResultsController.getAllUserModuleResults
);
router.get(
  "/dashboard/completed",
  moduleResultsController.countAllCompletedModuleResults
);
router.get(
  "/dashboard/completion-rate",
  moduleResultsController.getAverageCompletionRate
);
module.exports = router;
