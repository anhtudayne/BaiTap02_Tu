import { FiMinus, FiPlus } from 'react-icons/fi';

export default function QuantitySelector({ value, onChange, max = 99, disabled = false }) {
  const decrease = () => {
    if (value > 1) onChange(value - 1);
  };
  const increase = () => {
    if (value < max) onChange(value + 1);
  };
  const handleInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= max) onChange(val);
    else if (e.target.value === '') onChange(1);
  };

  return (
    <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={decrease}
        disabled={disabled || value <= 1}
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiMinus size={16} />
      </button>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        disabled={disabled}
        className="w-14 h-10 text-center text-sm font-semibold border-x border-gray-200 outline-none disabled:bg-gray-50"
      />
      <button
        onClick={increase}
        disabled={disabled || value >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiPlus size={16} />
      </button>
    </div>
  );
}
