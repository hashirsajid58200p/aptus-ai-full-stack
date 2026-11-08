const catchAsyncError = require("../middleware/catchAsyncError");
const LLMService = require("../utils/llmService");
const FunctionCallingEngine = require("../utils/functionCalling");
const { recordTokenUsage } = require("../middleware/tokenTracker");
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
    "bussinessName bussinessCategory email chatbot_token createdAt provider modelName isLiveAgent liveAgentAvailable theme primaryColor botName welcomeMessage chatbotAvatar allowedDomain allowedDomains"
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
      id: owner._id,
      bussinessName: owner.bussinessName,
      bussinessCategory: owner.bussinessCategory,
      email: owner.email,
      token: owner.chatbot_token,
      registeredAt: owner.createdAt,
      provider: owner.provider || 'groq',
      modelName: owner.modelName || 'llama-3.3-70b-versatile',
      isLiveAgent: owner.isLiveAgent || false,
      liveAgentAvailable: owner.liveAgentAvailable || false,
      theme: owner.theme || 'aptus',
      primaryColor: owner.primaryColor || '#f97316',
      botName: owner.botName || 'Aptus AI',
      welcomeMessage: owner.welcomeMessage || 'Hello! How can I assist you today?',
      chatbotAvatar: owner.chatbotAvatar || '',
      allowedDomains: owner.allowedDomains || [],
    },
  });
});

const baseSystemPrompt = `You are a friendly, professional, and knowledgeable customer service AI chatbot.

IMPORTANT RULES:
- Respond naturally and conversationally like an attentive human customer service agent.
- Never show template labels like "*Business Details*", "*Response*", "*User's Message*" in your replies.
- Never repeat the customer's question back to them.
- Keep responses concise, direct, and actionable.
- If verified knowledge base context or business FAQ is provided below, prioritize it to answer accurately.
- If you do not know something, politely say so and offer to connect with a representative or have them leave an inquiry.
- When the customer asks about features, plans, trust, or payment security, you may optionally include one of these rich media trigger tags on a new line at the end of your response to showcase visual badges:
  - [PROMO:showcase] (to display feature highlight cards)
  - [PROMO:trust] (to display enterprise trust and safety badges)
  - [PROMO:payment] (to display secure checkout and payment methods)
- Always respond directly to what the customer just said.`;

// POST /api/v1/chatbot/getResponse — Primary Chat Endpoint
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

  // Check token limits
  const tokenLimit = owner.tokenLimit || 500000;
  const totalTokensUsed = owner.tokenUsage?.totalTokens || 0;
  if (totalTokensUsed >= tokenLimit) {
    return res.status(429).json({
      success: false,
      message: "Chatbot monthly token quota has been reached. Please contact business administration.",
      quotaExceeded: true,
    });
  }

  const session = await Session.findById(session_id);
  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found",
    });
  }

  // If session is currently actively in live human mode, do not auto-respond with AI
  if (session.status === 'human_active') {
    const userMessage = await Message.create({
      sessionId: session_id,
      message,
      role: "user",
      sender: "user",
      chatbotId: chatbot_id,
    });
    session.messages.push(userMessage._id);
    await session.save();

    return res.status(200).json({
      success: true,
      data: "Your message has been delivered to the human agent.",
      isHumanMode: true,
    });
  }

  const bussinessDetails = owner.bussinessDetails || [];
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

  // Check Function Calling Intent
  let actionResult = null;
  const toolIntent = FunctionCallingEngine.detectToolIntent(message);
  if (toolIntent) {
    try {
      actionResult = await FunctionCallingEngine.executeTool(toolIntent.toolName, toolIntent.args);
    } catch (toolErr) {
      console.warn("Function calling execution error:", toolErr.message);
    }
  }

  // Assemble full prompt
  let fullPrompt = `${baseSystemPrompt}\n\n--- BUSINESS INFO ---\nBusiness Name: ${owner.bussinessName}\nBusiness Description: ${owner.bussinessDescription || ''}\n`;
  if (businessDetailsText) {
    fullPrompt += `\nBusiness FAQ:\n${businessDetailsText}\n`;
  }
  if (actionResult) {
    fullPrompt += `\n--- EXECUTED ACTION RESULT ---\nTool: ${actionResult.toolName}\nOutput: ${JSON.stringify(actionResult.result)}\nIntegrate this action result naturally in your reply.\n`;
  }
  fullPrompt += `\n--- CONVERSATION HISTORY ---\n${messagesText}\n\n--- CUSTOMER'S CURRENT MESSAGE ---\n${message}\n\nYour response:`;

  // Initialize unified LLM service with tenant settings
  const llm = new LLMService({
    provider: owner.provider || 'groq',
    model: owner.modelName || 'llama-3.3-70b-versatile',
    apiKey: owner.provider === 'openai' ? owner.openaiApiKey : owner.groqApiKey,
  });

  const completion = await llm.generateText(fullPrompt, {
    temperature: 0.7,
  });

  const replyText = completion.text;
  const tokensUsed = completion.usage?.totalTokens || 0;

  // Record token analytics
  await recordTokenUsage(owner._id, tokensUsed);

  // Store user message
  const userMessage = await Message.create({
    sessionId: session_id,
    message,
    role: "user",
    sender: "user",
    chatbotId: chatbot_id,
  });
  session.messages.push(userMessage._id);

  // Store AI response
  const chatbotMessage = await Message.create({
    sessionId: session_id,
    message: replyText,
    role: "chatbot",
    sender: "ai",
    tokensUsed,
    chatbotId: chatbot_id,
  });
  session.messages.push(chatbotMessage._id);

  await session.save();

  res.status(200).json({
    success: true,
    data: replyText,
    action: actionResult ? actionResult.clientAction : null,
    tokensUsed,
  });
});

