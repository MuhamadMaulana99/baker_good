module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  }
};
