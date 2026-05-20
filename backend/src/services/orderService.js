import db from '../models/index';
import { scheduleAutoConfirm, cancelAutoConfirm } from '../utils/autoConfirm';

const { Order, OrderItem, Product, ProductImage, Cart } = db;

const includeOrderItems = {
    model: OrderItem,
    as: 'items',
};

// ======================== USER SERVICES ========================

export const createOrder = async (userId, data) => {
    const { shippingName, shippingPhone, shippingProvince, shippingDistrict, shippingWard, shippingAddressDetail, paymentMethod, items, note } = data;
    
    // Bắt đầu transaction
    const transaction = await db.sequelize.transaction();

    try {
        let totalAmount = 0;
        
        // 1. Kiểm tra tồn kho và tính tổng tiền
        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            if (!product) {
                throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
            }
            totalAmount += item.price * item.quantity;
        }

        const shippingFee = 0; // Tạm thời miễn phí vận chuyển

        // 2. Tạo Order
        const orderCode = `TS-${Date.now()}`;
        const newOrder = await Order.create({
            userId,
            orderCode,
            totalAmount,
            shippingFee,
            shippingName,
            shippingPhone,
            shippingProvince,
            shippingDistrict,
            shippingWard,
            shippingAddressDetail,
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
            status: 1, // Đơn mới
            note,
        }, { transaction });

        // 3. Tạo OrderItems và Cập nhật Product stock/soldCount
        const orderItemsData = items.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
            selectedSize: item.selectedSize || null,
            selectedColor: item.selectedColor || null,
        }));

        await OrderItem.bulkCreate(orderItemsData, { transaction });

        for (const item of items) {
            await Product.decrement('stock', { by: item.quantity, where: { id: item.productId }, transaction });
            await Product.increment('soldCount', { by: item.quantity, where: { id: item.productId }, transaction });
        }

        // 4. Xóa các items đã checkout khỏi giỏ hàng
        const productIdsToClear = items.map(item => item.productId);
        await Cart.destroy({
            where: {
                userId,
                productId: { [db.Sequelize.Op.in]: productIdsToClear }
            },
            transaction
        });

        // Hoàn tất transaction
        await transaction.commit();

        // 5. Khởi động timer auto-confirm
        scheduleAutoConfirm(newOrder.id);

        return { status: 201, message: 'Đặt hàng thành công', data: newOrder };

    } catch (error) {
        await transaction.rollback();
        // Nếu lỗi do mình ném ra thì trả về 400
        if (error.message.includes('không đủ số lượng') || error.message.includes('không tồn tại')) {
            return { status: 400, message: error.message };
        }
        throw error;
    }
};

export const getOrdersByUser = async (userId, query) => {
    try {
        const { page = 1, limit = 10, status } = query;
        const where = { userId };
        
        if (status) {
            where.status = status;
        }

        const offset = (Number(page) - 1) * Number(limit);

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [includeOrderItems],
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset,
            distinct: true,
        });

        return {
            status: 200,
            data: rows,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / Number(limit))
            }
        };
    } catch (error) {
        throw error;
    }
};

export const getOrderDetail = async (userId, orderId) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId, userId },
            include: [includeOrderItems],
        });

        if (!order) return { status: 404, message: 'Không tìm thấy đơn hàng' };
        return { status: 200, data: order };
    } catch (error) {
        throw error;
    }
};

