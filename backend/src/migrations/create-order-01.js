'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            orderCode: { type: Sequelize.STRING, allowNull: false, unique: true },
            totalAmount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            shippingFee: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
            // Thông tin giao hàng — tách thành nhiều trường
            shippingName: { type: Sequelize.STRING, allowNull: false },
            shippingPhone: { type: Sequelize.STRING(10), allowNull: false },
            shippingProvince: { type: Sequelize.STRING, allowNull: false },
            shippingDistrict: { type: Sequelize.STRING, allowNull: false },
            shippingWard: { type: Sequelize.STRING, allowNull: false },
            shippingAddressDetail: { type: Sequelize.STRING, allowNull: false },
            // Phương thức thanh toán
            paymentMethod: {
                type: Sequelize.ENUM('COD', 'MOMO'),
                allowNull: false,
                defaultValue: 'COD',
            },
            paymentStatus: {
                type: Sequelize.ENUM('pending', 'paid', 'failed'),
                allowNull: false,
                defaultValue: 'pending',
            },
            // Trạng thái đơn hàng: 1-6
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                comment: '1=Đơn mới, 2=Đã xác nhận, 3=Đang chuẩn bị, 4=Đang giao, 5=Đã giao, 6=Đã hủy',
            },
            // Hủy đơn
            cancelReason: { type: Sequelize.TEXT, allowNull: true },
            cancelRequestReason: { type: Sequelize.TEXT, allowNull: true },
            hasCancelRequest: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            // Timestamps trạng thái
            confirmedAt: { type: Sequelize.DATE, allowNull: true },
            note: { type: Sequelize.TEXT, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Orders');
    },
};
