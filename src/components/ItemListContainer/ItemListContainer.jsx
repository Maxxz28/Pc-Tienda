import { useState, useEffect } from 'react';
import { useParams, NavLink, Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Item from '../Item/Item';
import { applyProductOverrides } from '../../utils/getProducts';
import './ItemListContainer.css';

// Categorías estructuradas constantes
const CATEGORIES = [
  { 
    id: 'componentes', 
    name: 'Componentes',
    sub: [
      { id: 'fuentes', name: 'Fuentes de Poder' },
      { id: 'ram', name: 'Memorias RAM' },
      { id: 'almacenamiento', name: 'Discos y SSD' }
    ]
  },
  { 
    id: 'perifericos', 
    name: 'Periféricos',
    sub: [
      { id: 'mouse', name: 'Mouses' },
      { id: 'teclados', name: 'Teclados' },
      { id: 'auriculares', name: 'Auriculares' }
    ]
  },
  { 
    id: 'monitores', 
    name: 'Monitores',
    sub: []
  }
];

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevantes');
  
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');
  const subCategory = searchParams.get('sub');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/productos.json');
        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        const allProducts = applyProductOverrides(data);
        let filtered = allProducts;
        
        if (categoryId) {
          filtered = filtered.filter(p => p.category === categoryId);
        }

        if (subCategory) {
          // El producto tiene que tener la prop subcategory que agregamos
          filtered = filtered.filter(p => p.subcategory === subCategory);
        }
        
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (sortOrder === 'menor-precio') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'mayor-precio') {
          filtered.sort((a, b) => b.price - a.price);
        }
        
        setProducts(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subCategory, searchTerm, sortOrder]);

  let title = 'Destacados';
  if (subCategory) {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    const sub = cat?.sub?.find(s => s.id === subCategory);
    title = sub ? sub.name : subCategory;
  } else if (categoryId) {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    title = cat ? cat.name : categoryId;
  } else if (searchTerm) {
    title = `Búsqueda: "${searchTerm}"`;
  }

  return (
    <div className="catalog-layout">
      {/* Sidebar de Filtros */}
      <aside className="catalog-sidebar">
        <div className="sidebar-group">
          <h3 className="sidebar-title">
            <ChevronDown size={18} color="var(--btn-primary)" />
            Categorías
          </h3>
          <ul className="sidebar-list">
            <li>
              <NavLink to="/productos" end className={({isActive}) => isActive && !subCategory ? "sidebar-link active" : "sidebar-link"}>
                <ChevronRight size={14} className="link-icon" />
                Todos los productos
              </NavLink>
            </li>
            
            {CATEGORIES.map(cat => {
              const isCatActive = categoryId === cat.id;
              
              return (
                <li key={cat.id} className="sidebar-item-group">
                  <NavLink to={`/categoria/${cat.id}`} className={isCatActive && !subCategory ? "sidebar-link active" : "sidebar-link"}>
                    <ChevronRight size={14} className="link-icon" />
                    {cat.name}
                  </NavLink>
                  
                  {isCatActive && cat.sub.length > 0 && (
                    <ul className="sidebar-sublist">
                      {cat.sub.map(subItem => {
                        const isSubActive = subCategory === subItem.id;
                        return (
                          <li key={subItem.id}>
                            <Link 
                              to={`/categoria/${cat.id}?sub=${subItem.id}`} 
                              className={`sidebar-sublink ${isSubActive ? 'active' : ''}`}
                            >
                              - {subItem.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="catalog-main">
        <div className="catalog-header">
          <h2>{title}</h2>
          
          <div className="catalog-sort">
            <label htmlFor="sort">Ordenar por</label>
            <select 
              id="sort" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="relevantes">Más relevantes</option>
              <option value="menor-precio">Menor precio</option>
              <option value="mayor-precio">Mayor precio</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loader" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Cargando productos...
          </div>
        ) : error ? (
          <div className="error" style={{ textAlign: 'center', color: 'var(--btn-danger)' }}>{error}</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <div className="item-list">
            {products.map(product => (
              <Item key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ItemListContainer;
