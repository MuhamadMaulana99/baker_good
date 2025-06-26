'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'categories', // nama tabel tujuan
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // atau CASCADE sesuai kebutuhan
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'category_id');
  }
};
