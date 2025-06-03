const express = require("express");
const router = express.Router();
const {
  addModule,
  getAllModules,
  getModuleCount,
  getModuleById,
  updateModule,
  deleteModule,
  changeModuleStatus,
  getModuleCountForCandidates,
  getAllActiveModules,
  getBenchmarksByModuleId,
  addBenchmark,
} = require("../controllers/moduleController");

router.post("/", addModule);
router.get("/", getAllModules);
router.get("/active", getAllActiveModules);
router.get("/total-modules", getModuleCount);
router.get("/count/active", getModuleCountForCandidates);
router.get("/:id", getModuleById);
router.put("/:id", updateModule);
router.delete("/:id", deleteModule);
router.patch("/:id/status", changeModuleStatus);
router.get("/benchmarks/:id", getBenchmarksByModuleId);
router.post("/benchmarks", addBenchmark);

module.exports = router;
