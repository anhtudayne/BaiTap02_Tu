import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

export default function CartIcon() {
  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="relative text-gray-600 hover:text-primary transition-colors"
      title="Giỏ hàng"
    >
      <FiShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-1 animate-fade-in">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
