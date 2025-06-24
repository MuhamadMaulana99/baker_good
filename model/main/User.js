// const { DataTypes } = require('sequelize')
// const sequelize = require('./index.js')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('tb_users', {
        id_users: {
            type: DataTypes.INTEGER,  // Changed to INTEGER
            autoIncrement: true,      // Set autoIncrement
            primaryKey: true,          // Set as primary key
            allowNull: false,          // Prevent null values for primary key
        },
        username: {
            type: DataTypes.STRING(20),
            default: null,
        },
        password: {
            type: DataTypes.STRING(255),
            default: null,
        },
        userRoles: {
            type: DataTypes.ENUM("admin", "user"),
            default: null,
        },
    })
    User.associate = (models) => {
        User.hasMany(models.Complaint, {
            foreignKey: 'user_id',
            as: 'complaints',
        });
    };
    return User;
}