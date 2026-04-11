const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is missing. Starting server in degraded mode (DB-disabled).');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed: ${error.message}. Starting in degraded mode.`);
    return false;
  }
};

module.exports = connectDB;
