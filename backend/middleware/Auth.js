const catchAsyncError=require("./catchAsyncError")
const jwt=require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    let token = null;

    // Prefer explicit Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "please login to access this resources"
      });
    }

    try {
      const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({ _id: decodedData.id });
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found with this id"
        });
      }
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "please login to access this resources"
      });
    }
    next();
  });

