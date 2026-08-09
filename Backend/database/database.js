const mongoose = require('mongoose');
const dns = require('dns');

try {
  // Only configure custom DNS locally; Vercel handles SRV resolution natively
  if (!process.env.VERCEL) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (err) {
  console.warn("DNS custom servers not configured:", err);
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

module.exports = { connectDB };