// Hủy đơn (chỉ được khi status = 1)
export const cancelOrder = async (userId, orderId, reason) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId, userId },
            include: [includeOrderItems],
        });

        if (!order) return { status: 404, message: 'Không tìm thấy đơn hàng' };

        if (order.status !== 1) {
            return { status: 400, message: 'Đơn hàng đã được xác nhận, không thể hủy trực tiếp' };
        }

        const transaction = await db.sequelize.transaction();
        try {
            await order.update({ status: 6, cancelReason: reason }, { transaction });

            // Hoàn lại tồn kho
            for (const item of order.items) {
                await Product.increment('stock', { by: item.quantity, where: { id: item.productId }, transaction });
                await Product.decrement('soldCount', { by: item.quantity, where: { id: item.productId }, transaction });
            }

            await transaction.commit();
            cancelAutoConfirm(order.id);
            return { status: 200, message: 'Hủy đơn hàng thành công' };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

// Gửi yêu cầu hủy (khi status = 2 hoặc 3)
export const requestCancelOrder = async (userId, orderId, reason) => {
    try {
        const order = await Order.findOne({ where: { id: orderId, userId } });

        if (!order) return { status: 404, message: 'Không tìm thấy đơn hàng' };

        if (order.status !== 2 && order.status !== 3) {
            return { status: 400, message: 'Trạng thái đơn hàng không hợp lệ để gửi yêu cầu hủy' };
        }

        if (order.hasCancelRequest) {
            return { status: 400, message: 'Đơn hàng này đã có yêu cầu hủy đang chờ xử lý' };
        }

        await order.update({ hasCancelRequest: true, cancelRequestReason: reason });
        return { status: 200, message: 'Đã gửi yêu cầu hủy đơn hàng đến quản trị viên' };
    } catch (error) {
        throw error;
    }
};

// ======================== ADMIN SERVICES ========================

export const getAllOrders = async (query) => {
    try {
        const { page = 1, limit = 10, status, orderCode } = query;
        const where = {};
        
        if (status) where.status = status;
        if (orderCode) where.orderCode = { [db.Sequelize.Op.like]: `%${orderCode}%` };

        const offset = (Number(page) - 1) * Number(limit);

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [
                includeOrderItems,
                { model: db.User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset,
            distinct: true,
        });

        return {
            status: 200,
            data: rows,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / Number(limit))
            }
        };
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const order = await Order.findByPk(orderId, { include: [includeOrderItems] });
        if (!order) return { status: 404, message: 'Không tìm thấy đơn hàng' };

        // Nếu admin duyệt từ 1 -> 2, hủy auto confirm
        if (order.status === 1 && newStatus === 2) {
            cancelAutoConfirm(order.id);
            await order.update({ status: 2, confirmedAt: new Date() });
            return { status: 200, message: 'Cập nhật trạng thái thành công' };
        }
        
        // Nếu admin hủy đơn trực tiếp
        if (newStatus === 6 && order.status !== 6) {
            const transaction = await db.sequelize.transaction();
            try {
                await order.update({ status: 6, cancelReason: 'Admin đã hủy đơn hàng' }, { transaction });
                for (const item of order.items) {
                    await Product.increment('stock', { by: item.quantity, where: { id: item.productId }, transaction });
                    await Product.decrement('soldCount', { by: item.quantity, where: { id: item.productId }, transaction });
                }
                await transaction.commit();
                cancelAutoConfirm(order.id);
                return { status: 200, message: 'Đã hủy đơn hàng' };
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        }

        await order.update({ status: newStatus });
        return { status: 200, message: 'Cập nhật trạng thái thành công' };
    } catch (error) {
        throw error;
    }
};

export const handleCancelRequest = async (orderId, approve) => {
    try {
        const order = await Order.findByPk(orderId, { include: [includeOrderItems] });
        if (!order || !order.hasCancelRequest) {
            return { status: 404, message: 'Không tìm thấy đơn hàng hoặc không có yêu cầu hủy' };
        }

        if (approve) {
            const transaction = await db.sequelize.transaction();
            try {
                await order.update({ 
                    status: 6, 
                    cancelReason: `Chấp nhận yêu cầu hủy: ${order.cancelRequestReason}`,
                    hasCancelRequest: false 
                }, { transaction });

                for (const item of order.items) {
                    await Product.increment('stock', { by: item.quantity, where: { id: item.productId }, transaction });
                    await Product.decrement('soldCount', { by: item.quantity, where: { id: item.productId }, transaction });
                }
                await transaction.commit();
                return { status: 200, message: 'Đã duyệt yêu cầu hủy đơn' };
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } else {
            await order.update({ hasCancelRequest: false });
            return { status: 200, message: 'Đã từ chối yêu cầu hủy đơn' };
        }
    } catch (error) {
        throw error;
    }
};
