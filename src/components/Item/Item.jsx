import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { FavoritesContext } from '../../context/FavoritesContext';
import { Star, Plus, Minus } from 'lucide-react';
import './Item.css';

const Item = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const [quantity, setQuantity] = useState(1);

  const isFav = isFavorite(product.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="item-card">
      <div className="item-image-wrapper">
        <img src={product.image} alt={product.title} className="item-image" />
        <button 
          className={`favorite-btn ${isFav ? 'favorited' : ''}`}
          onClick={handleToggleFavorite}
          title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-label="Favorito"
        >
          <Star 
            size={18} 
            fill={isFav ? "#F59E0B" : "transparent"} 
            color={isFav ? "#F59E0B" : "#A8A29E"} 
          />
        </button>
      </div>

      <div className="item-content">
        <div className="item-header-row">
          <h3 className="item-title">{product.title}</h3>
        </div>

        <p className="item-price">${product.price}</p>
        
        <p className="item-stock-text">
          Stock disponible: <span className={product.stock === 0 ? "out-stock" : ""}>{product.stock}</span>
        </p>

        {/* Contador interactivo inline estilo profesor [-] 1 [+] */}
        {product.stock > 0 ? (
          <div className="item-inline-counter">
            <button 
              type="button" 
              className="counter-btn" 
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Restar uno"
            >
              <Minus size={14} />
            </button>
            <span className="counter-value">{quantity}</span>
            <button 
              type="button" 
              className="counter-btn" 
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              aria-label="Sumar uno"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <div className="out-of-stock-label">Sin stock disponible</div>
        )}

        <div className="item-actions">
          <Link to={`/producto/${product.id}`} className="item-button">
            Ver Detalles
          </Link>
          <button 
            className="item-button item-button-add" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
