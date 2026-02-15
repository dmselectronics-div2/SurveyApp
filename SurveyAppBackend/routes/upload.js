const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const uploadController = require('../controllers/uploadController');

// Upload profile image
router.post('/upload-profile-image', upload.single('profileImage'), uploadController.uploadProfileImage);

// Upload general image
router.post('/upload', upload.single('image'), uploadController.uploadImage);

// Upload base64 image
router.post('/upload-base64', uploadController.uploadBase64);

// Delete uploaded file
router.delete('/upload/:type/:filename', uploadController.deleteFile);

module.exports = router;
