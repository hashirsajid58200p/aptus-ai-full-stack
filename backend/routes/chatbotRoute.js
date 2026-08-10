const express = require("express");
const router = express.Router();
const {
    getResponse,
    testByOwner,
    generateTextGeneral
} = require("../controllers/chatbotController");
const { isAuthenticatedUser } = require("../middleware/Auth");
const validateWidget = require("../middleware/validateWidget");

router.route("/getResponse").post(validateWidget, getResponse);

router.route("/generate").post(generateTextGeneral);

router.route("/test/owner").post(isAuthenticatedUser, testByOwner);



module.exports = router;





