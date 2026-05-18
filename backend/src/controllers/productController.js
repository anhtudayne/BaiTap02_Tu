import * as productService from '../services/productService';

export const handleGetProducts = async (req, res) => {
    try {
        const result = await productService.getProducts(req.query);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy danh sách sản phẩm:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetFeatured = async (req, res) => {
    try {
        const result = await productService.getFeatured();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy SP nổi bật:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetNewArrivals = async (req, res) => {
    try {
        const result = await productService.getNewArrivals();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy SP mới:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetBestSellers = async (req, res) => {
    try {
        const result = await productService.getBestSellers();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy SP bán chạy:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetProductBySlug = async (req, res) => {
    try {
        const result = await productService.getProductBySlug(req.params.slug);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy chi tiết SP:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetRelatedProducts = async (req, res) => {
    try {
        const result = await productService.getRelatedProducts(req.params.id);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy SP liên quan:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetCategories = async (req, res) => {
    try {
        const result = await productService.getAllCategories();
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

// ===== API MỚI (BT05) =====

export const handleGetProductsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 8 } = req.query;
        const result = await productService.getProductsByCategory(slug, page, limit);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy SP theo danh mục:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetTopBestSellers = async (req, res) => {
    try {
        const result = await productService.getTopBestSellers(req.query.limit);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy top bán chạy:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetTopMostViewed = async (req, res) => {
    try {
        const result = await productService.getTopMostViewed(req.query.limit);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy top xem nhiều:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};
