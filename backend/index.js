const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database/database");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require('compression');
const app = express();
const ErrorHandler = require("./middleware/error");


const PORT = process.env.PORT || 3100;

require("dotenv").config({ path: "./config/.env" });

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    // Allow any localhost port (development)
    // Allow any .vercel.app subdomain (staging/preview deploys)
    // Allow any other origin — this API serves a widget SDK embedded on customer sites
    callback(null, true);
  },
  credentials: true
}));

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
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
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

app.use(limiter);

const userRoutes = require("./routes/userRoutes");
const chatbotRoutes = require("./routes/chatbotRoute");
const sessionRoutes = require("./routes/sessionRoute");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/session", sessionRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy!" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Not found route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});


app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
