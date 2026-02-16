const express = require('express');
const router = express.Router();
const bivalviController = require('../controllers/BivalviController');

// CRUD Operations - using frontend expected endpoints
router.post('/submit-bivalvi-form', bivalviController.saveBivalviInfo);
router.get('/bivalvi-form-entries', bivalviController.getAllBivalviInfo);
router.get('/bivalvi-form-entry/:id', bivalviController.getBivalviInfoById);
router.put('/bivalvi-form-entry/:id', bivalviController.updateBivalviInfo);
router.delete('/bivalvi-form-entry/:id', bivalviController.deleteBivalviInfo);

// Analytics endpoints
router.get('/bivalvi-species', bivalviController.getBivalviSpecies);
router.get('/bivalvi-sampling-methods', bivalviController.getBivalviSamplingMethods);
router.get('/bivalvi-stats', bivalviController.getBivalviStats);

module.exports = router;
