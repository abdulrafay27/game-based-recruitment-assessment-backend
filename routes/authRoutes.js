const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserById,
  getUserByName,
} = require("../controllers/authController");

// Define auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", getUserById);
router.get("/user", getUserByName);

module.exports = router;
console.log("authRoutes.js loaded");
