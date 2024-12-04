'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        }
    }, {
        tableName: 'presensi_user',
        timestamps: true // Menyediakan kolom createdAt dan updatedAt
    });

    User.associate = function(models) {
        // Relasi dengan tabel Absen
        User.hasMany(models.Absen, {
            foreignKey: 'id_user',
            as: 'absensi'
        });
    };

    return User;
};
