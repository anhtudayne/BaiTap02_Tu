const STATUS_MAP = {
  1: { label: 'Đơn mới', color: 'bg-amber-100 text-amber-700', icon: '🆕' },
  2: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: '✅' },
  3: { label: 'Đang chuẩn bị', color: 'bg-purple-100 text-purple-700', icon: '📦' },
  4: { label: 'Đang giao hàng', color: 'bg-cyan-100 text-cyan-700', icon: '🚚' },
  5: { label: 'Đã giao thành công', color: 'bg-green-100 text-green-700', icon: '🎉' },
  6: { label: 'Đã hủy', color: 'bg-red-100 text-red-600', icon: '❌' },
};

export default function OrderStatusBadge({ status }) {
  const info = STATUS_MAP[status] || STATUS_MAP[1];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${info.color}`}>
      <span>{info.icon}</span>
      {info.label}
    </span>
  );
}

export { STATUS_MAP };
