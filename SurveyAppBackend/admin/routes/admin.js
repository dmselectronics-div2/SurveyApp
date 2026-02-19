const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Protected Admin Routes
// Authentication for Admins (Separated from regular users)
router.post('/login', adminController.login);
router.post('/register', adminController.register);

router.get('/stats', adminAuth, adminController.getDashboardStats);
router.get('/users', adminAuth, adminController.getAllUsers);
router.patch('/users/:userId/approve', adminAuth, adminController.approveUser);

// Survey Routes
router.get('/surveys/bird', adminAuth, adminController.getBirdSurveys);
router.get('/surveys/bivalvi', adminAuth, adminController.getBivalviSurveys);
router.get('/surveys/citizen', adminAuth, adminController.getCitizenSurveys);

module.exports = router;
