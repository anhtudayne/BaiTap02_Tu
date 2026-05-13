import express from 'express';
import { handleGetProducts, handleGetFeatured, handleGetNewArrivals, handleGetBestSellers, handleGetProductBySlug, handleGetRelatedProducts, handleGetCategories } from '../controllers/productController';

let router = express.Router();

router.get('/categories', handleGetCategories);
router.get('/products', handleGetProducts);
router.get('/products/featured', handleGetFeatured);
router.get('/products/new-arrivals', handleGetNewArrivals);
router.get('/products/best-sellers', handleGetBestSellers);
router.get('/products/:slug', handleGetProductBySlug);
router.get('/products/:id/related', handleGetRelatedProducts);

export default router;