// POST /api/v1/chatbot/transcribe — Groq Whisper STT
exports.transcribeAudio = catchAsyncError(async (req, res, next) => {
  const { audio, mimeType } = req.body;

  if (!audio) {
    return res.status(400).json({
      success: false,
      message: "Audio data (base64) is required",
    });
  }

  try {
    const base64Data = audio.replace(/^data:audio\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const llm = new LLMService();
    const transcriptText = await llm.transcribeAudio(buffer, "audio.webm", mimeType || "audio/webm");

    res.status(200).json({
      success: true,
      text: transcriptText,
    });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to transcribe audio",
    });
  }
});

// Update Model Settings for Chatbot Owner
exports.updateModelSettings = catchAsyncError(async (req, res, next) => {
  const { provider, modelName, openaiApiKey, groqApiKey } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (provider && ['groq', 'openai'].includes(provider)) {
    user.provider = provider;
  }
  if (modelName) {
    user.modelName = modelName;
  }
  if (openaiApiKey !== undefined) {
    user.openaiApiKey = openaiApiKey;
  }
  if (groqApiKey !== undefined) {
    user.groqApiKey = groqApiKey;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Chatbot AI model settings updated successfully.",
    data: {
      provider: user.provider,
      modelName: user.modelName,
      hasOpenAiKey: !!user.openaiApiKey,
      hasGroqKey: !!user.groqApiKey,
    },
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

  const bussinessDetails = owner.bussinessDetails || [];
  const businessDetailsText = bussinessDetails.map(detail => `Q: ${detail.question}\nA: ${detail.answer}`).join("\n");

  const messagesText = messages && messages.length > 0
    ? messages.map(detail => `Customer: ${detail.question}\nBot: ${detail.answer}`).join("\n")
    : "No previous messages";

  const llm = new LLMService({
    provider: owner.provider || 'groq',
    model: owner.modelName || 'llama-3.3-70b-versatile',
    apiKey: owner.openaiApiKey,
  });

  const completion = await llm.generateText(
    `${baseSystemPrompt}\n\n--- BUSINESS INFO ---\nBusiness Name: ${owner.bussinessName}\nBusiness Description: ${owner.bussinessDescription}\nBusiness Details:\n${businessDetailsText}\n\n--- CONVERSATION HISTORY ---\n${messagesText}\n\n--- CUSTOMER'S CURRENT MESSAGE ---\n${message}\n\nYour response:`
  );

  res.status(200).json({
    success: true,
    data: completion.text,
    tokensUsed: completion.usage?.totalTokens || 0,
  });
});

exports.generateTextGeneral = catchAsyncError(async (req, res, next) => {
  const { prompt, provider, model, apiKey } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide a prompt",
    });
  }

  const llm = new LLMService({
    provider: provider || 'groq',
    model: model || 'llama-3.3-70b-versatile',
    apiKey: apiKey || null,
  });

  const result = await llm.generateText(prompt);

  res.status(200).json({
    success: true,
    data: result.text,
    usage: result.usage,
  });
});
