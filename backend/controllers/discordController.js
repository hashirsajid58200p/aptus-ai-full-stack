const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const LLMService = require('../utils/llmService');
const RAGService = require('../utils/ragService');
const { recordTokenUsage } = require('../middleware/tokenTracker');

// Discord Bot Interaction & Webhook Endpoint
exports.handleDiscordWebhook = catchAsyncError(async (req, res, next) => {
  const token = req.query.token || req.headers['x-chatbot-token'] || req.body.token || req.body.chatbot_token;

  // Discord PING verification (Type 1 Interaction)
  if (req.body && req.body.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  // Extract message content from Discord message or slash command payload
  let userMessage = '';
  if (req.body.content) {
    userMessage = req.body.content;
  } else if (req.body.data && req.body.data.options && req.body.data.options[0]) {
    userMessage = req.body.data.options[0].value;
  } else if (req.body.message) {
    userMessage = req.body.message;
  }

  if (!userMessage) {
    return res.status(400).json({
      success: false,
      message: 'No message content provided in Discord payload.',
    });
  }

  // Find business chatbot owner
  let owner = null;
  if (token) {
    owner = await User.findOne({ chatbot_token: token });
  }
  if (!owner) {
    // Fallback to first active business chatbot if token not specified
    owner = await User.findOne({ bussinessName: { $exists: true } });
  }

  if (!owner) {
    return res.status(404).json({
      success: false,
      message: 'No registered chatbot found for Discord integration.',
    });
  }

  // Prepare business knowledge context
  const businessDetailsText = (owner.bussinessDetails || [])
    .map((d) => `Q: ${d.question}\nA: ${d.answer}`)
    .join('\n');

  // Search RAG context
  let ragContext = '';
  try {
    ragContext = await RAGService.searchRelevantContext(owner._id, userMessage, 2, owner.openaiApiKey);
  } catch (err) {
    console.warn('RAG search skipped for Discord message:', err.message);
  }

  const systemPrompt = `You are an AI support assistant for "${owner.bussinessName}", responding inside a Discord channel.
Keep your response concise, polite, helpful, and formatted cleanly for Discord (using markdown like bold, bullet points).
${owner.bussinessDescription ? `About ${owner.bussinessName}: ${owner.bussinessDescription}` : ''}
${businessDetailsText ? `\nBusiness FAQ:\n${businessDetailsText}` : ''}
${ragContext ? `\n\nVerified Knowledge Base Documents:\n${ragContext}` : ''}`;

  const llm = new LLMService({
    provider: owner.provider || 'groq',
    model: owner.modelName,
    apiKey: owner.openaiApiKey,
  });

  const completion = await llm.generateText(userMessage, {
    systemPrompt,
    temperature: 0.7,
  });

  const replyText = completion.text;

  // Track token usage
  if (completion.usage?.totalTokens) {
    await recordTokenUsage(owner._id, completion.usage.totalTokens);
  }

  // If a Discord webhook URL was provided, dispatch directly to channel
  const webhookUrl = req.body.webhook_url || req.headers['x-discord-webhook-url'];
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText,
          username: `${owner.bussinessName} Bot`,
        }),
      });
    } catch (whErr) {
      console.error('Failed to post to Discord webhook URL:', whErr.message);
    }
  }

  // Return standard response compatible with both Discord Interactions and direct webhook clients
  return res.status(200).json({
    type: 4, // Discord InteractionResponseType: ChannelMessageWithSource
    data: {
      content: replyText,
    },
    success: true,
    reply: replyText,
    tokensUsed: completion.usage?.totalTokens || 0,
  });
});

exports.discordHealth = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    status: 'online',
    service: 'Aptus AI Discord Webhook Bridge',
    timestamp: new Date(),
  });
});
