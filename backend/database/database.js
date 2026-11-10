const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connections[0]?.readyState === 1) {
    return;
  }

  const primaryUri = process.env.DB_URI;
  const fallbackUri = process.env.FALLBACK_DIRECT_URI;

  if (!primaryUri && !fallbackUri) {
    throw new Error("DB_URI environment variable is missing.");
  }

  try {
    const db = await mongoose.connect(primaryUri || fallbackUri, { serverSelectionTimeoutMS: 5000 });
    isConnected = db.connections[0].readyState === 1;
    console.log("Database connected");
  } catch (err) {
    if (fallbackUri && fallbackUri !== primaryUri) {
      console.warn("Primary connection timed out, attempting direct Atlas replica set URI...");
      try {
        const db = await mongoose.connect(fallbackUri);
        isConnected = db.connections[0].readyState === 1;
        console.log("Database connected via fallback URI");
        return;
      } catch (fallbackErr) {
        console.error("Database fallback connection error:", fallbackErr);
        throw fallbackErr;
      }
    }
    console.error("Database connection error:", err);
    throw err;
  }
};

module.exports = { connectDB };
