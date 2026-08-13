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

router.route("/getResponse").post(validateWidget, getResponse);

router.route("/generate").post(validateWidget, generateTextGeneral);

router.route("/test/owner").post(isAuthenticatedUser, testByOwner);

// Public endpoint — validates a chatbot widget token and returns safe business info
router.route("/getDetails").get(getDetails);



module.exports = router;





