import api from '../api/axiosConfig';

export const getProductsService = (params) => api.get('/products', { params });

export const getFeaturedService = () => api.get('/products/featured');

export const getNewArrivalsService = () => api.get('/products/new-arrivals');

export const getBestSellersService = () => api.get('/products/best-sellers');

export const getProductBySlugService = (slug) => api.get(`/products/${slug}`);

export const getRelatedProductsService = (id) => api.get(`/products/${id}/related`);

export const getCategoriesService = () => api.get('/categories');
