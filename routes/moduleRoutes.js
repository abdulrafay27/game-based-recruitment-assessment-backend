const express = require("express");
const router = express.Router();
const {
  addModule,
  getAllModules,
  getModuleCount,
} = require("../controllers/moduleController");

router.post("/", addModule);
router.get("/", getAllModules);
router.get("/total-modules", getModuleCount);

module.exports = router;
