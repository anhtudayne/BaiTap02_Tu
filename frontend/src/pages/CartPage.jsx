import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem, clearCart, clearCartMessage } from '../store/slices/cartSlice';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (cartId, newQty, maxStock) => {
    if (newQty < 1 || newQty > maxStock) return;
    dispatch(updateCartItem({ id: cartId, quantity: newQty })).then(() => dispatch(fetchCart()));
  };

  const handleRemove = (cartId) => {
    setRemovingId(cartId);
    dispatch(removeCartItem(cartId)).then(() => {
      dispatch(fetchCart());
      setRemovingId(null);
    });
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      dispatch(clearCart());
    }
  };

  // Tính tổng
  const totalAmount = items.reduce((sum, item) => {
    const price = item.product?.salePrice && item.product.salePrice < item.product.price
      ? item.product.salePrice : item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            🛒 Giỏ hàng
            {items.length > 0 && <span className="text-lg text-gray-400 font-normal ml-2">({totalItems} sản phẩm)</span>}
          </h1>
          {items.length > 0 && (
            <button onClick={handleClearCart} className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
              <FiTrash2 size={14} /> Xóa tất cả
            </button>
          )}
        </div>

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
              <FiShoppingBag className="text-primary" size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-400 mb-6">Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}

        {/* Cart content */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const hasDiscount = product.salePrice && product.salePrice < product.price;
                const unitPrice = hasDiscount ? product.salePrice : product.price;
                const primaryImage = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/120';

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex gap-4 transition-all hover:shadow-md ${removingId === item.id ? 'opacity-50 scale-98' : ''}`}
                  >
                    {/* Image */}
                    <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-gray-50"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product.slug}`} className="text-sm sm:text-base font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">{product.brand}</p>

                      {/* Size / Color */}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {item.selectedSize && (
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600">Size: {item.selectedSize}</span>
                        )}
                        {item.selectedColor && (
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600">Màu: {item.selectedColor}</span>
                        )}
                      </div>

                      {/* Price + Quantity + Remove */}
                      <div className="flex items-end justify-between mt-3 gap-2">
                        <div>
                          <span className="text-lg font-bold text-primary">{formatPrice(unitPrice)}</span>
                          {hasDiscount && <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1, product.stock)}
                              disabled={item.quantity <= 1}
                              className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="px-3 py-1.5 text-sm font-semibold text-gray-800 min-w-[36px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1, product.stock)}
                              disabled={item.quantity >= product.stock}
                              className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({totalItems} sản phẩm)</span>
                    <span className="font-medium">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-gray-900 text-base">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="font-bold text-primary text-xl">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]"
                >
                  Tiến hành thanh toán
                </button>

                <Link to="/products" className="flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-500 hover:text-primary transition-colors">
                  <FiArrowLeft size={14} /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
