const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedDemoData = require('../utils/seedHelper');

let mongoServer = null;

const connectDB = async () => {
  // If MONGODB_URI is provided, attempt connection with a short timeout
  if (process.env.MONGODB_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`⚠️ Primary MongoDB Connection (Atlas) failed: ${error.message}`);
      console.log('🔄 Activating fallback In-Memory MongoDB Server for uninterrupted demo execution...');
    }
  }

  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed demo credentials and catalog
    await seedDemoData();
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Fatal Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
