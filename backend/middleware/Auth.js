const catchAsyncError=require("./catchAsyncError")
const jwt=require("jsonwebtoken")
const User = require("../models/userModel")

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

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

