const express = require("express");
const router = express.Router();
const {
  addModule,
  getAllModules,
  getModuleCount,
  getModuleById
} = require("../controllers/moduleController");

router.post("/", addModule);
router.get("/", getAllModules);
router.get("/total-modules", getModuleCount);
router.get("/:id", getModuleById);

module.exports = router;
