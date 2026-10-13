import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { ArrowLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ItemCount from '../ItemCount/ItemCount';
import Item from '../Item/Item';
import { applyProductOverrides } from '../../utils/getProducts';
import './ItemDetailContainer.css';

const ItemDetailContainer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setAdded(false);
      try {
        const response = await fetch('/productos.json');
        if (!response.ok) throw new Error('Error al cargar los productos');
        
        const data = await response.json();
        const allProducts = applyProductOverrides(data);
        
        const foundProduct = allProducts.find(p => String(p.id) === String(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Filtrar otros productos de la misma categoría para recomendaciones
          const related = allProducts
            .filter(p => p.category === foundProduct.category && String(p.id) !== String(foundProduct.id))
            .slice(0, 4);
          setRelatedProducts(related);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = (quantity) => {
    addToCart(product, quantity);
    setAdded(true);
  };

  if (loading) return <div className="loader" style={{ textAlign: 'center', padding: '4rem' }}>Cargando detalle...</div>;
  if (error) return (
    <div className="error" style={{ textAlign: 'center', padding: '4rem' }}>
      <p>{error}</p>
      <Link to="/productos" className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al catálogo</Link>
    </div>
  );
  if (!product) return null;

  return (
    <div className="detail-wrapper">
      {/* Breadcrumb / Navegación rápida */}
      <div className="detail-breadcrumb">
        <Link to="/productos" className="breadcrumb-link">
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Catálogo
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <Link to={`/categoria/${product.category}`} className="breadcrumb-link">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <ChevronRight size={14} className="breadcrumb-sep" />
        <span className="breadcrumb-current">{product.title}</span>
      </div>

      {/* Tarjeta de Detalle del Producto */}
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
            <div className="detail-after-add-actions">
              <Link to="/carrito" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ShoppingBag size={18} /> Ir al Carrito
              </Link>
              <Link to="/productos" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                Seguir Comprando
              </Link>
            </div>
          ) : (
            <ItemCount stock={product.stock} initial={1} onAdd={handleAddToCart} />
          )}
        </div>
      </div>

      {/* Sección de Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <div className="related-header">
            <h3>Productos Relacionados</h3>
            <Link to={`/categoria/${product.category}`} className="view-more-related">
              Ver más en {product.category} →
            </Link>
          </div>
          <div className="related-grid">
            {relatedProducts.map(rel => (
              <Item key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ItemDetailContainer;
