const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Image = require('../models/image.model');
const path = require('path');
const fs = require('fs');

// Helper middleware to fetch image path by id
async function fetchImagePath(req, res, next) {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json({ error: 'Not found' });
    req.imagePath = path.join(__dirname, '../../uploads', image.filename);
    req.imageRecord = image;
    next();
  } catch (err) {
    next(err);
  }
}

// Change: authMiddleware before upload.single('image')
router.post('/images', authMiddleware, upload.single('image'), imageController.upload);
router.post('/images/:id/transform', authMiddleware, fetchImagePath, imageController.transform);

router.get('/images/:id', authMiddleware, fetchImagePath, async (req, res, next) => {
  try {
    // Return metadata as JSON
    res.status(200).json({
      id: req.imageRecord.id,
      filename: req.imageRecord.filename,
      userId: req.imageRecord.userId,
      metadata: req.imageRecord.metadata
    });
  } catch (err) {
    next(err);
  }
});

router.get('/images', authMiddleware, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const images = await Image.findAll({ offset, limit });
    res.status(200).json(images);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
