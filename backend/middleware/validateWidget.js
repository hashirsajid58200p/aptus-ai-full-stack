const mongoose = require("mongoose");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");

function normalizeHost(value) {
  if (!value) return '';
  try {
    const raw = String(value).trim();
    const u = raw.includes('://') ? new URL(raw) : new URL(`https://${raw}`);
    return u.hostname.toLowerCase();
  } catch {
    return String(value).toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0].trim();
  }
}

function hostMatchesDomain(host, allowed) {
  const rawAllowed = String(allowed || '').trim().toLowerCase();
  if (!rawAllowed) return false;
  if (rawAllowed === '*') return true;
  const d = normalizeHost(rawAllowed.replace(/^\*\./, ''));
  const h = normalizeHost(host);
  if (!d || !h) return false;
  return h === d || h.endsWith(`.${d}`);
}

const validateWidget = catchAsyncError(async (req, res, next) => {
  const rawToken = req.body?.token || req.headers["x-chatbot-token"] || req.query?.token;

  if (!rawToken || typeof rawToken !== 'string' || rawToken.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "Chatbot authentication token is required",
    });
  }

  const token = rawToken.trim();

  // Validate session_id format if provided in request body or query
  const session_id = req.body?.session_id || req.body?.sessionId || req.query?.sessionId || req.query?.session_id;
  if (session_id && (typeof session_id !== 'string' || !mongoose.Types.ObjectId.isValid(session_id))) {
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

  // Domain Origin Validation (check allowedDomains array and legacy allowedDomain)
  const configuredDomains = [
    ...(Array.isArray(owner.allowedDomains) ? owner.allowedDomains : []),
    ...(owner.allowedDomain && typeof owner.allowedDomain === 'string' ? [owner.allowedDomain] : [])
  ].filter(Boolean);

  if (configuredDomains.length > 0) {
    const rawOrigin = req.headers.origin || req.headers.referer || "";
    const requestHost = normalizeHost(rawOrigin);
    const isDev = process.env.NODE_ENV !== 'production';

    const isAuthorized = configuredDomains.some(domain => {
      return hostMatchesDomain(requestHost, domain) || (isDev && (requestHost === "localhost" || requestHost === "127.0.0.1"));
    });

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Request origin (${requestHost || 'unknown'}) is not authorized for this chatbot token`,
      });
    }
  }

  // Attach verified owner context to request
  req.owner = owner;
  req.chatbot_id = owner._id;

  next();
});

module.exports = validateWidget;
module.exports.normalizeHost = normalizeHost;
module.exports.hostMatchesDomain = hostMatchesDomain;
