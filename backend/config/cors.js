const cors = require("cors");

const widgetCors = cors({
  origin: (origin, callback) => callback(null, true),
  credentials: false,
});

const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

const dashboardCors = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check exact matches
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Check flexible patterns (localhost, 127.0.0.1, vercel preview deployments)
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

module.exports = { widgetCors, dashboardCors };
