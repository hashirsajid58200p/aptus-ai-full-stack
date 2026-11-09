const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const Message = require("../models/messageModel");
const Session = require("../models/sessionModel");
const User = require("../models/userModel");

exports.createSession = catchAsyncError(async (req, res, next) => {
    const username = req.body.username || "Website Visitor";
    const email = req.body.email || "visitor@web.local";
    const phone = req.body.phone || "";
    const visitorId = req.body.visitorId || null;
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || req.ip || "";
    const ipAddress = rawIp.replace(/^.*:/, '') || "127.0.0.1";

    const chatbotId = req.chatbot_id;

    // Check if an existing session exists for this visitorId on this chatbot
    if (visitorId) {
        let existingSession = await Session.findOne({ chatbotId, visitorId }).populate("messages");
        if (existingSession) {
            let updated = false;
            if (req.body.username && req.body.username !== "Website Visitor" && existingSession.username !== req.body.username) {
                existingSession.username = req.body.username;
                updated = true;
            }
            if (req.body.email && req.body.email !== "visitor@web.local" && existingSession.email !== req.body.email) {
                existingSession.email = req.body.email;
                updated = true;
            }
            if (ipAddress && !existingSession.ipAddress) {
                existingSession.ipAddress = ipAddress;
                updated = true;
            }
            if (updated) {
                await existingSession.save();
            }

            return res.status(200).json({
                success: true,
                session: existingSession,
                message: "Existing session resumed"
            });
        }
    }

    const session = await Session.create({
        username,
        email,
        phone,
        chatbotId,
        visitorId,
        ipAddress,
        status: "active"
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
        sender: "user",
        chatbotId
    });

    const bot_message = await Message.create({
        message: botMessage,
        sessionId,
        role: "bot",
        sender: "ai",
        chatbotId
    });

    session.messages.push(user_message);
    session.messages.push(bot_message);
    session.updatedAt = new Date();

    await session.save();

    res.status(200).json({
        success: true,
        message: "Message added successfully"
    });
});

exports.getOwnerSessions = catchAsyncError(async (req, res, next) => {
    const ownerId = req.user._id;

    // Filter out abandoned empty sessions (0 messages) and sort by latest activity
    const sessions = await Session.find({
        chatbotId: ownerId,
        "messages.0": { $exists: true }
    })
        .populate("messages")
        .sort({ updatedAt: -1, createdAt: -1 });

    res.status(200).json({
        success: true,
        sessions
    });
});

// Export Chat History as CSV
exports.exportSessionsCSV = catchAsyncError(async (req, res, next) => {
    const ownerId = req.user._id;

    const sessions = await Session.find({ chatbotId: ownerId })
        .populate("messages")
        .sort({ createdAt: -1 });

    let csv = "Session ID,Visitor Name,Email,Phone,Status,Message Sender,Message Text,Timestamp\n";

    for (const session of sessions) {
        if (!session.messages || session.messages.length === 0) {
            csv += `"${session._id}","${session.username}","${session.email}","${session.phone || ''}","${session.status}","N/A","No messages","${session.createdAt.toISOString()}"\n`;
        } else {
            for (const msg of session.messages) {
                const escapedText = (msg.message || "").replace(/"/g, '""');
                csv += `"${session._id}","${session.username}","${session.email}","${session.phone || ''}","${session.status}","${msg.sender || msg.role}","${escapedText}","${msg.createdAt ? msg.createdAt.toISOString() : ''}"\n`;
            }
        }
    }

    res.header("Content-Type", "text/csv");
    res.attachment(`chat_history_${Date.now()}.csv`);
    return res.send(csv);
});

// Toggle Session between live human agent ('human_active') and automated AI ('active')
exports.takeoverSession = catchAsyncError(async (req, res, next) => {
    const { sessionId, action } = req.body;
    const ownerId = req.user._id;

    const session = await Session.findOne({ _id: sessionId, chatbotId: ownerId });
    if (!session) {
        return res.status(404).json({
            success: false,
            message: "Session not found",
        });
    }

    if (action === "handback") {
        session.status = "active";
        session.agentSocketId = null;
    } else {
        session.status = "human_active";
    }

    await session.save();

    res.status(200).json({
        success: true,
        status: session.status,
        message: session.status === "human_active" ? "Session taken over by live agent" : "Session returned to AI assistant",
    });
});

// Live human agent sends a message directly to visitor
exports.sendAgentMessage = catchAsyncError(async (req, res, next) => {
    const { sessionId, message } = req.body;
    const ownerId = req.user._id;

    if (!sessionId || !message || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please enter a message to send",
        });
    }

    const session = await Session.findOne({ _id: sessionId, chatbotId: ownerId });
    if (!session) {
        return res.status(404).json({
            success: false,
            message: "Session not found",
        });
    }

    const agentMsg = await Message.create({
        message: message.trim(),
        sessionId,
        role: "chatbot",
        sender: "human_agent",
        chatbotId: ownerId,
    });

    session.messages.push(agentMsg);
    session.updatedAt = new Date();
    await session.save();

    res.status(200).json({
        success: true,
        message: agentMsg,
    });
});

// Get session messages & live status for widget visitor
exports.getSessionMessages = catchAsyncError(async (req, res, next) => {
    const { sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: "Session ID is required",
        });
    }

    const session = await Session.findOne({ _id: sessionId, chatbotId: req.chatbot_id }).populate("messages");
    if (!session) {
        return res.status(404).json({
            success: false,
            message: "Session not found",
        });
    }

    res.status(200).json({
        success: true,
        status: session.status,
        messages: session.messages,
    });
});

// Visitor requests human agent takeover via widget
exports.requestLiveAgent = catchAsyncError(async (req, res, next) => {
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: "Session ID is required",
        });
    }

    const session = await Session.findOne({ _id: sessionId, chatbotId: req.chatbot_id });
    if (!session) {
        return res.status(404).json({
            success: false,
            message: "Session not found",
        });
    }

    session.status = "human_active";
    await session.save();

    res.status(200).json({
        success: true,
        message: "Live agent requested",
        status: session.status,
    });
});
