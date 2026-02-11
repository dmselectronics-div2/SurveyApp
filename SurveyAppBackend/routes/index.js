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

// Register routes
router.use('/', authRoutes);
router.use('/', birdRoutes);
router.use('/api', citizenRoutes);
router.use('/', mangroveRoutes);
router.use('/', uploadRoutes);
router.use('/', citizenFormRoutes);

module.exports = router;
