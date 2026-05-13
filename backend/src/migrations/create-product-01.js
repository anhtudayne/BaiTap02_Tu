'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.TEXT },
            price: { type: Sequelize.INTEGER, allowNull: false },
            salePrice: { type: Sequelize.INTEGER, allowNull: true },
            stock: { type: Sequelize.INTEGER, defaultValue: 0 },
            soldCount: { type: Sequelize.INTEGER, defaultValue: 0 },
            brand: { type: Sequelize.STRING },
            sizes: { type: Sequelize.JSON, defaultValue: [] },
            colors: { type: Sequelize.JSON, defaultValue: [] },
            isFeatured: { type: Sequelize.BOOLEAN, defaultValue: false },
            isNewArrival: { type: Sequelize.BOOLEAN, defaultValue: false },
            isBestSeller: { type: Sequelize.BOOLEAN, defaultValue: false },
            isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'Categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Products');
    },
};
