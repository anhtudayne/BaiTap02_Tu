import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetail, cancelOrder, requestCancelOrder, clearOrderMessage, clearOrderError, clearOrderDetail } from '../store/slices/orderSlice';
import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetail: order, loading, message, error } = useSelector((state) => state.order);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelType, setCancelType] = useState('direct'); // 'direct' or 'request'

  useEffect(() => {
    dispatch(fetchOrderDetail(id));
    return () => dispatch(clearOrderDetail());
  }, [dispatch, id]);

  // Reload after cancel action
  useEffect(() => {
    if (message) {
      dispatch(fetchOrderDetail(id));
      setShowCancelModal(false);
      setCancelReason('');
      const timer = setTimeout(() => dispatch(clearOrderMessage()), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch, id]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearOrderError()), 4000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCancelClick = () => {
    if (order.status === 1) {
      setCancelType('direct');
    } else {
      setCancelType('request');
    }
    setShowCancelModal(true);
  };

  const handleSubmitCancel = () => {
    if (!cancelReason.trim()) return;
    if (cancelType === 'direct') {
      dispatch(cancelOrder({ id: order.id, reason: cancelReason }));
    } else {
      dispatch(requestCancelOrder({ id: order.id, reason: cancelReason }));
    }
  };

  // Determine if cancel is possible
  const canCancelDirect = order?.status === 1;
  const canRequestCancel = (order?.status === 2 || order?.status === 3) && !order?.hasCancelRequest;
  const canCancel = canCancelDirect || canRequestCancel;

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center py-24">
          <p className="text-gray-500 text-lg mb-4">Không tìm thấy đơn hàng</p>
          <Link to="/orders" className="text-primary hover:underline">← Quay lại danh sách</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/orders" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Đơn hàng #{order.orderCode}</h1>
            <p className="text-sm text-gray-400">Đặt ngày {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm animate-fade-in">
            ✅ {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
            ❌ {error}
          </div>
        )}

        <div className="space-y-6 animate-fade-in">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Trạng thái đơn hàng</h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <OrderTimeline currentStatus={order.status} />
            {order.confirmedAt && order.status >= 2 && order.status !== 6 && (
              <p className="text-xs text-gray-400 text-center mt-2">Xác nhận lúc: {formatDate(order.confirmedAt)}</p>
            )}
            {order.hasCancelRequest && (
              <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm">
                <p className="font-semibold text-orange-700">⏳ Đang chờ admin duyệt yêu cầu hủy</p>
                <p className="text-orange-500 text-xs mt-1">Lý do: {order.cancelRequestReason}</p>
              </div>
            )}
            {order.status === 6 && order.cancelReason && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-sm">
                <p className="font-semibold text-red-600">Lý do hủy:</p>
                <p className="text-red-500 text-xs mt-1">{order.cancelReason}</p>
              </div>
            )}
          </div>

          {/* Shipping info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-3">📍 Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Người nhận:</span>
                <p className="font-semibold text-gray-800">{order.shippingName}</p>
              </div>
              <div>
                <span className="text-gray-400">Số điện thoại:</span>
                <p className="font-semibold text-gray-800">{order.shippingPhone}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400">Địa chỉ:</span>
                <p className="font-semibold text-gray-800">
                  {order.shippingAddressDetail}, {order.shippingWard}, {order.shippingDistrict}, {order.shippingProvince}
                </p>
              </div>
              {order.note && (
                <div className="sm:col-span-2">
                  <span className="text-gray-400">Ghi chú:</span>
                  <p className="text-gray-700">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">🛍️ Sản phẩm ({order.items?.length || 0})</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 items-center py-3 border-b border-gray-50 last:border-0">
                  <img
                    src={item.productImage || 'https://via.placeholder.com/64'}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-xl bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.productName}</p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-400">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Màu: {item.selectedColor}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">{formatPrice(item.price)}</span>
                      <span className="text-xs text-gray-400">x{item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Tạm tính</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium">{order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Miễn phí'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phương thức thanh toán</span>
                <span className="font-medium">{order.paymentMethod === 'COD' ? '💵 COD' : '💳 MoMo'}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-gray-900 text-base">
                <span className="font-bold">Tổng cộng</span>
                <span className="font-bold text-primary text-xl">{formatPrice(order.totalAmount + order.shippingFee)}</span>
              </div>
            </div>
          </div>

          {/* Cancel actions */}
          {canCancel && (
            <div className="flex justify-end">
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 hover:border-red-300 transition-all"
              >
                <FiXCircle size={18} />
                {canCancelDirect ? 'Hủy đơn hàng' : 'Gửi yêu cầu hủy'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {cancelType === 'direct' ? '❌ Hủy đơn hàng' : '📩 Gửi yêu cầu hủy'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {cancelType === 'direct'
                ? 'Đơn hàng sẽ bị hủy ngay lập tức và không thể hoàn tác.'
                : 'Yêu cầu hủy sẽ được gửi đến quản trị viên để duyệt.'}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lý do hủy *</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              placeholder="Nhập lý do hủy đơn hàng..."
              autoFocus
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmitCancel}
                disabled={!cancelReason.trim() || loading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
