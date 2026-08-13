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

router.route("/register").options(dashboardCors).post(dashboardCors, registerUser);
router.route("/login").options(dashboardCors).post(dashboardCors, loginUser);
router.route("/logout").options(dashboardCors).get(dashboardCors, logoutUser);
router.route("/bussinessDetails").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, addBussinessDetails);

router.route("/businessDetails/:id")
  .options(dashboardCors)
  .put(dashboardCors, isAuthenticatedUser, updateBussinessDetails)
  .delete(dashboardCors, isAuthenticatedUser, deleteBussinessDetails);

router.route("/token").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, generateNewToken);
router.route("/token/verify").options(widgetCors).get(widgetCors, findChatbotUsingToken);

router
  .route("/me")
  .options(dashboardCors)
  .get(dashboardCors, isAuthenticatedUser, loadUserProfile);

module.exports = router;
