const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Routes untuk authentication
router.post('/login', authController.login);           // User login

module.exports = router;
