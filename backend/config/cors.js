const cors = require("cors");

const dashboardCorsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "x-chatbot-token",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

const widgetCorsOptions = {
  origin: true,
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "x-chatbot-token",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

const dashboardCors = cors(dashboardCorsOptions);
const widgetCors = cors(widgetCorsOptions);

module.exports = { widgetCors, dashboardCors };
