'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.TEXT,
      allowNull: true, // atau false, tergantung kebutuhan kamu
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // sesuaikan juga
    });
  }
};
