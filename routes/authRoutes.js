const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserById,
  getUserByName,
  getTotalCandidates,
} = require("../controllers/authController");

// Define auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", getUserById);
router.get("/user", getUserByName);
router.get("/dashboard", getTotalCandidates);

module.exports = router;
console.log("authRoutes.js loaded");

/*
// routes/authRoutes.js
const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');

// Define auth routes using the methods on authController:
router.post(  '/register',             authController.register);
router.post(  '/login',                authController.login);
router.get(   '/profile/:id',          authController.getUserById);
router.get(   '/user',                 authController.getUserByName);

// (Optional) log that this file loaded:
console.log('authRoutes.js loaded');

module.exports = router;

*/
