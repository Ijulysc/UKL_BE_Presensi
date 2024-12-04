const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

/** Get all users */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json({
            success: true,
            data: users,
            message: 'All users have been loaded'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Get user by ID */
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ where: { id_user: id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${id} not found`
            });
        }
        return res.json({
            success: true,
            data: user,
            message: `User with ID ${id} found`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Find user by keyword */
exports.findUser = async (req, res) => {
    const { keyword } = req.body;
    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.substring]: keyword } },
                    { username: { [Op.substring]: keyword } },
                    { role: { [Op.substring]: keyword } }
                ]
            }
        });
        return res.json({
            success: true,
            data: users,
            message: 'Users have been filtered'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Add new user */
exports.addUser = async (req, res) => {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, username, and password are required'
        });
    }

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
            role: role || 'user'
        });

        return res.json({
            success: true,
            data: newUser,
            message: 'New user has been added'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Update user */
exports.updateUser = async (req, res) => {
    const { id_user, name, username, role, password } = req.body;

    if (!id_user || !name || !username) {
        return res.status(400).json({
            success: false,
            message: 'ID, name, and username are required'
        });
    }

    const dataToUpdate = { name, username, role };

    if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    try {
        const updated = await User.update(dataToUpdate, { where: { id_user } });
        if (updated[0] === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or no changes made'
            });
        }

        const updatedUser = await User.findOne({ where: { id_user } });
        return res.json({
            success: true,
            data: updatedUser,
            message: 'User has been updated'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Delete user */
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.destroy({ where: { id_user: id } });
        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'User has been deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
