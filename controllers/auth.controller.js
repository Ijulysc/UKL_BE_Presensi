const { User } = require('../models/index');
const hash= require('md5');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { request, response } = require('express');
// const db = require('../config/db');
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    console.log('User model:', User); // Pastikan objek User ada
    console.log('Received username:', username); // Debug nilai username yang dikirim
    console.log('Received password:', password); // Debug nilai password yang dikirim

    try {
        const user = await User.findOne({
            where: { username }
        });

        console.log('Found user:', user); // Debug apakah user ditemukan atau tidak

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValidPassword); // Debug apakah password cocok

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: user.id_user, username: user.username, role: user.role },
            'your_secret_key_here',  // Gunakan .env untuk kunci rahasia
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error.message); // Debug error
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
