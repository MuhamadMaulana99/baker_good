'use strict';

const { kategoriPengaduan } = require("../helper");

// const { kategoriPengaduan } = require("../../helper"); // Pastikan path-nya benar

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('categories', 'category_name', {
      type: Sequelize.ENUM(...kategoriPengaduan),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Untuk rollback, kamu bisa revert ke STRING atau ENUM default
    await queryInterface.changeColumn('categories', 'category_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // NOTE: Sequelize tidak otomatis drop ENUM type di PostgreSQL, perlu manual drop jika perlu
  }
};
