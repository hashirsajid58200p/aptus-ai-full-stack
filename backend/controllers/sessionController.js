const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const Message = require("../models/messageModel");
const Session = require("../models/sessionModel");
const User = require("../models/userModel");

exports.createSession = catchAsyncError(async (req, res, next) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            success: false,
            message: "Please enter username and email"
        });
    }

    const chatbotId = req.chatbot_id;

    const session = await Session.create({
        username,
        email,
        chatbotId
    });

    res.status(200).json({
        success: true,
        session,
        message: "Session created successfully"
    });
});

exports.addMessageToSession = catchAsyncError(async (req, res, next) => {
    const { sessionId, botMessage, userMessage } = req.body;

    if (!sessionId || !botMessage || !userMessage) {
        return res.status(400).json({
            success: false,
            message: "Please enter all required fields"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid session ID format"
        });
    }

    const chatbotId = req.chatbot_id;

    const session = await Session.findById(sessionId);

    if (!session) {
        return res.status(404).json({
            success: false,
            message: "Session not found"
        });
    }

    const user_message = await Message.create({
        message: userMessage,
        sessionId,
        role: "user",
        chatbotId
    });

    const bot_message = await Message.create({
        message: botMessage,
        sessionId,
        role: "bot",
        chatbotId
    });

    session.messages.push(user_message);
    session.messages.push(bot_message);

    await session.save();

    res.status(200).json({
        success: true,
        message: "Message added successfully"
    });
});

exports.getOwnerSessions = catchAsyncError(async (req, res, next) => {
    const ownerId = req.user._id;

    const sessions = await Session.find({ chatbotId: ownerId })
        .populate("messages")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        sessions
    });
});

