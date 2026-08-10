const mongoose = require("mongoose");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");

const validateWidget = catchAsyncError(async (req, res, next) => {
  const token = req.body.token || req.headers["x-chatbot-token"] || req.query.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Chatbot authentication token is required",
    });
  }

  // Validate session_id format if provided in request body
  const session_id = req.body.session_id || req.body.sessionId;
  if (session_id && !mongoose.Types.ObjectId.isValid(session_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid session ID format",
    });
  }

  // Find business owner exclusively by token
  const owner = await User.findOne({ chatbot_token: token });

  if (!owner) {
    return res.status(404).json({
      success: false,
      message: "Invalid or inactive chatbot token",
    });
  }

  // Domain Origin Validation (if owner has allowedDomain configured)
  if (owner.allowedDomain && owner.allowedDomain.trim() !== "") {
    const requestOrigin = req.headers.origin || req.headers.referer;

    if (requestOrigin) {
      try {
        const allowedHost = new URL(owner.allowedDomain.includes("://") ? owner.allowedDomain : `https://${owner.allowedDomain}`).hostname;
        const requestHost = new URL(requestOrigin).hostname;

        if (allowedHost !== requestHost && requestHost !== "localhost" && requestHost !== "127.0.0.1") {
          return res.status(403).json({
            success: false,
            message: `Forbidden: Request origin (${requestHost}) is not authorized for this chatbot token`,
          });
        }
      } catch (err) {
        console.error("Origin parsing error:", err);
      }
    }
  }

  // Attach verified owner context to request
  req.owner = owner;
  req.chatbot_id = owner._id;

  next();
});

module.exports = validateWidget;
