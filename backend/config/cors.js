const cors = require("cors");

const widgetCors = cors({
  origin: (origin, callback) => callback(null, true),
  credentials: false,
});

const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);

const dashboardCors = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    
    const frontendEnv = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : "";
    if (frontendEnv && origin === frontendEnv) return callback(null, true);
    
    // Check flexible patterns (localhost, 127.0.0.1, vercel deployments)
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    
    // Default to allowing the requesting origin to prevent preflight block
    return callback(null, true);
  },
  credentials: true,
});

module.exports = { widgetCors, dashboardCors };
