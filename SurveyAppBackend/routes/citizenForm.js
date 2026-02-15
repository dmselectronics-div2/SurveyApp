const express = require('express');
const router = express.Router();
const citizenFormController = require('../controllers/citizenFormController');

// Submit citizen form
router.post('/citizen-form', citizenFormController.submitCitizenForm);

// Get all citizen form entries
router.get('/citizens', citizenFormController.getAllCitizenForms);

module.exports = router;
