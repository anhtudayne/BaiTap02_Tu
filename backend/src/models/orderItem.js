'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
            OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }
    OrderItem.init(
        {
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            // Snapshot thông tin sản phẩm tại thời điểm mua
            productName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            productImage: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            selectedSize: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            selectedColor: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'OrderItem',
        }
    );
    return OrderItem;
};
