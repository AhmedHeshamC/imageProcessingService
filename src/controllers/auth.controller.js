const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    try {
      const user = await authService.register(username, password);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
      // Sequelize unique constraint error
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Username already exists' });
      }
      // Log and return error for debugging
      console.error('Register error:', err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }
    try {
      const { user, token } = await authService.login(username, password);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
      // Invalid credentials
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
};
