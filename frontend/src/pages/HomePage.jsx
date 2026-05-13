import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured, fetchNewArrivals, fetchBestSellers, fetchCategories } from '../store/slices/productSlice';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryCard from '../components/CategoryCard';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';

export default function HomePage() {
  const dispatch = useDispatch();
  const { featuredProducts, newArrivals, bestSellers, categories, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchNewArrivals());
    dispatch(fetchBestSellers());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroBanner />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
              📂 Danh mục sản phẩm
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured / Sale */}
      <div className="bg-gradient-to-b from-red-50/50 to-gray-50">
        <ProductSection
          title="Khuyến mãi hot"
          emoji="🔥"
          products={featuredProducts.filter((p) => p.salePrice && p.salePrice < p.price)}
          linkTo="/products?sort=price_asc"
          linkText="Xem tất cả khuyến mãi"
        />
      </div>

      {/* New Arrivals */}
      <ProductSection
        title="Sản phẩm mới nhất"
        emoji="✨"
        products={newArrivals}
        linkTo="/products?sort=newest"
        linkText="Xem tất cả sản phẩm mới"
      />

      {/* Best Sellers */}
      <div className="bg-gradient-to-b from-amber-50/50 to-gray-50">
        <ProductSection
          title="Bán chạy nhất"
          emoji="🏆"
          products={bestSellers}
          linkTo="/products?sort=best_seller"
          linkText="Xem tất cả bán chạy"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-gray-600">Đang tải...</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
