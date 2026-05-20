import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderSuccessPage() {
  const { orderCode } = useParams();
  const navigate = useNavigate();

  // Redirect if accessed directly without an order code
  useEffect(() => {
    if (!orderCode) navigate('/');
  }, [orderCode, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 text-center animate-fade-in">
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <FiCheckCircle className="text-white" size={40} />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Cảm ơn bạn đã mua sắm tại TuShoes
          </p>

          {/* Order code */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 mb-8 border border-primary/10">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng của bạn</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-wider">
              {orderCode}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-3 text-sm text-gray-500 mb-8">
            <p>📧 Thông tin đơn hàng đã được lưu vào tài khoản của bạn</p>
            <p>⏱️ Đơn hàng sẽ được tự động xác nhận sau 30 phút</p>
            <p>💵 Thanh toán khi nhận hàng (COD)</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              <FiPackage size={18} /> Xem đơn hàng
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-primary hover:text-primary transition-all"
            >
              <FiHome size={18} /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
