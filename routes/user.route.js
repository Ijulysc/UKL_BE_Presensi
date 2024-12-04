
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Routes untuk user management
router.get('/:id', userController.getUserById); // Rute untuk GET user berdasarkan ID
router.get('/', userController.getAllUsers);        // Get all users
router.post('/', userController.addUser);           // Add new user
router.post('/search', userController.findUser);    // Search users by keyword
router.put('/', userController.updateUser);      // Update user data
router.delete('/:id', userController.deleteUser);   // Delete user

module.exports = router;
