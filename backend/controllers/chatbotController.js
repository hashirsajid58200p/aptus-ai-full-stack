const mongoose = require("mongoose");
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
  const cleanToken = typeof token === "string" ? token.trim() : "";
  const owner = req.owner || (cleanToken ? await User.findOne({ 
    chatbot_token: cleanToken 
  }).select(
    "bussinessName bussinessCategory createdAt provider modelName isLiveAgent liveAgentAvailable theme primaryColor botName welcomeMessage chatbotAvatar allowedDomain allowedDomains"
  ) : null);

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
      registeredAt: owner.createdAt,
      provider: owner.provider || 'groq',
      modelName: owner.modelName || 'openai/gpt-oss-120b',
      isLiveAgent: owner.isLiveAgent || false,
      liveAgentAvailable: owner.liveAgentAvailable || false,
      theme: owner.theme || 'aptus',
      primaryColor: owner.primaryColor || '#FF4D00',
      textColor: owner.textColor || '',
      borderRadius: owner.borderRadius || '',
      botName: owner.botName || 'Aptus AI',
      welcomeMessage: owner.welcomeMessage || 'Hello! How can I assist you today?',
      chatbotAvatar: owner.chatbotAvatar || '',
      allowedDomains: owner.allowedDomains || [],
    },
  });
});

const countWords = (str) => {
  if (!str || typeof str !== 'string') return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
};

const checkKnowledgeGate = (owner) => {
  const qaCount = Array.isArray(owner?.bussinessDetails) ? owner.bussinessDetails.length : 0;
  const mdWords = countWords(owner?.knowledgeMarkdown);
  const isUnlocked = qaCount >= 10 || mdWords >= 1000;
  return {
    isUnlocked,
    qaCount,
    mdWords,
  };
};

const baseSystemPrompt = `You are a friendly, professional, and knowledgeable customer service AI chatbot.

CRITICAL ACCURACY & GROUNDING RULES:
1. STRICT PRICING & FACT POLICY: NEVER invent, fabricate, or hallucinate specific prices, numeric dollar figures (e.g. $49, $99, etc.), hourly rates, discounts, or features that are NOT explicitly mentioned in the provided Business Info, Knowledge Base, or FAQs below.
2. If a customer asks about pricing, packages, or rates and exact numerical dollar figures are NOT documented in the knowledge base:
   - State clearly and honestly what you DO know (e.g., subscription model, 30-day money-back guarantee, or free trial).
   - Inform the customer that exact pricing details or custom enterprise quotes are provided directly by the sales/support team.
   - Invite them to leave their email or contact the team so a custom quote can be shared.
   - NEVER invent or make up fake dollar amounts under any circumstances.
3. Only answer based on verified facts in the business knowledge base. If information is not available, acknowledge it politely without guessing.
4. Respond naturally and conversationally like an attentive human customer service agent.
5. Never show template labels like "*Business Details*", "*Response*", "*User's Message*" in your replies.
6. Never repeat the customer's question back to them.
7. Keep responses concise, direct, and actionable.
8. Always respond directly to what the customer just said.`;

