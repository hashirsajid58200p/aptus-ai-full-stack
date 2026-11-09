const express = require("express");
const router = express.Router();
const {
    createSession,
    addMessageToSession,
    getOwnerSessions,
    exportSessionsCSV,
    takeoverSession,
    sendAgentMessage,
    getSessionMessages,
    requestLiveAgent
} = require("../controllers/sessionController");
const validateWidget = require("../middleware/validateWidget");
const { isAuthenticatedUser } = require("../middleware/Auth");
const { widgetCors, dashboardCors } = require("../config/cors");

router.route("/addMessages").options(widgetCors).post(widgetCors, validateWidget, addMessageToSession);
router.route("/create").options(widgetCors).post(widgetCors, validateWidget, createSession);
router.route("/owner/all").options(dashboardCors).get(dashboardCors, isAuthenticatedUser, getOwnerSessions);
router.route("/owner/export").options(dashboardCors).get(dashboardCors, isAuthenticatedUser, exportSessionsCSV);
router.route("/takeover").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, takeoverSession);
router.route("/agent-message").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, sendAgentMessage);
router.route("/messages").options(widgetCors).get(widgetCors, validateWidget, getSessionMessages);
router.route("/request-human").options(widgetCors).post(widgetCors, validateWidget, requestLiveAgent);

module.exports = router;
