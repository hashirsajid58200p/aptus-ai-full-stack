const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const { generateToken } = require("../utils/chatbotToken");
const CustomError = require("../utils/errorHandler");

// register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    password,

    bussinessName,
    bussinessDescription,
    bussinessCategory,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // token for user to access the chatbot and other services

  const chatbot_token = await generateToken();

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    bussinessName,
    bussinessCategory,
    bussinessDescription,
    chatbot_token,
  });

  // Send token in cookie
  sendToken(user, 200, res, "User registered successfully");
});
// login a user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password is entered by user
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter email & password",
    });
  }

  // finding user in database (support both business-aptus and aptusai email aliases)
  const searchEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: searchEmail }).select("+password");
  if (!user && (searchEmail === "aptusai@example.com" || searchEmail === "admin@aptus.ai")) {
    user = await User.findOne({ email: "business-aptus@example.com" }).select("+password");
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  // check if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  // send token in cookie
  sendToken(user, 200, res, "User logged in successfully");
});

// logout user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    path: "/",
    secure: true,
    sameSite: "None",
  });

  // Set Cache-Control header to prevent caching
  res.setHeader("Cache-Control", "no-store");

  console.log("Cookie cleared.");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// load user profile
exports.loadUserProfile = catchAsyncError(async (req, res, next) => {
  // Get the user ID from the request parameters or authentication token
  const userId = req.params.userId || req.user._id;

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  // Send response with user's profile
  res.status(200).json({
    success: true,
    user,
  });
});

// add business details (supports single pair or array of pairs)
exports.addBussinessDetails = catchAsyncError(async (req, res, next) => {
  const { question, answer, details } = req.body;
  const user = req.user;

  let itemsToAdd = [];

  if (Array.isArray(details) && details.length > 0) {
    itemsToAdd = details.filter((item) => item.question && item.question.trim() && item.answer && item.answer.trim());
  } else if (question && answer) {
    itemsToAdd = [{ question, answer }];
  }

  if (itemsToAdd.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter question and answer for at least one item",
    });
  }

  if (user.bussinessDetails.length + itemsToAdd.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Details limit reached. You cannot add more details (max 50)",
    });
  }

  itemsToAdd.forEach((item) => {
    user.bussinessDetails.push({
      question: item.question.trim(),
      answer: item.answer.trim(),
    });
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Business details added successfully",
    bussinessDetails: user.bussinessDetails,
  });
});

// update business detail
exports.updateBussinessDetails = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { question, answer } = req.body;

  const index = user.bussinessDetails.findIndex(
    (bussinessDetail) => bussinessDetail._id.toString() === id.toString()
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Business detail not found",
    });
  }

  if (question !== undefined) user.bussinessDetails[index].question = question.trim();
  if (answer !== undefined) user.bussinessDetails[index].answer = answer.trim();

  await user.save();

  res.status(200).json({
    success: true,
    message: "Business detail updated successfully",
    bussinessDetails: user.bussinessDetails,
  });
});

// delete business details
exports.deleteBussinessDetails = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  const bussinessDetails = user.bussinessDetails;

  const index = bussinessDetails.findIndex(
    (bussinessDetail) => bussinessDetail._id.toString() === id.toString()
  );

  if (index > -1) {
    bussinessDetails.splice(index, 1);
  } else {
    return res.status(404).json({
      success: false,
      message: "Business detail not found",
    });
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Business detail deleted successfully",
    bussinessDetails: user.bussinessDetails,
  });
});

// Return the users details by finding through the chatbot_token
exports.findChatbotUsingToken = catchAsyncError(async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ chatbot_token: token });

  if (!user) {
    throw new CustomError("Invalid Token", 400);
  }

  // Domain Verification (Allow localhost in dev, or check whitelist)
  const origin = req.headers.origin || req.headers.referer || "";
  if (user.allowedDomains && user.allowedDomains.length > 0) {
    const isAllowed = user.allowedDomains.some(domain => {
      const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const cleanOrigin = origin.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      return cleanOrigin.includes(cleanDomain) || cleanOrigin.includes("localhost") || cleanOrigin.includes("127.0.0.1");
    });
    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: "Domain verification failed: Origin not authorized for this chatbot token."
      });
    }
  }

  const {
    bussinessName,
    bussinessCategory,
    bussinessDescription,
    bussinessDetails,
    _id,
    theme,
    primaryColor,
    textColor,
    borderRadius,
    botName,
    welcomeMessage,
    chatbotAvatar,
    allowedDomains,
  } = user;

  res.status(200).json({
    data: {
      bussinessName,
      bussinessCategory,
      bussinessDescription,
      bussinessDetails,
      knowledgeMarkdown: user.knowledgeMarkdown || "",
      id: _id,
      theme: theme || 'aptus',
      primaryColor: primaryColor || '#f97316',
      textColor: textColor || '',
      borderRadius: borderRadius || '',
      botName: botName || 'Aptus AI',
      welcomeMessage: welcomeMessage || 'Hello! How can I assist you today?',
      chatbotAvatar: chatbotAvatar || 'bot',
      allowedDomains: allowedDomains || [],
    },
    message: "Chatbot Details"
  });
});

