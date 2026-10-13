import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Tu Carrito</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} />
            <div className="item-details">
              <h3>{item.title}</h3>
              <p>Precio unitario: ${formatPrice(item.price)}</p>
              <p>Cantidad: {item.quantity}</p>
              <p className="item-subtotal">Subtotal: ${formatPrice(item.price * item.quantity)}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="btn-remove">
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total a pagar: ${formatPrice(totalPrice())}</h3>
        <div className="cart-actions">
          <button onClick={clearCart} className="btn btn-danger">Vaciar Carrito</button>
          <Link to="/checkout" className="btn btn-success" style={{ textDecoration: 'none' }}>Proceder al pago</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
