import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, fetchRelatedProducts, clearProductDetail } from '../store/slices/productSlice';
import { addToCart, fetchCart, clearCartMessage, clearCartError } from '../store/slices/cartSlice';
import { FiShoppingCart, FiTruck, FiShield, FiRefreshCw, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ImageGallery from '../components/ImageGallery';
import QuantitySelector from '../components/QuantitySelector';
import ProductSection from '../components/ProductSection';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { productDetail: product, relatedProducts, loading, error } = useSelector((state) => state.product);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    dispatch(fetchProductDetail(slug));
    return () => dispatch(clearProductDetail());
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchRelatedProducts(product.id));
    }
  }, [dispatch, product?.id]);

  // Reset selections on product change
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    setAddedToCart(false);
    setCartError(null);
  }, [slug]);

  const handleAddToCart = async () => {
    const sizes = product?.sizes || [];
    const colors = product?.colors || [];
    if (sizes.length > 0 && !selectedSize) {
      setCartError('Vui lòng chọn kích cỡ');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      setCartError('Vui lòng chọn màu sắc');
      return;
    }
    setCartError(null);
    const result = await dispatch(addToCart({
      productId: product.id,
      quantity,
      selectedSize,
      selectedColor,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      setAddedToCart(true);
      dispatch(fetchCart());
      setTimeout(() => setAddedToCart(false), 2500);
    } else {
      setCartError(result.payload?.message || 'Lỗi thêm vào giỏ hàng');
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-gray-500">Đang tải sản phẩm...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="text-6xl mb-4">😕</span>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-400">{error || 'Sản phẩm không tồn tại hoặc đã bị xóa.'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const isOutOfStock = product.stock === 0;
  const sizes = product.sizes || [];
  const colors = product.colors || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: product.category?.name || 'Danh mục', to: `/products?category=${product.category?.slug}` },
            { label: product.name },
          ]}
        />

        {/* Product detail grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
          {/* Images */}
          <ImageGallery images={product.images} />

          {/* Info */}
          <div className="space-y-5">
            {/* Brand + Category badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {product.category?.name}
              </span>
              {product.brand && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                  {product.brand}
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">✨ Mới</span>
              )}
              {product.isBestSeller && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-semibold">🔥 Bán chạy</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Sold count */}
            <p className="text-sm text-gray-400">Đã bán {product.soldCount || 0} sản phẩm</p>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold text-primary">
                {formatPrice(hasDiscount ? product.salePrice : product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-sm font-bold">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold">
                  ❌ Hết hàng
                </span>
              ) : product.stock <= 10 ? (
                <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-sm font-semibold">
                  ⚠️ Chỉ còn {product.stock} sản phẩm
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-sm font-semibold">
                  ✅ Còn hàng ({product.stock})
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Size selector */}
            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Kích cỡ: {selectedSize && <span className="text-primary ml-1">({selectedSize})</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all
                        ${selectedSize === size
                          ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                          : 'border-gray-200 text-gray-600 hover:border-primary/50'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Màu sắc: {selectedColor && <span className="text-primary ml-1">({selectedColor})</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                        ${selectedColor === color
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-600 hover:border-primary/50'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Số lượng:</p>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stock}
                disabled={isOutOfStock}
              />
            </div>

            {/* Cart error */}
            {cartError && (
              <p className="text-sm text-red-500 font-medium animate-shake">{cartError}</p>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addedToCart}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all active:scale-[0.98] disabled:cursor-not-allowed ${
                addedToCart
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:hover:shadow-none'
              }`}
            >
              {addedToCart ? <><FiCheck size={20} /> Đã thêm vào giỏ hàng</> : <><FiShoppingCart size={20} /> {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}</>}
            </button>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center gap-1 text-center">
                <FiTruck className="text-primary" size={20} />
                <span className="text-xs text-gray-500">Giao hàng miễn phí</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <FiShield className="text-primary" size={20} />
                <span className="text-xs text-gray-500">Hàng chính hãng</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <FiRefreshCw className="text-primary" size={20} />
                <span className="text-xs text-gray-500">Đổi trả 30 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Mô tả sản phẩm</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductSection
            title="Sản phẩm tương tự"
            emoji="👟"
            products={relatedProducts}
            linkTo={`/products?category=${product.category?.slug}`}
            linkText="Xem thêm"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
