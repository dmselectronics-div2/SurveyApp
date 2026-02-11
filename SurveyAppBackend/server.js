const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/db');
const apiConfig = require('./config/api');

// Import routes
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors(apiConfig.cors));
app.use(express.json({ limit: apiConfig.limits.json }));
app.use(express.urlencoded({ extended: true, limit: apiConfig.limits.urlencoded }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Use routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SurveyApp Backend is running' });
});

const PORT = apiConfig.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access from mobile: http://<your-ip>:${PORT}`);
});
