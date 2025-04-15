const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");

console.log("authRoutes typeof:", typeof authRoutes); // should be 'function'
console.log("authRoutes:", authRoutes);
router.use("/auth", authRoutes);

module.exports = router;
