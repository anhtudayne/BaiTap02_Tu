import { Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function ProductCard({ product }) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={primaryImage?.imageUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-bold">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold">
                Mới
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold">
                🔥 Hot
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold">
              Còn {product.stock}
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-gray-800 text-white text-xs font-bold">
              Hết hàng
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium mb-1">{product.brand}</p>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(hasDiscount ? product.salePrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.soldCount > 0 && (
            <p className="text-xs text-gray-400 mt-1.5">Đã bán {product.soldCount}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
