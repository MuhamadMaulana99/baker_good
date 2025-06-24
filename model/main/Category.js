module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    category_name: DataTypes.STRING,
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Complaint, {
      foreignKey: 'category_id',
      as: 'complaints',
    });
  };

  return Category;
};
