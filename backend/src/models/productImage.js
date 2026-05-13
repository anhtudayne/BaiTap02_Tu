'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {
        static associate(models) {
            ProductImage.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }
    ProductImage.init(
        {
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isPrimary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            sortOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'ProductImage',
        }
    );
    return ProductImage;
};
