import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">👟 TuShoes</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Cửa hàng giày trực tuyến hàng đầu với các thương hiệu nổi tiếng: Nike, Adidas, Puma, Converse và nhiều hơn nữa.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FiInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Sản phẩm</Link></li>
              <li><Link to="/products?sort=best_seller" className="hover:text-white transition-colors">Bán chạy</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-white transition-colors">Hàng mới</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Liên hệ</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><FiMapPin size={14} /> TP. Hồ Chí Minh, Việt Nam</li>
              <li className="flex items-center gap-2"><FiPhone size={14} /> 0901 234 567</li>
              <li className="flex items-center gap-2"><FiMail size={14} /> contact@tushoes.vn</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-500">
            © 2024 TuShoes — Võ Văn Tú (23110359). Bài tập cá nhân.
          </p>
        </div>
      </div>
    </footer>
  );
}
