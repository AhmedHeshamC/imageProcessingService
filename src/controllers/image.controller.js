const imageService = require('../services/image.service');

exports.upload = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const image = await imageService.upload(req.file, req.user.id);
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

exports.transform = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.imagePath) return res.status(404).json({ error: 'Image not found' });
    if (!req.body.operations) return res.status(400).json({ error: 'No operations specified' });
    const buffer = await imageService.transform(req.imagePath, req.body.operations);
    res.type('image/png').send(buffer);
  } catch (err) {
    next(err);
  }
};
