import api from '../api/axiosConfig';

export const getCartService = () => api.get('/cart');
export const addToCartService = (data) => api.post('/cart', data);
export const updateCartItemService = (id, data) => api.put(`/cart/${id}`, data);
export const removeCartItemService = (id) => api.delete(`/cart/${id}`);
export const clearCartService = () => api.delete('/cart');
