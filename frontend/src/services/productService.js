import api from '../api/axiosConfig';

export const getProductsService = (params) => api.get('/products', { params });
export const getFeaturedService = () => api.get('/products/featured');
export const getNewArrivalsService = () => api.get('/products/new-arrivals');
export const getBestSellersService = () => api.get('/products/best-sellers');
export const getProductBySlugService = (slug) => api.get(`/products/${slug}`);
export const getRelatedProductsService = (id) => api.get(`/products/${id}/related`);
export const getCategoriesService = () => api.get('/categories');

// BT05 — API mới
export const getProductsByCategoryService = (slug, page = 1, limit = 8) =>
  api.get(`/products/category/${slug}`, { params: { page, limit } });
export const getTopSellersService = (limit = 10) =>
  api.get('/products/top-sellers', { params: { limit } });
export const getTopViewedService = (limit = 10) =>
  api.get('/products/top-viewed', { params: { limit } });
