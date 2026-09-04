const User = require('../models/userModel');

/**
 * Token Tracking & Quota Limiter Middleware
 * Validates that the chatbot owner has remaining tokens before processing LLM queries,
 * and records consumed tokens per request.
 */
async function checkTokenQuota(req, res, next) {
  try {
    const owner = req.owner || req.user;
    if (!owner) return next();

    const tokenLimit = owner.tokenLimit || 500000;
    const totalUsed = owner.tokenUsage?.totalTokens || 0;

    if (totalUsed >= tokenLimit) {
      return res.status(429).json({
        success: false,
        message: 'Monthly chatbot token quota exceeded. Please upgrade your plan in the agency dashboard.',
        quotaExceeded: true,
        used: totalUsed,
        limit: tokenLimit,
      });
    }

    next();
  } catch (err) {
    console.error('Error in token quota middleware:', err);
    next(err);
  }
}

/**
 * Helper to record token usage to User document
 */
async function recordTokenUsage(userId, tokensUsed) {
  if (!userId || !tokensUsed || tokensUsed <= 0) return;

  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (!user.tokenUsage) {
      user.tokenUsage = { totalTokens: 0, dailyUsage: [] };
    }

    user.tokenUsage.totalTokens = (user.tokenUsage.totalTokens || 0) + tokensUsed;

    const dailyIndex = user.tokenUsage.dailyUsage.findIndex((d) => d.date === todayStr);
    if (dailyIndex > -1) {
      user.tokenUsage.dailyUsage[dailyIndex].tokens += tokensUsed;
    } else {
      user.tokenUsage.dailyUsage.push({ date: todayStr, tokens: tokensUsed });
    }

    // Keep only last 30 days of daily stats
    if (user.tokenUsage.dailyUsage.length > 30) {
      user.tokenUsage.dailyUsage = user.tokenUsage.dailyUsage.slice(-30);
    }

    await user.save();
  } catch (err) {
    console.error('Failed to record token usage:', err.message);
  }
}

module.exports = {
  checkTokenQuota,
  recordTokenUsage,
};