// POST /api/v1/chatbot/getResponse — Primary Chat Endpoint
exports.getResponse = catchAsyncError(async (req, res, next) => {
  const messages = req.body.messages;
  const message = req.body.message || req.body.Message;
  const session_id = req.body.session_id || req.body.sessionId;

  if (!message || typeof message !== 'string' || !session_id || typeof session_id !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Please enter valid message and session_id",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(session_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid session ID format",
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

  // Check Knowledge Base gate (minimum 10 Q&A pairs OR 1,000 words Markdown documentation)
  const gate = checkKnowledgeGate(owner);
  if (!gate.isUnlocked) {
    return res.status(403).json({
      success: false,
      isLocked: true,
      message: `Chatbot is currently locked. The business must provide at least 10 Q&A pairs (currently ${gate.qaCount}/10) or minimum 1,000 words of Markdown documentation (currently ${gate.mdWords}/1,000 words) in Business Details before the chatbot can reply.`,
    });
  }

  const session = await Session.findById(session_id);
  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found",
    });
  }

  // Prevent cross-tenant session hijacking (IDOR)
  if (session.chatbotId && session.chatbotId.toString() !== chatbot_id.toString()) {
    return res.status(403).json({
      success: false,
      message: "This session does not belong to this chatbot token.",
    });
  }

  // If session is waiting for a live agent or actively handled by one, pause AI generation
  if (session.status === 'human_active' || session.status === 'waiting_human') {
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
      data: "A human support agent has been notified and will take over this chat shortly. Please hold on.",
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
  if (owner.knowledgeMarkdown && owner.knowledgeMarkdown.trim()) {
    fullPrompt += `\n--- BUSINESS KNOWLEDGE DOCUMENTATION (MARKDOWN) ---\n${owner.knowledgeMarkdown.trim()}\n`;
  }
  if (businessDetailsText) {
    fullPrompt += `\n--- BUSINESS FAQ (Q&A) ---\n${businessDetailsText}\n`;
  }
  if (actionResult) {
    fullPrompt += `\n--- EXECUTED ACTION RESULT ---\nTool: ${actionResult.toolName}\nOutput: ${JSON.stringify(actionResult.result)}\nIntegrate this action result naturally in your reply.\n`;
  }
  fullPrompt += `\n--- CONVERSATION HISTORY ---\n${messagesText}\n\n--- CUSTOMER'S CURRENT MESSAGE ---\n${message}\n\nYour response:`;

  // Resolve active API key strictly based on tenant's saved portal configuration
  let activeApiKey = null;
  if (owner.provider === 'openai') activeApiKey = owner.openaiApiKey;
  else if (owner.provider === 'groq') activeApiKey = owner.groqApiKey;
  else if (owner.provider === 'gemini') activeApiKey = owner.geminiApiKey;
  else if (owner.provider === 'deepseek') activeApiKey = owner.deepseekApiKey;
  else if (owner.provider === 'mistral') activeApiKey = owner.mistralApiKey;
  else if (owner.provider === 'cohere') activeApiKey = owner.cohereApiKey;
  else if (owner.provider === 'perplexity') activeApiKey = owner.perplexityApiKey;
  else if (owner.provider === 'anthropic') activeApiKey = owner.anthropicApiKey;
  else if (owner.provider === 'xai') activeApiKey = owner.xaiApiKey;
  else if (owner.provider === 'openrouter') activeApiKey = owner.openrouterApiKey;
  else if (owner.provider === 'custom') activeApiKey = owner.customApiKey;

  // The official landing page bot (token A1ED-AC9D6DEE-46A3DFD8) can use server key fallback
  if (!activeApiKey && owner.chatbot_token === "A1ED-AC9D6DEE-46A3DFD8") {
    activeApiKey = process.env.GROQ_API_KEY;
  }

  // If the business has not configured an API key in the portal, notify user gracefully
  if (!activeApiKey) {
    const defaultPendingReply = "Hello! The AI model key for this business chatbot has not been configured yet. Please log into your Aptus AI dashboard under 'AI Model & Keys' to connect an API key.";
    
    const botMsg = await Message.create({
      message: defaultPendingReply,
      sessionId: session._id,
      role: 'chatbot',
      sender: 'ai',
      tokensUsed: 0,
      chatbotId: owner._id
    });
    session.messages.push(botMsg._id);
    await session.save();

    return res.status(200).json({
      success: true,
      data: defaultPendingReply,
      action: null,
      tokensUsed: 0
    });
  }

  // Initialize unified LLM service with tenant settings
  const llm = new LLMService({
    provider: owner.provider || 'groq',
    model: owner.modelName || 'openai/gpt-oss-120b',
    apiKey: activeApiKey,
    customBaseUrl: owner.customBaseUrl,
  });

  let completion;
  try {
    completion = await llm.generateText(fullPrompt, {
      temperature: 0.7,
    });
  } catch (genErr) {
    console.warn("Primary LLM generation failed:", genErr.message);
    const friendlyErrorMessage = "I'm temporarily having trouble connecting to my AI service. Please try again in a moment or contact our support team.";
    
    // Store user message in session history first so conversation transcript is preserved
    const userMessageDoc = await Message.create({
      sessionId: session_id,
      message,
      role: "user",
      sender: "user",
      tokensUsed: 0,
      chatbotId: owner._id,
    }).catch(() => null);

    if (userMessageDoc) {
      session.messages.push(userMessageDoc._id);
    }

    // Store bot error message in session history
    const errorBotMsg = await Message.create({
      message: friendlyErrorMessage,
      sessionId: session._id,
      role: 'chatbot',
      sender: 'ai',
      tokensUsed: 0,
      chatbotId: owner._id,
    }).catch(() => null);

    if (errorBotMsg) {
      session.messages.push(errorBotMsg._id);
      await session.save().catch(() => null);
    }

    return res.status(200).json({
      success: true,
      data: friendlyErrorMessage,
      isError: true,
      action: null,
      tokensUsed: 0,
    });
  }

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
  const { audio, mimeType, language, prompt, token } = req.body;

  if (!audio || typeof audio !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Audio data (base64 string) is required",
    });
  }

  if (audio.length > 30 * 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: "Audio payload exceeds maximum size limit (25MB)",
    });
  }

  try {
    // Robustly strip any data URL prefix (including audio/webm;codecs=opus;base64,)
    const base64Data = audio.includes("base64,") ? audio.split("base64,")[1] : audio;
    const buffer = Buffer.from(base64Data, "base64");

    // Check for user-provided Groq key via token or auth
    let groqKey = null;
    const clientToken = token || req.headers["x-chatbot-token"];
    if (clientToken) {
      const user = await User.findOne({ chatbot_token: clientToken });
      if (user && user.groqApiKey) groqKey = user.groqApiKey;
    } else if (req.user && req.user.groqApiKey) {
      groqKey = req.user.groqApiKey;
    }

    const llm = new LLMService({ provider: "groq", apiKey: groqKey });
    const transcriptText = await llm.transcribeAudio(buffer, "audio.webm", mimeType || "audio/webm", {
      language,
      prompt: prompt || "Customer query for business assistant in English, Urdu, or Roman Urdu.",
    });

    res.status(200).json({
      success: true,
      text: transcriptText,
    });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(200).json({
      success: false,
      message: err.message || "Failed to transcribe audio",
      text: "",
    });
  }
});

