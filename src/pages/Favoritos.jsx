import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, ArrowLeft } from 'lucide-react';
import { FavoritesContext } from '../context/FavoritesContext';
import { applyProductOverrides } from '../utils/getProducts';
import Item from '../components/Item/Item';
import Swal from 'sweetalert2';
import './Favoritos.css';

const Favoritos = () => {
  const { favorites, clearFavorites } = useContext(FavoritesContext);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/productos.json');
        const data = await response.json();
        const allProducts = applyProductOverrides(data);
        
        // Filtrar los que están en la lista de favoritos
        const filtered = allProducts.filter(p => favorites.includes(p.id));
        setFavoriteProducts(filtered);
      } catch {
        setFavoriteProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleClearAll = () => {
    Swal.fire({
      title: '¿Vaciar favoritos?',
      text: 'Se eliminarán todos los productos de tu lista.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--btn-danger)',
      cancelButtonColor: 'var(--btn-primary)',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      background: 'var(--card-bg)',
      color: 'var(--text-color)'
    }).then((res) => {
      if (res.isConfirmed) {
        clearFavorites();
        Swal.fire({
          title: 'Lista vaciada',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--card-bg)',
          color: 'var(--text-color)'
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="favoritos-container">
        <div className="loader" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Cargando favoritos...
        </div>
      </div>
    );
  }

  return (
    <div className="favoritos-container">
      <div className="favoritos-header">
        <div className="favoritos-title-group">
          <h2>
            <Star size={28} className="favoritos-header-icon" />
            Mis Favoritos
          </h2>
          <p className="favoritos-subtitle">
            {favoriteProducts.length > 0 
              ? `${favoriteProducts.length} ${favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}` 
              : 'Tus productos guardados para comprar más tarde'}
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <button onClick={handleClearAll} className="btn-clear-favorites" title="Vaciar lista">
            <Trash2 size={16} />
            <span>Vaciar lista</span>
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="favoritos-empty">
          <div className="empty-icon-wrap">
            <Star size={64} />
          </div>
          <h3>Aún no tienes productos favoritos</h3>
          <p>
            Guarda los componentes o periféricos que más te gusten haciendo clic en la 
            estrellita de cada tarjeta.
          </p>
          <Link to="/productos" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="favoritos-grid">
          {favoriteProducts.map(product => (
            <Item key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
