import { FiCheck } from 'react-icons/fi';

const STEPS = [
  { status: 1, label: 'Đơn mới' },
  { status: 2, label: 'Đã xác nhận' },
  { status: 3, label: 'Đang chuẩn bị' },
  { status: 4, label: 'Đang giao' },
  { status: 5, label: 'Đã giao' },
];

export default function OrderTimeline({ currentStatus }) {
  // If cancelled, show special timeline
  if (currentStatus === 6) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 border border-red-200">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-bold text-red-600">Đơn hàng đã bị hủy</p>
            <p className="text-xs text-red-400">Đơn hàng này đã được hủy bỏ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {/* Active line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary z-0 transition-all duration-700"
          style={{ width: `${((Math.min(currentStatus, 5) - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isActive = currentStatus >= step.status;
          const isCurrent = currentStatus === step.status;
          return (
            <div key={step.status} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-md shadow-primary/30'
                    : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
              >
                {isActive && currentStatus > step.status ? (
                  <FiCheck size={18} strokeWidth={3} />
                ) : (
                  <span className="text-xs font-bold">{step.status}</span>
                )}
              </div>
              <span
                className={`mt-2 text-[11px] font-medium text-center max-w-[72px] leading-tight ${
                  isActive ? 'text-primary' : 'text-gray-400'
                } ${isCurrent ? 'font-bold' : ''}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
