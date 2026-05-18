'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
            Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
        }
    }
    Product.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: DataTypes.TEXT,
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            salePrice: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            stock: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            soldCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            viewCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            brand: DataTypes.STRING,
            sizes: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            colors: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
            isFeatured: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isNewArrival: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isBestSeller: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Product',
        }
    );
    return Product;
};
