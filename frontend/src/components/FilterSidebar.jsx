import { useState } from 'react';
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
      >
        {title}
        {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, categories, onFilterChange, onClear }) {
  const brands = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Asics', 'Hoka', 'Dr. Martens', 'Timberland', 'Birkenstock', 'Crocs', 'Reebok'];
  const sizeOptions = [36, 37, 38, 39, 40, 41, 42, 43, 44];

  const handleCategory = (slug) => {
    onFilterChange({ ...filters, category: filters.category === slug ? '' : slug, page: 1 });
  };

  const handleBrand = (brand) => {
    const current = filters.brand ? filters.brand.split(',') : [];
    const updated = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
    onFilterChange({ ...filters, brand: updated.join(','), page: 1 });
  };

  const handleSize = (size) => {
    const current = filters.sizes ? filters.sizes.split(',').map(Number) : [];
    const updated = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
    onFilterChange({ ...filters, sizes: updated.join(','), page: 1 });
  };

  const handlePrice = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const handleSearch = (value) => {
    onFilterChange({ ...filters, search: value, page: 1 });
  };

  const activeBrands = filters.brand ? filters.brand.split(',') : [];
  const activeSizes = filters.sizes ? filters.sizes.split(',').map(Number) : [];

  const hasFilters = filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.sizes;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800">🔍 Bộ lọc</h3>
        {hasFilters && (
          <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
            <FiX size={12} /> Xóa lọc
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm tên sản phẩm..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:border-primary transition-all"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
      </div>

      {/* Category */}
      <FilterGroup title="Danh mục">
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.slug)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                ${filters.category === cat.slug
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Brand */}
      <FilterGroup title="Thương hiệu">
        <div className="space-y-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={activeBrands.includes(brand)}
                onChange={() => handleBrand(brand)}
                className="rounded border-gray-300 text-primary focus:ring-primary/30"
              />
              {brand}
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup title="Khoảng giá (VNĐ)">
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handlePrice('minPrice', e.target.value)}
            placeholder="Từ"
            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePrice('maxPrice', e.target.value)}
            placeholder="Đến"
            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>
        {/* Quick price buttons */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { label: 'Dưới 2tr', min: '', max: 2000000 },
            { label: '2-4tr', min: 2000000, max: 4000000 },
            { label: 'Trên 4tr', min: 4000000, max: '' },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => onFilterChange({ ...filters, minPrice: range.min, maxPrice: range.max, page: 1 })}
              className="px-2.5 py-1 rounded-lg text-xs border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-all"
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Size */}
      <FilterGroup title="Kích cỡ" defaultOpen={false}>
        <div className="grid grid-cols-4 gap-1.5">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => handleSize(size)}
              className={`py-2 rounded-lg text-xs font-medium border transition-all
                ${activeSizes.includes(size)
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 text-gray-500 hover:border-primary/50'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}
