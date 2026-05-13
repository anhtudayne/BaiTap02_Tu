'use strict';
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('Categories', [
            { id: 1, name: 'Sneakers', slug: 'sneakers', description: 'Giày thể thao phong cách đường phố', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400', isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: 'Running', slug: 'running', description: 'Giày chạy bộ chuyên dụng', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, name: 'Casual', slug: 'casual', description: 'Giày thường ngày thoải mái', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400', isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 4, name: 'Sandals', slug: 'sandals', description: 'Dép và sandal thời trang', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400', isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 5, name: 'Boots', slug: 'boots', description: 'Giày boot cá tính', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('Categories', null, {});
    },
};
