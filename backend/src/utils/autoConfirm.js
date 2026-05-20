import db from '../models/index';

// Dùng in-memory Map để lưu các timer
const timers = new Map();

export const scheduleAutoConfirm = (orderId) => {
    // Nếu server restart, các timer này sẽ mất.
    // Việc này sẽ được bù đắp bằng 1 function chạy khi server khởi động (checkPendingOrders)
    const timeoutId = setTimeout(async () => {
        try {
            const order = await db.Order.findByPk(orderId);
            if (order && order.status === 1) { // Nếu vẫn là đơn mới
                await order.update({ status: 2, confirmedAt: new Date() });
                console.log(`[AutoConfirm] Đã tự động xác nhận đơn hàng ${order.orderCode}`);
            }
        } catch (error) {
            console.error(`[AutoConfirm] Lỗi khi xác nhận đơn hàng ${orderId}:`, error);
        }
        timers.delete(orderId);
    }, 30 * 60 * 1000); // 30 phút

    timers.set(orderId, timeoutId);
};

export const cancelAutoConfirm = (orderId) => {
    if (timers.has(orderId)) {
        clearTimeout(timers.get(orderId));
        timers.delete(orderId);
        console.log(`[AutoConfirm] Đã hủy timer tự động xác nhận cho đơn hàng ${orderId}`);
    }
};

export const checkPendingOrders = async () => {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const orders = await db.Order.findAll({
            where: {
                status: 1, // Đơn mới
                createdAt: {
                    [db.Sequelize.Op.lte]: thirtyMinutesAgo, // Quá 30 phút
                }
            }
        });

        for (const order of orders) {
            await order.update({ status: 2, confirmedAt: new Date() });
            console.log(`[AutoConfirm Boot] Đã tự động xác nhận đơn hàng ${order.orderCode}`);
        }
    } catch (error) {
        console.error('[AutoConfirm Boot] Lỗi khi quét các đơn hàng chưa xác nhận:', error);
    }
};
