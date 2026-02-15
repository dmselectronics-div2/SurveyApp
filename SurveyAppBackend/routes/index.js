// Central Route Configuration
const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const birdRoutes = require('./bird');
const citizenRoutes = require('./citizen');
const mangroveRoutes = require('./Bivalvi');
const uploadRoutes = require('./upload');
const citizenFormRoutes = require('./citizenForm');

// API v1 routes with consistent namespacing
const apiV1 = express.Router();

// Register routes with proper API versioning and namespacing
apiV1.use('/auth', authRoutes);
apiV1.use('/bird', birdRoutes);
apiV1.use('/citizen', citizenRoutes);
apiV1.use('/mangrove', mangroveRoutes);
apiV1.use('/citizen-form', citizenFormRoutes);
apiV1.use('/upload', uploadRoutes);

// Mount API routes
router.use('/api/v1', apiV1);

// Backward-compatible routes (frontend calls these directly)
router.use('/', birdRoutes);
router.use('/', authRoutes);
router.use('/', citizenRoutes);
router.use('/', citizenFormRoutes);
router.use('/', uploadRoutes);
router.use('/api', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SurveyApp Backend is running' });
});

module.exports = router;
