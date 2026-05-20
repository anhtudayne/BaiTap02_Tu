import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
    handleGetCart,
    handleAddToCart,
    handleUpdateCartItem,
    handleRemoveCartItem,
    handleClearCart
} from '../controllers/cartController';
    
const router = express.Router();

// Tất cả route giỏ hàng đều yêu cầu đăng nhập
router.use(verifyToken);

router.get('/', handleGetCart);
router.post('/', handleAddToCart);
router.put('/:id', handleUpdateCartItem);
router.delete('/:id', handleRemoveCartItem);
router.delete('/', handleClearCart);

export default router;
