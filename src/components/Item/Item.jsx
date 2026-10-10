import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './Item.css';

const Item = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="item-card">
      <img src={product.image} alt={product.title} className="item-image" />
      <div className="item-content">
        <h3 className="item-title">{product.title}</h3>
        <p className="item-price">${product.price}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Stock disponible: {product.stock}
        </p>
        <div className="item-actions">
          <Link to={`/producto/${product.id}`} className="item-button">
            Ver Detalles
          </Link>
          <button 
            className="item-button item-button-add" 
            onClick={() => addToCart(product, 1)}
          >
            Al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
