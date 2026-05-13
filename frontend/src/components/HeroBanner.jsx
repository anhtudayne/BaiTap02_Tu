import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-dark to-secondary text-white">
      {/* Decorative blurs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-80 h-80 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center md:text-left animate-slide-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-4 backdrop-blur-sm">
              🔥 Giảm đến 40% — Ưu đãi có hạn
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Bước đi theo <br />
              <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                phong cách của bạn
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg">
              Khám phá bộ sưu tập giày mới nhất từ Nike, Adidas, Puma và nhiều thương hiệu hàng đầu tại TuShoes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/20 active:scale-[0.98]"
              >
                Khám phá ngay <FiArrowRight />
              </Link>
              <Link
                to="/products?sort=best_seller"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Bán chạy nhất
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
              alt="TuShoes Hero"
              className="w-full max-w-md mx-auto drop-shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
