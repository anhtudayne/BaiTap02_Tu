import { useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryProducts, clearCategoryProducts } from '../store/slices/productSlice';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { categoryProducts, categoryInfo, categoryPagination, categoryLoading } = useSelector((state) => state.product);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Reset & load trang 1 khi đổi danh mục
  useEffect(() => {
    dispatch(clearCategoryProducts());
    dispatch(fetchCategoryProducts({ slug, page: 1, limit: 8 }));
  }, [dispatch, slug]);

  // Infinite Scroll — IntersectionObserver
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !categoryLoading &&
        categoryPagination &&
        categoryPagination.page < categoryPagination.totalPages
      ) {
        dispatch(fetchCategoryProducts({ slug, page: categoryPagination.page + 1, limit: 8 }));
      }
    },
    [dispatch, slug, categoryLoading, categoryPagination]
  );

  useEffect(() => {
    const node = loadMoreRef.current;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (node) observerRef.current.observe(node);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  const hasMore = categoryPagination && categoryPagination.page < categoryPagination.totalPages;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{categoryInfo?.name || 'Danh mục'}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {categoryInfo?.name || 'Đang tải...'}
            </h1>
            {categoryPagination && (
              <p className="text-sm text-gray-500 mt-1">
                Hiển thị {categoryProducts.length} / {categoryPagination.total} sản phẩm
              </p>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          !categoryLoading && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📦</p>
              <p className="text-gray-500 text-lg">Không có sản phẩm nào trong danh mục này</p>
              <Link to="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
                ← Quay lại trang chủ
              </Link>
            </div>
          )
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {categoryLoading && (
            <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-sm">
              <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-600">Đang tải thêm sản phẩm...</span>
            </div>
          )}
          {!hasMore && categoryProducts.length > 0 && !categoryLoading && (
            <p className="text-sm text-gray-400 bg-gray-100 rounded-full px-6 py-2">
              ✅ Đã hiển thị hết {categoryPagination?.total} sản phẩm
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
