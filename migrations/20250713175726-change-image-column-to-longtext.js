module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.TEXT('long'),  // Ganti ini menjadi LONGTEXT untuk MySQL
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.TEXT,  // Kembali ke tipe TEXT standar jika dibutuhkan
      allowNull: true
    });
  }
};
