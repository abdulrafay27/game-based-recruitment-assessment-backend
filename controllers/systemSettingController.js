// controllers/systemSettingController.js
const SystemSetting = require("../models/systemSetting");

// Helper: Fetch the single SystemSetting document, or create default if none exists
async function getOrCreateSettingDoc() {
  let doc = await SystemSetting.findOne();
  if (!doc) {
    doc = new SystemSetting();
    await doc.save();
  }
  return doc;
}

// GET /api/settings/general
exports.getGeneralSettings = async (req, res) => {
  try {
    const doc = await getOrCreateSettingDoc();
    const { siteName, siteDescription, supportEmail, maintenanceMode } = doc;
    return res.status(200).json({ siteName, siteDescription, supportEmail, maintenanceMode });
  } catch (error) {
    console.error("Error fetching general settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/settings/general
exports.updateGeneralSettings = async (req, res) => {
  const { siteName, siteDescription, supportEmail, maintenanceMode } = req.body;
  try {
    const doc = await getOrCreateSettingDoc();
    if (siteName !== undefined) doc.siteName = siteName;
    if (siteDescription !== undefined) doc.siteDescription = siteDescription;
    if (supportEmail !== undefined) doc.supportEmail = supportEmail;
    if (maintenanceMode !== undefined) doc.maintenanceMode = maintenanceMode;
    await doc.save();
    return res.status(200).json({ message: "General settings updated", general: {
      siteName: doc.siteName,
      siteDescription: doc.siteDescription,
      supportEmail: doc.supportEmail,
      maintenanceMode: doc.maintenanceMode
    }});
  } catch (error) {
    console.error("Error updating general settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/settings/notifications
exports.getNotificationSettings = async (req, res) => {
  try {
    const doc = await getOrCreateSettingDoc();
    const { emailNotifications, adminAlerts, assessmentReminders } = doc;
    return res.status(200).json({ emailNotifications, adminAlerts, assessmentReminders });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/settings/notifications
exports.updateNotificationSettings = async (req, res) => {
  const { emailNotifications, adminAlerts, assessmentReminders } = req.body;
  try {
    const doc = await getOrCreateSettingDoc();
    if (emailNotifications !== undefined) doc.emailNotifications = emailNotifications;
    if (adminAlerts !== undefined) doc.adminAlerts = adminAlerts;
    if (assessmentReminders !== undefined) doc.assessmentReminders = assessmentReminders;
    await doc.save();
    return res.status(200).json({ message: "Notification settings updated", notification: {
      emailNotifications: doc.emailNotifications,
      adminAlerts: doc.adminAlerts,
      assessmentReminders: doc.assessmentReminders
    }});
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/settings/security
exports.getSecuritySettings = async (req, res) => {
  try {
    const doc = await getOrCreateSettingDoc();
    const { twoFactorAuth, passwordExpiryDays, sessionTimeoutMins } = doc;
    return res.status(200).json({ twoFactorAuth, passwordExpiryDays, sessionTimeoutMins });
  } catch (error) {
    console.error("Error fetching security settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/settings/security
exports.updateSecuritySettings = async (req, res) => {
  const { twoFactorAuth, passwordExpiryDays, sessionTimeoutMins } = req.body;
  try {
    const doc = await getOrCreateSettingDoc();
    if (twoFactorAuth !== undefined) doc.twoFactorAuth = twoFactorAuth;
    if (passwordExpiryDays !== undefined) doc.passwordExpiryDays = passwordExpiryDays;
    if (sessionTimeoutMins !== undefined) doc.sessionTimeoutMins = sessionTimeoutMins;
    await doc.save();
    return res.status(200).json({ message: "Security settings updated", security: {
      twoFactorAuth: doc.twoFactorAuth,
      passwordExpiryDays: doc.passwordExpiryDays,
      sessionTimeoutMins: doc.sessionTimeoutMins
    }});
  } catch (error) {
    console.error("Error updating security settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/settings/integrations
exports.getIntegrationSettings = async (req, res) => {
  try {
    const doc = await getOrCreateSettingDoc();
    const { apiKey, webhookUrl, enableWebhooks } = doc;
    return res.status(200).json({ apiKey, webhookUrl, enableWebhooks });
  } catch (error) {
    console.error("Error fetching integration settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/settings/integrations
exports.updateIntegrationSettings = async (req, res) => {
  const { apiKey, webhookUrl, enableWebhooks } = req.body;
  try {
    const doc = await getOrCreateSettingDoc();
    if (apiKey !== undefined) doc.apiKey = apiKey;
    if (webhookUrl !== undefined) doc.webhookUrl = webhookUrl;
    if (enableWebhooks !== undefined) doc.enableWebhooks = enableWebhooks;
    await doc.save();
    return res.status(200).json({ message: "Integration settings updated", integration: {
      apiKey: doc.apiKey,
      webhookUrl: doc.webhookUrl,
      enableWebhooks: doc.enableWebhooks
    }});
  } catch (error) {
    console.error("Error updating integration settings:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
