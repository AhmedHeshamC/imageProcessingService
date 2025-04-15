const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

// This function allows us to start the server from other files
async function startServer() {
  await sequelize.sync();
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// When this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
