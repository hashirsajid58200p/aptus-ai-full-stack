const express = require("express");
const rateLimit = require("express-rate-limit");
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
  findChatbotUsingToken,
  updateAppearance,
  getAvailableModels,
  updateKnowledgeMarkdown
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/Auth");
const { widgetCors, dashboardCors } = require("../config/cors");

// Rate limiter for user login and registration to mitigate brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skip: (req) => process.env.NODE_ENV !== "production",
  message: {
    success: false,
    message: "Too many login or registration attempts. Please try again after 15 minutes.",
  },
});

router.route("/register").options(dashboardCors).post(dashboardCors, authLimiter, registerUser);
router.route("/login").options(dashboardCors).post(dashboardCors, authLimiter, loginUser);
router.route("/logout").options(dashboardCors).get(dashboardCors, logoutUser);
router.route("/bussinessDetails").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, addBussinessDetails);

router.route("/businessDetails/:id")
  .options(dashboardCors)
  .put(dashboardCors, isAuthenticatedUser, updateBussinessDetails)
  .delete(dashboardCors, isAuthenticatedUser, deleteBussinessDetails);

router.route("/token").options(dashboardCors).post(dashboardCors, isAuthenticatedUser, generateNewToken);
router.route("/token/verify").options(widgetCors).get(widgetCors, findChatbotUsingToken);

router.route("/appearance").options(dashboardCors).put(dashboardCors, isAuthenticatedUser, updateAppearance);
router.route("/knowledge").options(dashboardCors).put(dashboardCors, isAuthenticatedUser, updateKnowledgeMarkdown);
router.route("/models").options(dashboardCors).get(dashboardCors, isAuthenticatedUser, getAvailableModels);

router
  .route("/me")
  .options(dashboardCors)
  .get(dashboardCors, isAuthenticatedUser, loadUserProfile);

module.exports = router;
