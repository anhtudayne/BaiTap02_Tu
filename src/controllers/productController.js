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
