import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { checkoutValidation, handleValidationErrors } from '../middlewares/validators/orderValidator';
import {
    handleCreateOrder,
    handleGetMyOrders,
    handleGetOrderDetail,
    handleCancelOrder,
    handleRequestCancelOrder,
    handleGetAllOrders,
    handleUpdateOrderStatus,
    handleProcessCancelRequest
} from '../controllers/orderController';

const router = express.Router();

// ======================== ADMIN ROUTES ========================
// Thêm admin route lên trước để không bị dính vào /:id
router.get('/admin/all', verifyToken, authorizeRole('admin'), handleGetAllOrders);
router.put('/admin/:id/status', verifyToken, authorizeRole('admin'), handleUpdateOrderStatus);
router.put('/admin/:id/cancel-request', verifyToken, authorizeRole('admin'), handleProcessCancelRequest);

// ======================== USER ROUTES ========================
router.use(verifyToken);

router.post('/', checkoutValidation, handleValidationErrors, handleCreateOrder);
router.get('/', handleGetMyOrders);
router.get('/:id', handleGetOrderDetail);
router.post('/:id/cancel', handleCancelOrder);
router.post('/:id/request-cancel', handleRequestCancelOrder);

export default router;
