const express = require("express");
const router = express.Router();
const {
    getResponse,
    testByOwner,
    generateTextGeneral,
    getDetails,
} = require("../controllers/chatbotController");
const { isAuthenticatedUser } = require("../middleware/Auth");
const validateWidget = require("../middleware/validateWidget");
const { widgetCors, dashboardCors } = require("../config/cors");

router.route("/getResponse").options(widgetCors).post(widgetCors, validateWidget, getResponse);

router.route("/generate").options(widgetCors).post(widgetCors, validateWidget, generateTextGeneral);

router.route("/test/owner").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, testByOwner);

// Public endpoint — validates a chatbot widget token and returns safe business info
router.route("/getDetails").options(widgetCors).get(widgetCors, getDetails);



module.exports = router;





