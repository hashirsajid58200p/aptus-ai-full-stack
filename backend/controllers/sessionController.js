const catchAsyncError = require("../middleware/catchAsyncError");
const Message = require("../models/messageModel");
const Session = require("../models/sessionModel");
const User = require("../models/userModel");

exports.createSession = catchAsyncError(async (req, res, next) => {
    const {
        username,
        email,
        chatbotId
    } = req.body;

    if (!username || !email || !chatbotId) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }

    const chatbot = await User.findById(chatbotId);

    if (!chatbot) {
        return res.status(404).json({
            success: false,
            message: "Chatbot not found"
        });
    }

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
    const { sessionId, chatbotId, botMessage, userMessage } = req.body;

    if (!sessionId || !chatbotId || !botMessage || !userMessage) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }

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
