const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config');

class AuthService {
  async register(username, password) {
    const hashed = await bcrypt.hash(password, 10);
    return User.create({ username, password: hashed });
  }

  async login(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });
    return { user, token };
  }
}

module.exports = new AuthService();
