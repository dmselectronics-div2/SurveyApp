const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configurations
const { connectDB, requireDB } = require('./config/db');
const apiConfig = require('./config/api');

// Import middleware
const { errorHandler, notFound, requestLogger } = require('./middleware');

// Import routes
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors(apiConfig.cors));
app.use(express.json({ limit: apiConfig.limits.json }));
app.use(express.urlencoded({ extended: true, limit: apiConfig.limits.urlencoded }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(requestLogger);

// Error handling middleware for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 'error', message: 'Invalid JSON' });
  }
  next();
});

// Connect to MongoDB
connectDB();

// Block all routes if DB is not connected
app.use(requireDB);

// Use routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = apiConfig.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health Check: http://0.0.0.0:${PORT}/health`);
  console.log(`API Base: http://0.0.0.0:${PORT}/api/v1`);
});
