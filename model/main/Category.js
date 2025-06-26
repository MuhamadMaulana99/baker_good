const { kategoriPengaduan } = require("../../helper");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  // ✅ Gabungkan semua relasi ke dalam satu associate
  Category.associate = (models) => {
    Category.hasMany(models.Complaint, {
      foreignKey: 'category_id',
      as: 'complaints',
    });

    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products',
    });
  };

  return Category;
};

