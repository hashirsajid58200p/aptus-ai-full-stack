const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");
const Message = require("../models/messageModel");

// Login Admin (Static env credentials comparison)
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || "admin@aptus.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "aptus_admin_secret_2026";
    const adminJwtSecret = process.env.ADMIN_JWT_SECRET || "aptus_admin_jwt_secret_key_2026_x89a";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Sign JWT with admin role
    const token = jwt.sign({ role: "admin" }, adminJwtSecret, {
      expiresIn: "7d",
    });

    const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE || "7", 10);
    const options = {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    };

    return res.status(200).cookie("adminToken", token, options).json({
      success: true,
      token,
      message: "Admin logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Logout Admin
const logoutAdmin = async (req, res, next) => {
  try {
    res.cookie("adminToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Analytics (Counts for Businesses, Sessions, Messages, and 7-day trend)
const getAnalytics = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalBusinesses,
      totalSessions,
      totalMessages,
      recentBusinesses7d,
      recentSessions7d,
    ] = await Promise.all([
      User.countDocuments(),
      Session.countDocuments(),
      Message.countDocuments(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Session.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalBusinesses,
        totalSessions,
        totalMessages,
        recentBusinesses7d,
        recentSessions7d,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Registered Businesses (Paginated, password explicitly excluded)
const getAllBusinesses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [businesses, totalCount] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return res.status(200).json({
      success: true,
      totalCount,
      page,
      totalPages,
      data: businesses,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Business Details by ID (password explicitly excluded)
const getBusinessById = async (req, res, next) => {
  try {
    const business = await User.findById(req.params.id).select("-password");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getAnalytics,
  getAllBusinesses,
  getBusinessById,
};
