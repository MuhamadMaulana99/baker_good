module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_name: DataTypes.STRING,
  }, {
    tableName: 'products',
    timestamps: true,
  });

  Product.associate = (models) => {
    Product.hasMany(models.Complaint, {
      foreignKey: 'product_id',
      as: 'complaints',
    });
  };

  return Product;
};
