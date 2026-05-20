import { body } from 'express-validator';
import { handleValidationErrors } from './authValidator';

export const checkoutValidation = [
    body('shippingName').notEmpty().withMessage('Tên người nhận không được để trống'),
    body('shippingPhone')
        .notEmpty().withMessage('Số điện thoại không được để trống')
        .isLength({ min: 10, max: 10 }).withMessage('Số điện thoại phải gồm 10 chữ số')
        .isNumeric().withMessage('Số điện thoại không hợp lệ'),
    body('shippingProvince').notEmpty().withMessage('Tỉnh/Thành phố không được để trống'),
    body('shippingDistrict').notEmpty().withMessage('Quận/Huyện không được để trống'),
    body('shippingWard').notEmpty().withMessage('Phường/Xã không được để trống'),
    body('shippingAddressDetail').notEmpty().withMessage('Địa chỉ chi tiết không được để trống'),
    body('paymentMethod').isIn(['COD', 'MOMO']).withMessage('Phương thức thanh toán không hợp lệ'),
    
    // Validate items array
    body('items').isArray({ min: 1 }).withMessage('Giỏ hàng trống'),
    body('items.*.productId').isInt().withMessage('ID sản phẩm không hợp lệ'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Số lượng không hợp lệ'),
    body('items.*.price').isInt({ min: 0 }).withMessage('Giá sản phẩm không hợp lệ'),
];

export { handleValidationErrors };
