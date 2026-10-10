import { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './CartWidget.css';

const CartWidget = () => {
  const { totalQuantity } = useContext(CartContext);
  const qty = totalQuantity();

  return (
    <Link to="/carrito" className="cart-widget">
      <ShoppingCart />
      {qty > 0 && <span className="cart-indicator">{qty}</span>}
    </Link>
  );
};

export default CartWidget;
