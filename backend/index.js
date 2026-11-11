require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const http = require("http");
const cors = require("cors");
const { connectDB } = require("./database/database");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");
const { initSocket } = require("./sockets/socketHandler");
const ErrorHandler = require("./middleware/error");
const { dashboardCors, widgetCors } = require("./config/cors");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const seedAccounts = require("./database/seed");

const PORT = process.env.PORT || 3100;

// 1. CORS & Preflight handler (Must run FIRST before DB connection or rate limiters)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isDev = process.env.NODE_ENV !== "production";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  const isTrustedOrigin = !origin ||
    origin === frontendUrl ||
    origin.endsWith(".vercel.app") ||
    (isDev && (origin.includes("localhost") || origin.includes("127.0.0.1")));

  const isWidgetPath = req.path.startsWith("/api/v1/user/token/verify") || req.path.startsWith("/api/v1/chatbot");

  if (origin) {
    if (isTrustedOrigin) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
    } else if (isWidgetPath) {
      // Allow cross-origin requests for widget routes (domain enforcement happens in validateWidget)
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Chatbot-Token, x-chatbot-token");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

let isSeeded = false;
// 2. Middleware to ensure DB is connected before processing non-preflight requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      isSeeded = true;
      if (process.env.SEED_ON_START === 'true' || process.env.NODE_ENV !== 'production') {
        seedAccounts().catch((err) => console.warn("Seed error:", err.message));
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.use(morgan("dev"));
app.use(compression());
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  skip: (req) => {
    // Skip rate limiting in development or for local addresses
    if (process.env.NODE_ENV !== "production") return true;
    const ip = req.ip || req.connection?.remoteAddress || "";
    return ip.includes("127.0.0.1") || ip.includes("::1");
  },
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." },
});

app.use(limiter);

// Routes
const userRoutes = require("./routes/userRoutes");
const chatbotRoutes = require("./routes/chatbotRoute");
const sessionRoutes = require("./routes/sessionRoute");
const adminRoutes = require("./routes/adminRoutes");
const discordRoutes = require("./routes/discordRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/session", sessionRoutes);
app.use("/api/v1/admin", dashboardCors, adminRoutes);
app.use("/api/v1/integrations/discord", discordRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy!",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.get("/", (req, res) => {
  res.send("Aptus AI API Engine is running.");
});

// Not found route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(ErrorHandler);

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
module.exports.server = server;
