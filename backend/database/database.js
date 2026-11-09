const mongoose = require('mongoose');

let isConnected = false;

const FALLBACK_DIRECT_URI = "mongodb://hs58200d_db_user:cwamw8QgZxMpMq2y@ac-xfotpvp-shard-00-00.8xlneak.mongodb.net:27017,ac-xfotpvp-shard-00-01.8xlneak.mongodb.net:27017,ac-xfotpvp-shard-00-02.8xlneak.mongodb.net:27017/AptusAI?ssl=true&replicaSet=atlas-beo47b-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  if (isConnected && mongoose.connections[0]?.readyState === 1) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URI, { serverSelectionTimeoutMS: 4000 });
    isConnected = db.connections[0].readyState === 1;
    console.log("Database connected");
  } catch (err) {
    console.warn("SRV DNS query timed out, connecting via direct Atlas replica set...");
    try {
      const db = await mongoose.connect(FALLBACK_DIRECT_URI);
      isConnected = db.connections[0].readyState === 1;
      console.log("Database connected via Atlas replica set");
    } catch (fallbackErr) {
      console.error("Database connection error:", fallbackErr);
      throw fallbackErr;
    }
  }
};

module.exports = { connectDB };
