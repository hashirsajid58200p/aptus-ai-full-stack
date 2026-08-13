const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  loginAdmin,
  logoutAdmin,
  getAnalytics,
  getAllBusinesses,
  getBusinessById,
  deleteBusiness,
  updateBusiness,
} = require("../controllers/adminController");
const { isAdminAuthenticated } = require("../middleware/adminAuth");

const router = express.Router();

// Dedicated rate limiter for Admin Login to prevent brute-forcing
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts per IP per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

router.post("/login", adminLoginLimiter, loginAdmin);
router.get("/logout", isAdminAuthenticated, logoutAdmin);
router.post("/logout", isAdminAuthenticated, logoutAdmin);
router.get("/analytics", isAdminAuthenticated, getAnalytics);
router.get("/businesses", isAdminAuthenticated, getAllBusinesses);
router.get("/businesses/:id", isAdminAuthenticated, getBusinessById);
router.get("/business/:id", isAdminAuthenticated, getBusinessById);
router.put("/businesses/:id", isAdminAuthenticated, updateBusiness);
router.delete("/businesses/:id", isAdminAuthenticated, deleteBusiness);

module.exports = router;
