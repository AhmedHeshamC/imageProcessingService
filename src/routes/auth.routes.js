const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/users/register', authController.register);
router.post('/users/login', authController.login);

module.exports = router;
