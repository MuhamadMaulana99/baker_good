'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('complaints', 'code_complaint', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true, // bisa dibuat false jika nanti langsung di-generate
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('complaints', 'code_complaint');
  }
};
