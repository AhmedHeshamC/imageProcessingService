const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth.routes');
const imageRoutes = require('./routes/image.routes');
const rateLimit = require('express-rate-limit');

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/v1', authRoutes);
app.use('/api/v1', imageRoutes);

// Serve frontend static files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
