const mongoose = require('mongoose');

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
