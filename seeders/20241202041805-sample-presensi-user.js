'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('presensi_user', [
      {
        name: 'John Doe',
        username: 'john_doe',
        password: 'hashed_password',  // Pastikan password di-hash sebelum disimpan
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        username: 'jane_smith',
        password: 'hashed_password',  // Pastikan password di-hash sebelum disimpan
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mark Johnson',
        username: 'mark_johnson',
        password: 'hashed_password',  // Pastikan password di-hash sebelum disimpan
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('presensi_user', null, {});
  }
};
