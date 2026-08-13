const cors = require("cors");

const widgetCors = cors({
  origin: (origin, callback) => callback(null, true),
  credentials: false,
});

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
const dashboardCors = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

module.exports = { widgetCors, dashboardCors };
