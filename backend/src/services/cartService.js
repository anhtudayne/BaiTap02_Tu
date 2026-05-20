import db from '../models/index';

const { Cart, Product, ProductImage } = db;

const includeProduct = {
    model: Product,
    as: 'product',
    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'stock', 'brand'],
    include: [
        {
            model: ProductImage,
            as: 'images',
            attributes: ['imageUrl', 'isPrimary'],
            where: { isPrimary: true },
            required: false, // In case product has no primary image
        },
    ],
};

export const getCart = async (userId) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [includeProduct],
            order: [['createdAt', 'DESC']],
        });
        return { status: 200, data: cartItems };
    } catch (error) {
        throw error;
    }
};

export const addToCart = async (userId, data) => {
    const { productId, quantity, selectedSize, selectedColor } = data;
    try {
        // Validate product exists and has enough stock
        const product = await Product.findByPk(productId);
        if (!product) return { status: 404, message: 'Sản phẩm không tồn tại' };
        if (product.stock < quantity) return { status: 400, message: 'Số lượng sản phẩm trong kho không đủ' };

        // Check if item already exists in cart with same size and color
        const existingItem = await Cart.findOne({
            where: { userId, productId, selectedSize: selectedSize || null, selectedColor: selectedColor || null },
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return { status: 400, message: 'Số lượng sản phẩm trong kho không đủ để thêm' };
            }
            await existingItem.update({ quantity: newQuantity });
            return { status: 200, message: 'Cập nhật số lượng thành công', data: existingItem };
        } else {
            const newItem = await Cart.create({
                userId,
                productId,
                quantity,
                selectedSize: selectedSize || null,
                selectedColor: selectedColor || null,
            });
            return { status: 201, message: 'Thêm vào giỏ hàng thành công', data: newItem };
        }
    } catch (error) {
        throw error;
    }
};

export const updateCartItem = async (userId, cartId, data) => {
    const { quantity } = data;
    try {
        const cartItem = await Cart.findOne({
            where: { id: cartId, userId },
            include: [{ model: Product, as: 'product' }],
        });

        if (!cartItem) return { status: 404, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
        if (cartItem.product.stock < quantity) {
            return { status: 400, message: 'Số lượng sản phẩm trong kho không đủ' };
        }

        await cartItem.update({ quantity });
        return { status: 200, message: 'Cập nhật số lượng thành công', data: cartItem };
    } catch (error) {
        throw error;
    }
};

export const removeCartItem = async (userId, cartId) => {
    try {
        const cartItem = await Cart.findOne({ where: { id: cartId, userId } });
        if (!cartItem) return { status: 404, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };

        await cartItem.destroy();
        return { status: 200, message: 'Xóa sản phẩm khỏi giỏ hàng thành công' };
    } catch (error) {
        throw error;
    }
};

export const clearCart = async (userId) => {
    try {
        await Cart.destroy({ where: { userId } });
        return { status: 200, message: 'Xóa toàn bộ giỏ hàng thành công' };
    } catch (error) {
        throw error;
    }
};
