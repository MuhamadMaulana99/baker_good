module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
  }, {
    tableName: 'products',
    timestamps: true,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Complaint, {
      foreignKey: 'product_id',
      as: 'complaints',
    });

    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  };

  return Product;
};
