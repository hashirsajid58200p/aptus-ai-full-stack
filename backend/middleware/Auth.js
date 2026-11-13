const mongoose = require("mongoose");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    let token = null;

    // Prefer explicit Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token || typeof token !== "string" || token.trim() === "") {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource",
      });
    }

    try {
      const secret = process.env.JWT_SECRET || "aptus_default_jwt_secret_fallback_key_2026";
      const decodedData = jwt.verify(token.trim(), secret);

      if (!decodedData || !decodedData.id || !mongoose.Types.ObjectId.isValid(decodedData.id)) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload. Please log in again.",
        });
      }

      req.user = await User.findById(decodedData.id);
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found with this id",
        });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource",
      });
    }
    next();
});

