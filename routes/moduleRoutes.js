const express = require("express");
const router = express.Router();
const { addModule, getAllModules } = require("../controllers/moduleController");

router.post("/", addModule);
router.get("/", getAllModules);

module.exports = router;
