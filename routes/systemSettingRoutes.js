// routes/systemSettingRoutes.js
const express = require("express");
const router = express.Router();

const {
  getGeneralSettings,
  updateGeneralSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getSecuritySettings,
  updateSecuritySettings,
  getIntegrationSettings,
  updateIntegrationSettings,
} = require("../controllers/systemSettingController");

// General
router.get("/general", getGeneralSettings);
router.put("/general", updateGeneralSettings);

// Notifications
router.get("/notifications", getNotificationSettings);
router.put("/notifications", updateNotificationSettings);

// Security
router.get("/security", getSecuritySettings);
router.put("/security", updateSecuritySettings);

// Integrations
router.get("/integrations", getIntegrationSettings);
router.put("/integrations", updateIntegrationSettings);

module.exports = router;
