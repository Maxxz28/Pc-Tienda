import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import ItemCount from '../ItemCount/ItemCount';
import './ItemDetailContainer.css';

const ItemDetailContainer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/productos.json');
        if (!response.ok) throw new Error('Error al cargar los productos');
        
        const data = await response.json();
        
        const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
        const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts')) || [];
        const modifiedStock = JSON.parse(localStorage.getItem('modifiedStock')) || {};
        const modifiedPrice = JSON.parse(localStorage.getItem('modifiedPrice')) || {};

        let allProducts = [...data, ...customProducts]
          .filter(p => !deletedProducts.includes(p.id))
          .map(p => ({
            ...p,
            stock: modifiedStock[p.id] !== undefined ? modifiedStock[p.id] : p.stock,
            price: modifiedPrice[p.id] !== undefined ? modifiedPrice[p.id] : p.price
          }));
        
        const foundProduct = allProducts.find(p => p.id === parseInt(id) || p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (quantity) => {
    addToCart(product, quantity);
    setAdded(true);
  };

  if (loading) return <div className="loader">Cargando detalle...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <div className="item-detail-container">
      <div className="item-detail-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="item-detail-info">
        <h2>{product.title}</h2>
        <p className="category">Categoría: {product.category}</p>
        <p className="price">${product.price}</p>
        <p className="description">{product.description}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Stock disponible: {product.stock}
        </p>
        
        {added ? (
          <Link to="/carrito" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>Terminar mi compra</Link>
        ) : (
          <ItemCount stock={product.stock} initial={1} onAdd={handleAddToCart} />
        )}
      </div>
    </div>
  );
};

export default ItemDetailContainer;
