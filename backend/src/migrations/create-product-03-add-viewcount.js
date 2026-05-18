'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Products', 'viewCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            after: 'soldCount',
        });
    },
    async down(queryInterface) {
        await queryInterface.removeColumn('Products', 'viewCount');
    },
};
