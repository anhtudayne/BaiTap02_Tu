

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'best_seller', label: 'Bán chạy nhất' },
];

export default function SortBar({ sort, total, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      <p className="text-sm text-gray-500">
        Tìm thấy <span className="font-semibold text-gray-700">{total || 0}</span> sản phẩm
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Sắp xếp:</span>
        <div className="flex flex-wrap gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${sort === opt.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
