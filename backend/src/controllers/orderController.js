import * as orderService from '../services/orderService';

// ======================== USER CONTROLLERS ========================

export const handleCreateOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await orderService.createOrder(userId, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi tạo đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await orderService.getOrdersByUser(userId, req.query);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetOrderDetail = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const result = await orderService.getOrderDetail(userId, orderId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy chi tiết đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleCancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const { reason } = req.body;
        const result = await orderService.cancelOrder(userId, orderId, reason);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi hủy đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleRequestCancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const { reason } = req.body;
        const result = await orderService.requestCancelOrder(userId, orderId, reason);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi gửi yêu cầu hủy đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

// ======================== ADMIN CONTROLLERS ========================

export const handleGetAllOrders = async (req, res) => {
    try {
        const result = await orderService.getAllOrders(req.query);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy tất cả đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleUpdateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const result = await orderService.updateOrderStatus(orderId, status);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleProcessCancelRequest = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { approve } = req.body;
        const result = await orderService.handleCancelRequest(orderId, approve);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi xử lý yêu cầu hủy đơn:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};
