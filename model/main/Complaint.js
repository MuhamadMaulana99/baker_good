module.exports = (sequelize, DataTypes) => {
    const Complaint = sequelize.define('Complaint', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        code_complaint: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        product_id: DataTypes.INTEGER,
        category_id: DataTypes.INTEGER,
        customer_name: DataTypes.STRING,
        contact: DataTypes.STRING,
        description: DataTypes.TEXT,
        image: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        date_occurrence: DataTypes.DATEONLY,
        status: {
            type: DataTypes.ENUM('Masuk', 'Diproses', 'Selesai', 'Ditolak'),
            defaultValue: 'Masuk',
        },
        admin_response: DataTypes.TEXT,
    }, {
        tableName: 'complaints',
        timestamps: true,
    });

    Complaint.associate = (models) => {
        Complaint.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        Complaint.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product',
        });

        Complaint.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });
    };

    return Complaint;
};
