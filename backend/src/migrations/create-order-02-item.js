'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderItems', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Orders', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: 'Products', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            productName: { type: Sequelize.STRING, allowNull: false },
            productImage: { type: Sequelize.STRING, allowNull: true },
            price: { type: Sequelize.INTEGER, allowNull: false },
            quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
            selectedSize: { type: Sequelize.STRING, allowNull: true },
            selectedColor: { type: Sequelize.STRING, allowNull: true },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('OrderItems');
    },
};
