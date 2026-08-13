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
    const rawUri = process.env.DB_URI || "";
    const cleanUri = rawUri.replace(/^["']|["']$/g, "").trim();

    if (!cleanUri) {
      throw new Error("DB_URI environment variable is missing or empty");
    }

    const db = await mongoose.connect(cleanUri);
    isConnected = db.connections[0].readyState === 1;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

module.exports = { connectDB };
