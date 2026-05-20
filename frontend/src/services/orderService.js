import api from '../api/axiosConfig';

export const createOrderService = (data) => api.post('/orders', data);
export const getMyOrdersService = (params) => api.get('/orders', { params });
export const getOrderDetailService = (id) => api.get(`/orders/${id}`);
export const cancelOrderService = (id, data) => api.post(`/orders/${id}/cancel`, data);
export const requestCancelOrderService = (id, data) => api.post(`/orders/${id}/request-cancel`, data);
