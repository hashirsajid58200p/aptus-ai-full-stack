const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  loadUserProfile,
  addBussinessDetails,
  updateBussinessDetails,
  deleteBussinessDetails,
  generateNewToken,
  findChatbotUsingToken
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/Auth");
const { widgetCors, dashboardCors } = require("../config/cors");

router.route("/register").post(dashboardCors, registerUser);
router.route("/login").post(dashboardCors, loginUser);
router.route("/logout").get(dashboardCors, logoutUser);
router.route("/bussinessDetails").post(dashboardCors, isAuthenticatedUser, addBussinessDetails);

router.route("/businessDetails/:id")
  .put(dashboardCors, isAuthenticatedUser, updateBussinessDetails)
  .delete(dashboardCors, isAuthenticatedUser, deleteBussinessDetails);

router.route("/token").post(dashboardCors, isAuthenticatedUser, generateNewToken);
router.route("/token/verify").get(widgetCors, findChatbotUsingToken);

router
  .route("/me")
  .get(dashboardCors, isAuthenticatedUser, loadUserProfile);

module.exports = router;
