import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../store/slices/orderSlice';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: '1', label: 'Đơn mới' },
  { value: '2', label: 'Đã xác nhận' },
  { value: '3', label: 'Đang chuẩn bị' },
  { value: '4', label: 'Đang giao' },
  { value: '5', label: 'Đã giao' },
  { value: '6', label: 'Đã hủy' },
];

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading, pagination } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 8 };
    if (activeTab) params.status = activeTab;
    dispatch(fetchMyOrders(params));
  }, [dispatch, activeTab, page]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiPackage className="text-primary" /> Đơn hàng của tôi
        </h1>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center py-20 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5">
              <FiShoppingBag className="text-primary" size={40} />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-400 mb-5">Hãy mua sắm và quay lại đây nhé!</p>
            <Link to="/products" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all">
              Mua sắm ngay
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800">#{order.orderCode}</span>
                    <OrderStatusBadge status={order.status} />
                    {order.hasCancelRequest && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-semibold">
                        ⏳ Đang chờ duyệt hủy
                      </span>
                    )}
                  </div>
                  <FiChevronRight className="text-gray-300 group-hover:text-primary transition-colors" size={20} />
                </div>

                {/* Items preview */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {order.items?.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex-shrink-0">
                      <img
                        src={item.productImage || 'https://via.placeholder.com/56'}
                        alt={item.productName}
                        className="w-14 h-14 object-cover rounded-lg bg-gray-50 border border-gray-100"
                      />
                    </div>
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-semibold flex-shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Tổng: </span>
                    <span className="text-base font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === p
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
