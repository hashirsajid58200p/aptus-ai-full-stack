const express = require("express");
const router = express.Router();
const {
    getResponse,
    testByOwner,
    generateTextGeneral
} = require("../controllers/chatbotController");
const { isAuthenticatedUser } = require("../middleware/Auth");





router.route("/getResponse").post(getResponse);

router.route("/generate").post(generateTextGeneral);

router.route("/test/owner").post(isAuthenticatedUser,testByOwner)



module.exports = router;





