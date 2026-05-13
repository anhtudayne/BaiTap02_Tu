import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

export default function ProductSection({ title, emoji, products, linkTo, linkText = 'Xem tất cả' }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {emoji && <span className="mr-2">{emoji}</span>}
            {title}
          </h2>
          {linkTo && (
            <Link
              to={linkTo}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              {linkText} <FiArrowRight />
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile "View All" */}
        {linkTo && (
          <div className="mt-6 text-center sm:hidden">
            <Link
              to={linkTo}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {linkText} <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
