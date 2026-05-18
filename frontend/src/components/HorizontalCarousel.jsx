import { useState, useRef, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function HorizontalCarousel({ title, emoji, products = [], itemsPerPage = 5 }) {
  // Tạo key dựa trên products để reset page khi products thay đổi
  const productsKey = useMemo(() => products.map(p => p.id).join(','), [products]);
  const [pageState, setPageState] = useState({ key: productsKey, page: 0 });
  const currentPage = pageState.key === productsKey ? pageState.page : 0;
  const setCurrentPage = (p) => setPageState({ key: productsKey, page: p });

  const scrollRef = useRef(null);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const scrollToPage = (page) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.scrollWidth / products.length;
    container.scrollTo({ left: cardWidth * page * itemsPerPage, behavior: 'smooth' });
    setCurrentPage(page);
  };

  const goNext = () => { if (currentPage < totalPages - 1) scrollToPage(currentPage + 1); };
  const goPrev = () => { if (currentPage > 0) scrollToPage(currentPage - 1); };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {emoji && <span className="mr-2">{emoji}</span>}{title}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 font-medium">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={goPrev}
              disabled={currentPage === 0}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={goNext}
              disabled={currentPage >= totalPages - 1}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `calc((100% - ${(itemsPerPage - 1) * 16}px) / ${itemsPerPage})`, scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentPage ? 'bg-primary w-7' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
