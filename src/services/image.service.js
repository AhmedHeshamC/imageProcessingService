const sharp = require('sharp');
const Image = require('../models/image.model');
const path = require('path');
const fs = require('fs');

class ImageService {
  async upload(file, userId) {
    const uploadPath = path.join(__dirname, '../../uploads', file.filename);
    await fs.promises.rename(file.path, uploadPath);
    return Image.create({
      filename: file.filename,
      userId,
      metadata: { size: file.size, mimetype: file.mimetype }
    });
  }

  async transform(imagePath, operations) {
    let img = sharp(imagePath);

    // Resize
    if (operations.resize) {
      img = img.resize(operations.resize.width, operations.resize.height);
    }

    // Crop
    if (operations.crop) {
      // crop: { left, top, width, height }
      img = img.extract(operations.crop);
    }

    // Rotate
    if (operations.rotate) {
      img = img.rotate(operations.rotate);
    }

    // Watermark
    if (operations.watermark) {
      // watermark: { path, gravity }
      const watermark = await sharp(operations.watermark.path).toBuffer();
      img = img.composite([{
        input: watermark,
        gravity: operations.watermark.gravity || 'southeast'
      }]);
    }

    // Flip (vertical)
    if (operations.flip) {
      img = img.flip();
    }

    // Mirror (horizontal flip)
    if (operations.mirror) {
      img = img.flop();
    }

    // Compress (JPEG quality)
    if (operations.compress) {
      img = img.jpeg({ quality: operations.compress.quality });
    }

    // Format conversion
    if (operations.format) {
      img = img.toFormat(operations.format);
    }

    // Filters
    if (operations.filters) {
      if (operations.filters.grayscale) {
        img = img.grayscale();
      }
      if (operations.filters.sepia) {
        // Sepia: approximate using tint and modulate
        img = img
          .modulate({ saturation: 0.5, brightness: 1 })
          .tint({ r: 112, g: 66, b: 20 });
      }
    }

    return img.toBuffer();
  }
}

module.exports = new ImageService();