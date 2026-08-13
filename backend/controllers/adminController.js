const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");
const Message = require("../models/messageModel");
const { generateToken } = require("../utils/chatbotToken");

// Login Admin (Static env credentials comparison)
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminJwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!adminEmail || !adminPassword || !adminJwtSecret) {
      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

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

// Get Analytics (Counts for Businesses, Sessions, Messages, Categories, and Monthly Trends)
const getAnalytics = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const totalBusinesses = await User.countDocuments().catch(() => 0);
    const totalSessions = await Session.countDocuments().catch(() => 0);
    const totalMessages = await Message.countDocuments().catch(() => 0);
    const recentBusinesses7d = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }).catch(() => 0);
    const recentSessions7d = await Session.countDocuments({ createdAt: { $gte: sevenDaysAgo } }).catch(() => 0);
    const userMessagesCount = await Message.countDocuments({ role: "user" }).catch(() => 0);
    const botMessagesCount = await Message.countDocuments({ role: { $ne: "user" } }).catch(() => 0);

    let categoryAggregation = [];
    try {
      categoryAggregation = await User.aggregate([
        {
          $group: {
            _id: { $ifNull: ["$bussinessCategory", "General"] },
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (e) {
      categoryAggregation = [];
    }

    let monthlyAggregation = [];
    try {
      monthlyAggregation = await User.aggregate([
        {
          $project: {
            createdDate: { $ifNull: ["$createdAt", new Date()] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdDate" },
              month: { $month: "$createdDate" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    } catch (e) {
      monthlyAggregation = [];
    }

    return res.status(200).json({
      success: true,
      data: {
        totalBusinesses,
        totalSessions,
        totalMessages,
        recentBusinesses7d,
        recentSessions7d,
        userMessagesCount,
        botMessagesCount,
        categoryAggregation,
        monthlyAggregation,
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
    const limit = parseInt(req.query.limit, 10) || 1000;
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


// Delete a business and ALL its related data (messages + sessions + user)
const deleteBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate id format first
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID format",
      });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const business = await User.findById(objectId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const businessName = business.bussinessName;

    // Delete ALL related data in parallel — messages, sessions, then the user itself
    const [msgResult, sessionResult] = await Promise.all([
      Message.deleteMany({ chatbotId: objectId }),
      Session.deleteMany({ chatbotId: objectId }),
    ]);

    // Finally delete the user/business account itself
    await User.findByIdAndDelete(objectId);

    console.log(
      `[Admin Delete] Business "${businessName}" (${id}) wiped: ` +
      `${msgResult.deletedCount} messages, ${sessionResult.deletedCount} sessions, 1 user`
    );

    return res.status(200).json({
      success: true,
      message: `"${businessName}" permanently deleted`,
      deleted: {
        messages: msgResult.deletedCount,
        sessions: sessionResult.deletedCount,
        business: 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Business Data
const updateBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      bussinessName,
      bussinessCategory,
      bussinessDescription,
      bussinessDetails,
      generateNewToken
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // mongoose pre-save hook will hash this
    if (bussinessName) user.bussinessName = bussinessName;
    if (bussinessCategory) user.bussinessCategory = bussinessCategory;
    if (bussinessDescription) user.bussinessDescription = bussinessDescription;
    
    if (bussinessDetails && Array.isArray(bussinessDetails)) {
      user.bussinessDetails = bussinessDetails;
    }

    if (generateNewToken) {
      user.chatbot_token = await generateToken();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      business: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bussinessName: user.bussinessName,
        chatbot_token: user.chatbot_token
      }
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
  deleteBusiness,
  updateBusiness,
};
