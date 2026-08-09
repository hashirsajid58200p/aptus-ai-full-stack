const express = require("express");
const router = express.Router();
const {
    createSession,
    addMessageToSession
} = require("../controllers/sessionController");


router.route("/addMessages").post(addMessageToSession);


router.route("/create").post(createSession);

module.exports = router;