// Update Model Settings for Chatbot Owner
exports.updateModelSettings = catchAsyncError(async (req, res, next) => {
  const {
    provider,
    modelName,
    openaiApiKey,
    groqApiKey,
    geminiApiKey,
    deepseekApiKey,
    mistralApiKey,
    cohereApiKey,
    perplexityApiKey,
    anthropicApiKey,
    xaiApiKey,
    openrouterApiKey,
    customApiKey,
    customBaseUrl,
  } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const validProviders = ['groq', 'gemini', 'deepseek', 'mistral', 'cohere', 'perplexity', 'openai', 'anthropic', 'xai', 'openrouter', 'custom'];
  if (provider && validProviders.includes(provider)) {
    user.provider = provider;
  }
  if (modelName !== undefined) {
    if (typeof modelName !== 'string' || modelName.trim() === '') {
      return res.status(400).json({ success: false, message: "Model name cannot be empty." });
    }
    user.modelName = modelName.trim();
  }

  const applyKeyUpdate = (field, val) => {
    if (val === undefined) return;
    if (typeof val === 'string' && val.includes('••••')) return;
    user[field] = val ? val.trim() : null;
  };

  applyKeyUpdate('openaiApiKey', openaiApiKey);
  applyKeyUpdate('groqApiKey', groqApiKey);
  applyKeyUpdate('geminiApiKey', geminiApiKey);
  applyKeyUpdate('deepseekApiKey', deepseekApiKey);
  applyKeyUpdate('mistralApiKey', mistralApiKey);
  applyKeyUpdate('cohereApiKey', cohereApiKey);
  applyKeyUpdate('perplexityApiKey', perplexityApiKey);
  applyKeyUpdate('anthropicApiKey', anthropicApiKey);
  applyKeyUpdate('xaiApiKey', xaiApiKey);
  applyKeyUpdate('openrouterApiKey', openrouterApiKey);
  applyKeyUpdate('customApiKey', customApiKey);

  if (customBaseUrl !== undefined) {
    user.customBaseUrl = customBaseUrl;
  }

  // Validate modelName against provider's active models if API key exists
  if (modelName && user.provider !== 'custom') {
    let activeKey = null;
    if (user.provider === 'openai') activeKey = user.openaiApiKey;
    else if (user.provider === 'groq') activeKey = user.groqApiKey;
    else if (user.provider === 'gemini') activeKey = user.geminiApiKey;
    else if (user.provider === 'deepseek') activeKey = user.deepseekApiKey;
    else if (user.provider === 'mistral') activeKey = user.mistralApiKey;
    else if (user.provider === 'cohere') activeKey = user.cohereApiKey;
    else if (user.provider === 'perplexity') activeKey = user.perplexityApiKey;
    else if (user.provider === 'anthropic') activeKey = user.anthropicApiKey;
    else if (user.provider === 'xai') activeKey = user.xaiApiKey;
    else if (user.provider === 'openrouter') activeKey = user.openrouterApiKey;

    if (activeKey) {
      try {
        const availableModels = await LLMService.listModels(user.provider, activeKey, user.customBaseUrl);
        if (Array.isArray(availableModels) && availableModels.length > 0) {
          const modelExists = availableModels.some((m) => m.id === user.modelName || m.name === user.modelName);
          if (!modelExists) {
            return res.status(400).json({
              success: false,
              message: `Model "${user.modelName}" is not recognized or available for provider "${user.provider}". Please select a model from the list.`,
            });
          }
        }
      } catch (listErr) {
        console.warn(`[updateModelSettings] Could not verify models with provider ${user.provider}: ${listErr.message}`);
        return res.status(400).json({
          success: false,
          message: `Failed to verify models for provider "${user.provider}": ${listErr.message}. Please check your API key and settings.`,
        });
      }
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Chatbot AI model settings updated successfully.",
    data: {
      provider: user.provider,
      modelName: user.modelName,
      customBaseUrl: user.customBaseUrl,
      hasOpenAiKey: !!user.openaiApiKey,
      hasGroqKey: !!user.groqApiKey,
      hasGeminiKey: !!user.geminiApiKey,
      hasDeepseekKey: !!user.deepseekApiKey,
      hasMistralKey: !!user.mistralApiKey,
      hasCohereKey: !!user.cohereApiKey,
      hasPerplexityKey: !!user.perplexityApiKey,
      hasAnthropicKey: !!user.anthropicApiKey,
      hasXaiKey: !!user.xaiApiKey,
      hasOpenrouterKey: !!user.openrouterApiKey,
      hasCustomKey: !!user.customApiKey,
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

  // Check Knowledge Base gate
  const gate = checkKnowledgeGate(owner);
  if (!gate.isUnlocked) {
    return res.status(403).json({
      success: false,
      isLocked: true,
      message: `Test Chatbot is locked. Minimum knowledge base not met: please add at least 10 Q&A pairs (currently ${gate.qaCount}/10) or at least 1,000 words of Markdown documentation (currently ${gate.mdWords}/1,000 words) in Business Details.`,
    });
  }

  const bussinessDetails = owner.bussinessDetails || [];
  const businessDetailsText = bussinessDetails.map(detail => `Q: ${detail.question}\nA: ${detail.answer}`).join("\n");

  const messagesText = messages && messages.length > 0
    ? messages.map(detail => `Customer: ${detail.question}\nBot: ${detail.answer}`).join("\n")
    : "No previous messages";

  let activeApiKey = null;
  if (owner.provider === 'openai') activeApiKey = owner.openaiApiKey;
  else if (owner.provider === 'groq') activeApiKey = owner.groqApiKey;
  else if (owner.provider === 'gemini') activeApiKey = owner.geminiApiKey;
  else if (owner.provider === 'deepseek') activeApiKey = owner.deepseekApiKey;
  else if (owner.provider === 'mistral') activeApiKey = owner.mistralApiKey;
  else if (owner.provider === 'cohere') activeApiKey = owner.cohereApiKey;
  else if (owner.provider === 'perplexity') activeApiKey = owner.perplexityApiKey;
  else if (owner.provider === 'anthropic') activeApiKey = owner.anthropicApiKey;
  else if (owner.provider === 'xai') activeApiKey = owner.xaiApiKey;
  else if (owner.provider === 'openrouter') activeApiKey = owner.openrouterApiKey;
  else if (owner.provider === 'custom') activeApiKey = owner.customApiKey;

  if (!activeApiKey && owner.chatbot_token === "A1ED-AC9D6DEE-46A3DFD8") {
    activeApiKey = process.env.GROQ_API_KEY;
  }

  if (!activeApiKey) {
    return res.status(200).json({
      success: true,
      data: "Please configure your AI Model API key under 'AI Model & Keys' tab first.",
      tokensUsed: 0,
    });
  }

  const llm = new LLMService({
    provider: owner.provider || 'groq',
    model: owner.modelName || 'openai/gpt-oss-120b',
    apiKey: activeApiKey,
    customBaseUrl: owner.customBaseUrl,
  });

  let testPrompt = `${baseSystemPrompt}\n\n--- BUSINESS INFO ---\nBusiness Name: ${owner.bussinessName}\nBusiness Description: ${owner.bussinessDescription || ''}\n`;
  if (owner.knowledgeMarkdown && owner.knowledgeMarkdown.trim()) {
    testPrompt += `\n--- BUSINESS KNOWLEDGE DOCUMENTATION (MARKDOWN) ---\n${owner.knowledgeMarkdown.trim()}\n`;
  }
  if (businessDetailsText) {
    testPrompt += `\n--- BUSINESS FAQ (Q&A) ---\n${businessDetailsText}\n`;
  }
  testPrompt += `\n--- CONVERSATION HISTORY ---\n${messagesText}\n\n--- CUSTOMER'S CURRENT MESSAGE ---\n${message}\n\nYour response:`;

  const completion = await llm.generateText(testPrompt);

  res.status(200).json({
    success: true,
    data: completion.text,
    tokensUsed: completion.usage?.totalTokens || 0,
  });
});

exports.generateTextGeneral = catchAsyncError(async (req, res, next) => {
  const { prompt, provider, model, apiKey } = req.body;
  const owner = req.user || req.owner;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid prompt string",
    });
  }

  if (prompt.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Prompt exceeds maximum allowed length (5000 characters)",
    });
  }

  const isWidgetCaller = !req.user;
  const effectiveProvider = (isWidgetCaller ? owner?.provider : provider || owner?.provider) || 'groq';
  const effectiveModel = (isWidgetCaller ? owner?.modelName : model || owner?.modelName) || 'openai/gpt-oss-120b';

  let activeApiKey = (!isWidgetCaller && apiKey) ? apiKey : null;
  if (!activeApiKey && owner) {
    if (effectiveProvider === 'openai') activeApiKey = owner.openaiApiKey;
    else if (effectiveProvider === 'groq') activeApiKey = owner.groqApiKey;
    else if (effectiveProvider === 'anthropic') activeApiKey = owner.anthropicApiKey;
    else if (effectiveProvider === 'xai') activeApiKey = owner.xaiApiKey;
    else if (effectiveProvider === 'openrouter') activeApiKey = owner.openrouterApiKey;
    else if (effectiveProvider === 'custom') activeApiKey = owner.customApiKey;
  }

  const llm = new LLMService({
    provider: effectiveProvider,
    model: effectiveModel,
    apiKey: activeApiKey,
    customBaseUrl: owner?.customBaseUrl,
  });

  const result = await llm.generateText(prompt);

  res.status(200).json({
    success: true,
    data: result.text,
    usage: result.usage,
  });
});
