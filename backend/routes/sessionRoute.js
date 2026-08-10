const express = require("express");
const router = express.Router();
const {
    createSession,
    addMessageToSession,
    getOwnerSessions
} = require("../controllers/sessionController");
const validateWidget = require("../middleware/validateWidget");
const { isAuthenticatedUser } = require("../middleware/Auth");

router.route("/addMessages").post(validateWidget, addMessageToSession);
router.route("/create").post(validateWidget, createSession);
router.route("/owner/all").get(isAuthenticatedUser, getOwnerSessions);

module.exports = router;
