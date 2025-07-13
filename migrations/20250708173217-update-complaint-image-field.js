'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alter the `image` column in the `complaints` table to change it to BLOB('long')
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // In case we need to revert the migration, revert the column back to its previous state
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  }
};
