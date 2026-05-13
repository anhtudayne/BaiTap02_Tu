import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import { FiFilter, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import SortBar from '../components/SortBar';

export default function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, pagination, loading } = useSelector((state) => state.product);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Memoize filters to avoid infinite re-render loop
  const paramsString = searchParams.toString();
  const filters = useMemo(() => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sizes: searchParams.get('sizes') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 12,
  }), [paramsString]);

  // Fetch products when filters change
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== 0) params[k] = v;
    });
    dispatch(fetchProducts(params));
  }, [dispatch, filters]);

  // Fetch categories once
  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  // Update URL params
  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== '' && v !== 0 && k !== 'limit') params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleSortChange = (sort) => {
    handleFilterChange({ ...filters, sort, page: 1 });
  };

  const handlePageChange = (page) => {
    handleFilterChange({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ label: 'Sản phẩm' }]} />

        <div className="mt-6 flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-all"
            >
              <FiFilter size={16} /> Bộ lọc
            </button>

            <SortBar
              sort={filters.sort}
              total={pagination?.total}
              onSortChange={handleSortChange}
            />

            {/* Product Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-gray-50 shadow-2xl overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h3 className="font-bold text-gray-800">Bộ lọc</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                categories={categories}
                onFilterChange={(newFilters) => {
                  handleFilterChange(newFilters);
                  setShowMobileFilter(false);
                }}
                onClear={() => {
                  handleClearFilters();
                  setShowMobileFilter(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
