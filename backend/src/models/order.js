'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
        }
    }
    Order.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            orderCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            totalAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            shippingFee: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            // Thông tin giao hàng (tách thành nhiều trường)
            shippingName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shippingPhone: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            shippingProvince: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shippingDistrict: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shippingWard: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shippingAddressDetail: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            // Phương thức thanh toán
            paymentMethod: {
                type: DataTypes.ENUM('COD', 'MOMO'),
                allowNull: false,
                defaultValue: 'COD',
            },
            paymentStatus: {
                type: DataTypes.ENUM('pending', 'paid', 'failed'),
                allowNull: false,
                defaultValue: 'pending',
            },
            // Trạng thái đơn hàng: 1=Đơn mới, 2=Đã xác nhận, 3=Đang chuẩn bị, 4=Đang giao, 5=Đã giao, 6=Đã hủy
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            // Hủy đơn
            cancelReason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            cancelRequestReason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            hasCancelRequest: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            // Timestamps trạng thái
            confirmedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Order',
        }
    );
    return Order;
};
