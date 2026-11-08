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

let isSeeded = false;
// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      isSeeded = true;
      seedAccounts().catch((err) => console.warn("Seed error:", err.message));
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
  max: 200,
  message: "Too many requests from this IP, please try again after 15 minutes.",
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
