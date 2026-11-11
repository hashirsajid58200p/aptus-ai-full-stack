const express = require("express");
const router = express.Router();
const {
    getResponse,
    testByOwner,
    generateTextGeneral,
    getDetails,
    transcribeAudio,
    updateModelSettings,
} = require("../controllers/chatbotController");
const { isAuthenticatedUser } = require("../middleware/Auth");
const validateWidget = require("../middleware/validateWidget");
const { checkTokenQuota } = require("../middleware/tokenTracker");
const { widgetCors, dashboardCors } = require("../config/cors");

router.route("/getResponse").options(widgetCors).post(widgetCors, validateWidget, checkTokenQuota, getResponse);

router.route("/generate").options(widgetCors, dashboardCors).post(
  (req, res, next) => {
    if (req.body.token || req.headers["x-chatbot-token"] || req.query.token) {
      return validateWidget(req, res, next);
    }
    return isAuthenticatedUser(req, res, next);
  },
  checkTokenQuota,
  generateTextGeneral
);

router.route("/test/owner").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, testByOwner);

// Public endpoint — validates a chatbot widget token and returns safe business info
router.route("/getDetails").options(widgetCors).get(widgetCors, validateWidget, getDetails);

// Voice STT Transcription endpoint (Groq Whisper)
router.route("/transcribe").options(widgetCors).post(widgetCors, validateWidget, checkTokenQuota, transcribeAudio);

// Update model settings
router.route("/model-settings").options(dashboardCors).put(dashboardCors, isAuthenticatedUser, updateModelSettings);

module.exports = router;
