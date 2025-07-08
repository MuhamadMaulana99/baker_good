module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.TEXT,  // Mengubah tipe kolom 'image' menjadi TEXT
      allowNull: true         // Memastikan kolom bisa bernilai NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('complaints', 'image', {
      type: Sequelize.STRING(255),  // Mengembalikan tipe kolom ke STRING(255) jika rollback
      allowNull: true
    });
  }
};
