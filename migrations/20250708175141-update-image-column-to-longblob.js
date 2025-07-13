'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.LONGBLOB,
      allowNull: true, // Sesuaikan dengan pengaturan Anda
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back ke tipe BLOB jika diperlukan
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.BLOB,
      allowNull: true, // Sesuaikan dengan pengaturan Anda
    });
  }
};
