// Database Configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/surveyapp';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      heartbeatFrequencyMS: 10000,
      retryReads: true,
      retryWrites: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);

    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('=> DNS resolution failed. Check your internet connection and MongoDB URI.');
    } else if (error.message.includes('Authentication failed') || error.message.includes('auth')) {
      console.error('=> Authentication failed. Check your MongoDB username and password in .env');
    } else if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('ETIMEDOUT')) {
      console.error('=> Connection timed out. Make sure your IP is whitelisted in MongoDB Atlas.');
      console.error('=> Go to Atlas > Network Access > Add your current IP address (or use 0.0.0.0/0 for dev).');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('=> Connection refused. Make sure MongoDB is running locally or Atlas URI is correct.');
    }

    console.error('=> Current MONGODB_URI starts with:', uri.substring(0, 30) + '...');
    process.exit(1);
  }
};

module.exports = connectDB;
