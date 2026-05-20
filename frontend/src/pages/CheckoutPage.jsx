import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrder, resetCreateSuccess } from '../store/slices/orderSlice';
import { FiTruck, FiCreditCard, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, createSuccess, createdOrder } = useSelector((state) => state.order);

  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingProvince: '',
    shippingDistrict: '',
    shippingWard: '',
    shippingAddressDetail: '',
    paymentMethod: 'COD',
    note: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        shippingName: `${user.lastName || ''} ${user.firstName || ''}`.trim(),
        shippingPhone: user.phoneNumber || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (createSuccess && createdOrder) {
      navigate(`/order-success/${createdOrder.orderCode}`);
      dispatch(resetCreateSuccess());
    }
  }, [createSuccess, createdOrder, navigate, dispatch]);

  // Redirect if cart empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      // Cho phép 1 tick để check
      const timer = setTimeout(() => {
        if (items.length === 0) navigate('/cart');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [items, loading, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.shippingName.trim()) errs.shippingName = 'Vui lòng nhập tên người nhận';
    if (!form.shippingPhone.trim()) errs.shippingPhone = 'Vui lòng nhập số điện thoại';
    else if (!/^\d{10}$/.test(form.shippingPhone)) errs.shippingPhone = 'Số điện thoại phải gồm 10 chữ số';
    if (!form.shippingProvince.trim()) errs.shippingProvince = 'Vui lòng nhập Tỉnh/Thành phố';
    if (!form.shippingDistrict.trim()) errs.shippingDistrict = 'Vui lòng nhập Quận/Huyện';
    if (!form.shippingWard.trim()) errs.shippingWard = 'Vui lòng nhập Phường/Xã';
    if (!form.shippingAddressDetail.trim()) errs.shippingAddressDetail = 'Vui lòng nhập địa chỉ chi tiết';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderItems = items.map((item) => {
      const product = item.product;
      const hasDiscount = product?.salePrice && product.salePrice < product.price;
      const primaryImage = product?.images?.[0]?.imageUrl || '';
      return {
        productId: product.id,
        productName: product.name,
        productImage: primaryImage,
        price: hasDiscount ? product.salePrice : product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      };
    });

    dispatch(createOrder({ ...form, items: orderItems }));
  };

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => {
    const product = item.product;
    const price = product?.salePrice && product.salePrice < product.price ? product.salePrice : product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
      formErrors[field]
        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200'
        : 'border-gray-200 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary/20'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">📦 Thanh toán</h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left: Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                  <FiTruck className="text-primary" /> Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên người nhận *</label>
                    <input type="text" name="shippingName" value={form.shippingName} onChange={handleChange} className={inputClass('shippingName')} placeholder="Nhập họ tên" />
                    {formErrors.shippingName && <p className="text-xs text-red-500 mt-1">{formErrors.shippingName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại *</label>
                    <input type="tel" name="shippingPhone" value={form.shippingPhone} onChange={handleChange} className={inputClass('shippingPhone')} placeholder="0xxxxxxxxx" maxLength={10} />
                    {formErrors.shippingPhone && <p className="text-xs text-red-500 mt-1">{formErrors.shippingPhone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tỉnh/Thành phố *</label>
                    <input type="text" name="shippingProvince" value={form.shippingProvince} onChange={handleChange} className={inputClass('shippingProvince')} placeholder="VD: TP. Hồ Chí Minh" />
                    {formErrors.shippingProvince && <p className="text-xs text-red-500 mt-1">{formErrors.shippingProvince}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quận/Huyện *</label>
                    <input type="text" name="shippingDistrict" value={form.shippingDistrict} onChange={handleChange} className={inputClass('shippingDistrict')} placeholder="VD: Quận 1" />
                    {formErrors.shippingDistrict && <p className="text-xs text-red-500 mt-1">{formErrors.shippingDistrict}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phường/Xã *</label>
                    <input type="text" name="shippingWard" value={form.shippingWard} onChange={handleChange} className={inputClass('shippingWard')} placeholder="VD: Phường Bến Nghé" />
                    {formErrors.shippingWard && <p className="text-xs text-red-500 mt-1">{formErrors.shippingWard}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ chi tiết *</label>
                    <input type="text" name="shippingAddressDetail" value={form.shippingAddressDetail} onChange={handleChange} className={inputClass('shippingAddressDetail')} placeholder="Số nhà, tên đường..." />
                    {formErrors.shippingAddressDetail && <p className="text-xs text-red-500 mt-1">{formErrors.shippingAddressDetail}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú (tùy chọn)</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Ghi chú cho đơn hàng (giờ nhận hàng, hướng dẫn giao hàng...)"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                  <FiCreditCard className="text-primary" /> Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value="COD" checked={form.paymentMethod === 'COD'} onChange={handleChange} className="accent-primary w-4 h-4" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">💵 Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-xs text-gray-400 mt-0.5">Thanh toán bằng tiền mặt khi nhận được hàng</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 cursor-not-allowed opacity-50">
                    <input type="radio" name="paymentMethod" value="MOMO" disabled className="accent-primary w-4 h-4" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-500">💳 Ví MoMo</p>
                      <p className="text-xs text-gray-400 mt-0.5">Sắp ra mắt</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng của bạn</h2>

                {/* Items list */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    const hasDiscount = product.salePrice && product.salePrice < product.price;
                    const unitPrice = hasDiscount ? product.salePrice : product.price;
                    const primaryImage = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/60';

                    return (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img src={primaryImage} alt={product.name} className="w-14 h-14 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                          <div className="flex gap-1.5 text-xs text-gray-400 mt-0.5">
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedColor && <span>• {item.selectedColor}</span>}
                            <span>• x{item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">{formatPrice(unitPrice * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <hr className="my-4 border-gray-100" />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-gray-900 text-base pt-1">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="font-bold text-primary text-xl">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full mt-5 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Đang xử lý...
                    </>
                  ) : (
                    <>Đặt hàng <FiChevronRight size={18} /></>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Bằng việc đặt hàng, bạn đồng ý với điều khoản dịch vụ của TuShoes
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
