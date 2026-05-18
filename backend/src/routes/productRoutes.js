import express from 'express';
import {
    handleGetProducts, handleGetFeatured, handleGetNewArrivals, handleGetBestSellers,
    handleGetProductBySlug, handleGetRelatedProducts, handleGetCategories,
    handleGetProductsByCategory, handleGetTopBestSellers, handleGetTopMostViewed,
} from '../controllers/productController';

let router = express.Router();

router.get('/categories', handleGetCategories);
router.get('/products', handleGetProducts);
router.get('/products/featured', handleGetFeatured);
router.get('/products/new-arrivals', handleGetNewArrivals);
router.get('/products/best-sellers', handleGetBestSellers);
router.get('/products/top-sellers', handleGetTopBestSellers);
router.get('/products/top-viewed', handleGetTopMostViewed);
router.get('/products/category/:slug', handleGetProductsByCategory);
router.get('/products/:slug', handleGetProductBySlug);
router.get('/products/:id/related', handleGetRelatedProducts);

export default router;
