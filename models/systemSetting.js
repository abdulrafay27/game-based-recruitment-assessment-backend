// models/systemSetting.js
const mongoose = require("mongoose");

const SystemSettingSchema = new mongoose.Schema(
  {
    // General
    siteName: {
      type: String,
      default: "GameOn Assessment",
      trim: true,
    },
    siteDescription: {
      type: String,
      default: "Personality and aptitude assessment platform",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "support@gameon.com",
      trim: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    // Notifications
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    adminAlerts: {
      type: Boolean,
      default: true,
    },
    assessmentReminders: {
      type: Boolean,
      default: true,
    },

    // Security
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    passwordExpiryDays: {
      type: Number,
      default: 90,
      min: 0,
    },
    sessionTimeoutMins: {
      type: Number,
      default: 30,
      min: 1,
    },

    // API Integrations
    apiKey: {
      type: String,
      default: "",
      trim: true,
    },
    webhookUrl: {
      type: String,
      default: "",
      trim: true,
    },
    enableWebhooks: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// We expect only one global settings document.
// Optionally, create an index or ensure one document per collection.
module.exports = mongoose.model("SystemSetting", SystemSettingSchema);
