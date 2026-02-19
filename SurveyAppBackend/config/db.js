const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    isConnected = false;
    console.log("❌ MongoDB Connection Failed:", err.message);
    console.log("👉 Fix: Whitelist your IP at https://cloud.mongodb.com → Security → Network Access");
  }
};

// Middleware: reject requests if DB is not connected
const requireDB = (req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Database unavailable. Please whitelist your IP in MongoDB Atlas: https://cloud.mongodb.com → Security → Network Access'
    });
  }
  next();
};

module.exports = { connectDB, requireDB };
