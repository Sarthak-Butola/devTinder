
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("✅ MongoDB connected to:", conn.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err; // Important to re-throw so app.js can catch it
  }
};

module.exports = {
  connectDB
};
