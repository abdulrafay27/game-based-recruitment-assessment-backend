const express = require("express");
const router = express.Router();
const {
  addModule,
  getAllModules,
  getModuleCount,
  getModuleById,
  getBenchmarksByModuleId,
  addBenchmark,
} = require("../controllers/moduleController");

router.post("/", addModule);
router.get("/", getAllModules);
router.get("/total-modules", getModuleCount);
router.get("/:id", getModuleById);
router.get("/benchmarks/:id", getBenchmarksByModuleId);
router.post("/benchmarks", addBenchmark);

module.exports = router;
