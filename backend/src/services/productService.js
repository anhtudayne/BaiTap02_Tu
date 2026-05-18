import db from '../models/index';
const { Op } = require('sequelize');

const Product = db.Product;
const Category = db.Category;
const ProductImage = db.ProductImage;

const includeImages = { model: ProductImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'sortOrder'], order: [['sortOrder', 'ASC']] };
const includeCategory = { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] };

// Get products with filters, search, pagination
export const getProducts = async (query) => {
    const { search, category, brand, minPrice, maxPrice, sizes, sort, page = 1, limit = 12 } = query;
    const where = { isActive: true };

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (brand) where.brand = { [Op.in]: brand.split(',') };
    if (minPrice) where.price = { ...where.price, [Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: Number(maxPrice) };
    if (sizes) {
        const sizeArr = sizes.split(',').map(Number);
        where[Op.and] = sizeArr.map(s => db.sequelize.literal(`JSON_CONTAINS(sizes, '${s}')`));
    }

    const include = [includeImages];
    if (category) {
        include.push({ model: Category, as: 'category', attributes: ['id', 'name', 'slug'], where: { slug: category } });
    } else {
        include.push(includeCategory);
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'best_seller') order = [['soldCount', 'DESC']];
    else if (sort === 'newest') order = [['createdAt', 'DESC']];

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Product.findAndCountAll({
        where, include, order, limit: Number(limit), offset, distinct: true,
    });

    return {
        status: 200,
        data: rows,
        pagination: { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) },
    };
};

// Featured products
export const getFeatured = async () => {
    const products = await Product.findAll({
        where: { isFeatured: true, isActive: true },
        include: [includeImages, includeCategory],
        limit: 8,
        order: [['soldCount', 'DESC']],
    });
    return { status: 200, data: products };
};

// New arrivals
export const getNewArrivals = async () => {
    const products = await Product.findAll({
        where: { isNewArrival: true, isActive: true },
        include: [includeImages, includeCategory],
        limit: 8,
        order: [['createdAt', 'DESC']],
    });
    return { status: 200, data: products };
};

// Best sellers
export const getBestSellers = async () => {
    const products = await Product.findAll({
        where: { isBestSeller: true, isActive: true },
        include: [includeImages, includeCategory],
        limit: 8,
        order: [['soldCount', 'DESC']],
    });
    return { status: 200, data: products };
};

// Product detail by slug (tăng viewCount mỗi lần xem)
export const getProductBySlug = async (slug) => {
    const product = await Product.findOne({
        where: { slug, isActive: true },
        include: [includeImages, includeCategory],
    });
    if (!product) return { status: 404, message: 'Không tìm thấy sản phẩm.' };

    // Tăng viewCount +1
    await product.increment('viewCount');
    await product.reload();

    return { status: 200, data: product };
};

// Related products (same category, exclude current)
export const getRelatedProducts = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) return { status: 404, message: 'Không tìm thấy sản phẩm.' };

    const related = await Product.findAll({
        where: { categoryId: product.categoryId, id: { [Op.ne]: id }, isActive: true },
        include: [includeImages, includeCategory],
        limit: 4,
        order: [['soldCount', 'DESC']],
    });
    return { status: 200, data: related };
};

// All categories
export const getAllCategories = async () => {
    const categories = await Category.findAll({
        where: { isActive: true },
        order: [['name', 'ASC']],
    });
    return { status: 200, data: categories };
};

// ===== API MỚI (BT05) =====

// Sản phẩm theo danh mục (phân trang cho Infinite Scroll)
export const getProductsByCategory = async (categorySlug, page = 1, limit = 8) => {
    const category = await Category.findOne({ where: { slug: categorySlug, isActive: true } });
    if (!category) return { status: 404, message: 'Không tìm thấy danh mục.' };

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Product.findAndCountAll({
        where: { categoryId: category.id, isActive: true },
        include: [includeImages, includeCategory],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset,
        distinct: true,
    });

    return {
        status: 200,
        category: { id: category.id, name: category.name, slug: category.slug },
        data: rows,
        pagination: { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) },
    };
};

// Top 10 bán chạy nhất (theo soldCount)
export const getTopBestSellers = async (limit = 10) => {
    const products = await Product.findAll({
        where: { isActive: true },
        include: [includeImages, includeCategory],
        order: [['soldCount', 'DESC']],
        limit: Number(limit),
    });
    return { status: 200, data: products };
};

// Top 10 xem nhiều nhất (theo viewCount)
export const getTopMostViewed = async (limit = 10) => {
    const products = await Product.findAll({
        where: { isActive: true },
        include: [includeImages, includeCategory],
        order: [['viewCount', 'DESC']],
        limit: Number(limit),
    });
    return { status: 200, data: products };
};
