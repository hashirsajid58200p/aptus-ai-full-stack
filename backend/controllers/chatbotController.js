const catchAsyncError = require("../middleware/catchAsyncError");
const GroqAI = require("../utils/groqAI");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");
const Message = require("../models/messageModel");

// GET /api/v1/chatbot/getDetails?token=... — validate a chatbot token and return safe business info
exports.getDetails = catchAsyncError(async (req, res, next) => {
  const token = req.query.token || req.headers["x-chatbot-token"];

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  const owner = await User.findOne({ chatbot_token: token }).select(
    "bussinessName bussinessCategory email chatbot_token createdAt"
  );

  if (!owner) {
    return res.status(404).json({
      success: false,
      message: "Invalid or inactive chatbot token",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      businessName: owner.bussinessName,
      category: owner.bussinessCategory,
      email: owner.email,
      token: owner.chatbot_token,
      registeredAt: owner.createdAt,
    },
  });
});



const systemPrompt = `You are a friendly and professional customer service chatbot for a business.

IMPORTANT RULES:
- Respond naturally and conversationally like a human customer service agent
- Never show template labels like "*Business Details*", "*Response*", "*User's Message*" in your replies
- Never repeat the question back to the user
- Keep responses concise and helpful
- If you don't know something, politely say so and suggest contacting the business directly
- Use the business details provided to answer questions accurately
- Remember the conversation history and refer to it when relevant
- Always respond directly to what the user just said`;

exports.getResponse = catchAsyncError(async (req, res, next) => {
  const { messages, message, session_id } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({
      success: false,
      message: "Please enter message and session_id",
    });
  }

  // Owner and chatbot_id are securely attached by validateWidget middleware
  const owner = req.owner;
  const chatbot_id = req.chatbot_id;

  const bussinessDetails = owner.bussinessDetails;

  if (!bussinessDetails || bussinessDetails.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Please add at least 5 business details to use the chatbot",
    });
  }

  const businessDetailsText = bussinessDetails
    .map(detail => `Q: ${detail.question}\nA: ${detail.answer}`)
    .join("\n");

  const messagesText = Array.isArray(messages) && messages.length > 0
    ? messages.map(msg => {
        if (msg.role && msg.message) {
          return `${msg.role === 'user' ? 'Customer' : 'Bot'}: ${msg.message}`;
        }
        if (msg.question && msg.answer) {
          return `Customer: ${msg.question}\nBot: ${msg.answer}`;
        }
        return '';
      }).filter(Boolean).join("\n")
    : "No previous messages";

  const groqAI = new GroqAI();

  const completion = await groqAI.generateContent({
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `\n\n--- BUSINESS INFO ---\nBusiness Name: ${owner.bussinessName}\nBusiness Description: ${owner.bussinessDescription}\n\nBusiness Details:\n${businessDetailsText}` },
          { text: `\n\n--- CONVERSATION HISTORY ---\n${messagesText}` },
          { text: `\n\n--- CUSTOMER'S CURRENT MESSAGE ---\n${message}\n\nYour response:` },
        ],
      },
    ],
  });

  const session = await Session.findById(session_id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found",
    });
  }

  const userMessage = await Message.create({
    sessionId: session_id,
    message,
    role: "user",
    chatbotId: chatbot_id,
  });

  session.messages.push(userMessage._id);

  const chatbotMessage = await Message.create({
    sessionId: session_id,
    message: completion.response.candidates[0].content.parts[0].text,
    role: "chatbot",
    chatbotId: chatbot_id,
  });

  session.messages.push(chatbotMessage._id);

  await session.save();

  res.status(200).json({
    success: true,
    data: completion.response.candidates[0].content.parts[0].text,
  });
});

exports.testByOwner = catchAsyncError(async (req, res, next) => {
  const owner = req.user;
  const { messages, message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Please enter a message",
    });
  }

  const { bussinessDetails } = owner;

  if (!bussinessDetails || bussinessDetails.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Please add at least 5 business details to test the chatbot",
    });
  }

  const businessDetailsText = bussinessDetails.map(detail => `Q: ${detail.question}\nA: ${detail.answer}`).join("\n");

  const messagesText = messages && messages.length > 0
    ? messages.map(detail => `Customer: ${detail.question}\nBot: ${detail.answer}`).join("\n")
    : "No previous messages";

  const groqAI = new GroqAI();

  const completion = await groqAI.generateContent({
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `\n\n--- BUSINESS INFO ---\nBusiness Name: ${owner.bussinessName}\nBusiness Description: ${owner.bussinessDescription}\n\nBusiness Details:\n${businessDetailsText}` },
          { text: `\n\n--- CONVERSATION HISTORY ---\n${messagesText}` },
          { text: `\n\n--- CUSTOMER'S CURRENT MESSAGE ---\n${message}\n\nYour response:` },
        ],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: completion.response.candidates[0].content.parts[0].text,
  });
});

exports.generateTextGeneral = catchAsyncError(async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide a prompt",
    });
  }

  const groqAI = new GroqAI();
  const generatedText = await groqAI.generateText(prompt);

  res.status(200).json({
    success: true,
    data: generatedText,
  });
});