// Update Appearance & Domain settings
exports.updateAppearance = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { theme, primaryColor, textColor, borderRadius, botName, welcomeMessage, chatbotAvatar, allowedDomains } = req.body;

  if (theme) user.theme = theme;
  if (primaryColor) user.primaryColor = primaryColor;
  if (textColor !== undefined) user.textColor = textColor;
  if (borderRadius !== undefined) user.borderRadius = borderRadius;
  if (botName) user.botName = botName;
  if (welcomeMessage !== undefined) user.welcomeMessage = welcomeMessage;
  if (chatbotAvatar !== undefined) user.chatbotAvatar = chatbotAvatar;
  if (allowedDomains !== undefined) {
    user.allowedDomains = Array.isArray(allowedDomains)
      ? allowedDomains.map(d => d.trim()).filter(Boolean)
      : String(allowedDomains).split(',').map(d => d.trim()).filter(Boolean);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Appearance & Domain settings updated successfully",
    data: {
      theme: user.theme,
      primaryColor: user.primaryColor,
      botName: user.botName,
      welcomeMessage: user.welcomeMessage,
      chatbotAvatar: user.chatbotAvatar,
      allowedDomains: user.allowedDomains,
    }
  });
});

// List models dynamically for provider and API key
exports.getAvailableModels = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const provider = req.query.provider || req.body.provider || 'all';
  const customBaseUrl = req.query.customBaseUrl || req.body.customBaseUrl || user.customBaseUrl;

  const LLMService = require("../utils/llmService");

  if (provider === 'all') {
    const result = await LLMService.listAllConnectedModels(user);
    return res.status(200).json({
      success: true,
      provider: 'all',
      connectedProviders: result.connectedProviders,
      modelsByProvider: result.modelsByProvider,
      models: result.models,
    });
  }

  let apiKey = req.query.apiKey || req.body.apiKey;
  if (apiKey && typeof apiKey === 'string' && apiKey.includes('••••')) {
    apiKey = null;
  }
  if (!apiKey) {
    if (provider === 'openai') apiKey = user.openaiApiKey;
    else if (provider === 'groq') apiKey = user.groqApiKey;
    else if (provider === 'gemini') apiKey = user.geminiApiKey;
    else if (provider === 'deepseek') apiKey = user.deepseekApiKey;
    else if (provider === 'mistral') apiKey = user.mistralApiKey;
    else if (provider === 'cohere') apiKey = user.cohereApiKey;
    else if (provider === 'perplexity') apiKey = user.perplexityApiKey;
    else if (provider === 'anthropic') apiKey = user.anthropicApiKey;
    else if (provider === 'xai') apiKey = user.xaiApiKey;
    else if (provider === 'openrouter') apiKey = user.openrouterApiKey;
    else if (provider === 'custom') apiKey = user.customApiKey;
  }

  try {
    const models = await LLMService.listModels(provider, apiKey, customBaseUrl);
    res.status(200).json({
      success: true,
      provider,
      models,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// Generate new token for chatbot and replace the old token
exports.generateNewToken = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const token = await generateToken();

  user.chatbot_token = token;

  await user.save();

  res.status(200).json({
    success: true,
    message: "New token generated successfully",
  });
});

// Update Business Knowledge Base Markdown Documentation
exports.updateKnowledgeMarkdown = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const { knowledgeMarkdown } = req.body;

  const content = typeof knowledgeMarkdown === "string" ? knowledgeMarkdown : "";
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount > 100000) {
    return res.status(400).json({
      success: false,
      message: `Markdown documentation cannot exceed 100,000 words (currently ${wordCount} words).`,
    });
  }

  user.knowledgeMarkdown = content;
  await user.save();

  res.status(200).json({
    success: true,
    data: user.knowledgeMarkdown,
    message: "Business knowledge documentation updated successfully",
  });
});

