const express = require("express");
const router = express.Router();
const {
    createSession,
    addMessageToSession,
    getOwnerSessions
} = require("../controllers/sessionController");
const validateWidget = require("../middleware/validateWidget");
const { isAuthenticatedUser } = require("../middleware/Auth");
const { widgetCors, dashboardCors } = require("../config/cors");

router.route("/addMessages").options(widgetCors).post(widgetCors, validateWidget, addMessageToSession);
router.route("/create").options(widgetCors).post(widgetCors, validateWidget, createSession);
router.route("/owner/all").options(dashboardCors).get(dashboardCors, isAuthenticatedUser, getOwnerSessions);

module.exports = router;
