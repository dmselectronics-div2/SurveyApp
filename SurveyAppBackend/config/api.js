// API Configuration
module.exports = {
  port: process.env.PORT || 5000,
  apiKey: process.env.API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS settings
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-email'],
    optionsSuccessStatus: 200
  },

  // Request limits
  limits: {
    json: '50mb',
    urlencoded: '50mb'
  },

  // API versioning
  apiVersion: 'v1',

  // Database connection timeout
  dbTimeout: 30000,

  // File upload settings
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    uploadDir: 'uploads'
  }
};

