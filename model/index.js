const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

// Inisialisasi koneksi Sequelize
const sequelize = new Sequelize("db_goodBakeds", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import semua model
db.User = require("./main/User.js")(sequelize, Sequelize.DataTypes);
db.Product = require("./main/Product.js")(sequelize, Sequelize.DataTypes);
db.Category = require("./main/Category.js")(sequelize, Sequelize.DataTypes);
db.Complaint = require("./main/Complaint.js")(sequelize, Sequelize.DataTypes);

// Hubungan relasi antar model
// Complaint ↔ User
db.User.hasMany(db.Complaint, { foreignKey: "user_id", as: "complaints" });
db.Complaint.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

// Complaint ↔ Product
db.Product.hasMany(db.Complaint, { foreignKey: "product_id", as: "complaints" });
db.Complaint.belongsTo(db.Product, { foreignKey: "product_id", as: "product" });

// Complaint ↔ Category
db.Category.hasMany(db.Complaint, { foreignKey: "category_id", as: "complaints" });
db.Complaint.belongsTo(db.Category, { foreignKey: "category_id", as: "category" });

// Product ↔ Category
db.Product.belongsTo(db.Category, { foreignKey: "category_id", as: "category" });
db.Category.hasMany(db.Product, { foreignKey: "category_id", as: "products" });

// Uji koneksi ke database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

module.exports = db;
