'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('categories', 'category_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Misalnya sebelumnya ENUM atau INTEGER, kamu bisa ubah balik seperti ini:
    // ENUM contoh ↓ (ganti sesuai isi ENUM lama kalau kamu pakai sebelumnya)
    // const { kategoriPengaduan } = require('../../helper');
    // type: Sequelize.ENUM(...kategoriPengaduan)

    await queryInterface.changeColumn('categories', 'category_name', {
      type: Sequelize.INTEGER, // Atau ENUM, tergantung sebelumnya
      allowNull: true,
    });
  }
};
