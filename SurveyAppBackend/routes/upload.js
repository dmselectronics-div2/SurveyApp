const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = req.body.type || 'general';
    const folderPath = path.join(uploadsDir, subfolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Upload profile image
router.post('/api/upload-profile-image', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.body.type || 'general'}/${req.file.filename}`;

    res.json({ status: 'ok', filePath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Upload general image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.body.type || 'general'}/${req.file.filename}`;

    // If email is provided, update user profile
    if (req.body.email) {
      await User.findOneAndUpdate(
        { email: req.body.email.toLowerCase() },
        { profileImage: filePath }
      );
    }

    res.json({ status: 'ok', filePath, url: filePath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Upload base64 image
router.post('/upload-base64', async (req, res) => {
  try {
    const { image, type = 'general', filename } = req.body;

    if (!image) {
      return res.status(400).json({ status: 'error', message: 'No image data provided' });
    }

    // Remove data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create folder if not exists
    const folderPath = path.join(uploadsDir, type);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate filename
    const ext = filename ? path.extname(filename) : '.jpg';
    const uniqueName = `${uuidv4()}${ext}`;
    const fullPath = path.join(folderPath, uniqueName);

    // Write file
    fs.writeFileSync(fullPath, buffer);

    const filePath = `/uploads/${type}/${uniqueName}`;

    res.json({ status: 'ok', filePath, url: filePath });
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Delete uploaded file
router.delete('/upload/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(uploadsDir, type, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ status: 'ok', message: 'File deleted' });
    } else {
      res.status(404).json({ status: 'error', message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
