require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  db: {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root@22@',
    database: process.env.DB_NAME || 'image_processing_service',
    dialect: 'mysql'
  }
};
