import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Trash2, Edit3, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { applyProductOverrides } from '../utils/getProducts';
import './Admin.css';

const Admin = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Add Product State
  const [customId, setCustomId] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('perifericos');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  
  const fileInputRef = useRef(null);

  // Manage Products State
  const [allProducts, setAllProducts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch('/productos.json');
        const data = await response.json();
        const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
        const combined = applyProductOverrides(data).map(p => ({
          ...p,
          isCustom: customProducts.some(cp => cp.id === p.id)
        }));
        setAllProducts(combined);
      } catch {
        setAllProducts([]);
      }
    };
    fetchAllProducts();
  }, [refreshTrigger]);

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'Imagen muy pesada',
          text: 'Por favor, elige una imagen que pese menos de 2MB.',
          background: 'var(--card-bg)',
          color: 'var(--text-color)',
          confirmButtonColor: 'var(--btn-primary)'
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Add Product
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !category || !description || !image || !stock) {
      Swal.fire({
        icon: 'error',
        title: 'Faltan datos',
        text: 'Por favor, completa todos los campos requeridos y sube una imagen.',
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });
      return;
    }

    // Determinar ID: si el usuario ingresó uno, usarlo; sino generar con Date.now()
    const trimmedId = customId.trim();
    let finalId = trimmedId ? (!isNaN(Number(trimmedId)) ? Number(trimmedId) : trimmedId) : Date.now();

    // Validar que no exista ya un producto con ese ID
    const idExists = allProducts.some(p => String(p.id) === String(finalId));
    if (idExists) {
      Swal.fire({
        icon: 'warning',
        title: 'ID Duplicado',
        text: `Ya existe un producto con el ID "${finalId}". Ingresa otro ID o déjalo vacío para autogenerar.`,
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });
      return;
    }

    const newProduct = {
      id: finalId,
      title,
      price: Number(price),
      category,
      description,
      image,
      stock: Number(stock)
    };

    const existingProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
    
    try {
      localStorage.setItem('customProducts', JSON.stringify([...existingProducts, newProduct]));
      
      Swal.fire({
        icon: 'success',
        title: '¡Producto Agregado!',
        text: `El producto "${title}" (ID: ${finalId}) ha sido publicado.`,
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });

      setCustomId(''); setTitle(''); setPrice(''); setCategory('perifericos');
      setDescription(''); setImage(''); setStock('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setRefreshTrigger(prev => prev + 1);

    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error de Almacenamiento',
        text: 'La memoria local está llena. Intenta borrar otros productos o usar imágenes más ligeras.',
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
        confirmButtonColor: 'var(--btn-primary)'
      });
    }
  };

  // Handle Delete Product
  const handleDelete = (id, isCustom, productTitle) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `Estás a punto de eliminar "${productTitle}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--btn-danger)',
      cancelButtonColor: 'var(--btn-primary)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: 'var(--card-bg)',
      color: 'var(--text-color)'
    }).then((result) => {
      if (result.isConfirmed) {
        if (isCustom) {
          let customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
          customProducts = customProducts.filter(p => p.id !== id);
          localStorage.setItem('customProducts', JSON.stringify(customProducts));
        } else {
          let deletedProducts = JSON.parse(localStorage.getItem('deletedProducts')) || [];
          deletedProducts.push(id);
          localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
        }
        
        // Si borramos el único item de una página mayor a 1, retroceder de página
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }

        setRefreshTrigger(prev => prev + 1);
        Swal.fire({
          title: 'Eliminado',
          icon: 'success',
          background: 'var(--card-bg)',
          color: 'var(--text-color)',
          confirmButtonColor: 'var(--btn-primary)'
        });
      }
    });
  };

  // Handle Update Stock and Price
  const handleEditProduct = async (id, currentStock, currentPrice, productTitle) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Producto',
      html: `
        <div style="text-align: left; margin-bottom: 1rem;">
          <p style="margin-bottom: 10px; color: var(--text-color);">Modificando: <strong>${productTitle}</strong></p>
          <label style="color: var(--text-muted); font-size: 0.9rem;">Precio Actual (ARS)</label>
          <input id="swal-price" class="swal2-input" style="width: 85%; margin: 0 0 1rem 0;" type="number" min="0" value="${currentPrice}">
          <label style="color: var(--text-muted); font-size: 0.9rem;">Cantidad en Stock</label>
          <input id="swal-stock" class="swal2-input" style="width: 85%; margin: 0;" type="number" min="0" value="${currentStock}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      background: 'var(--card-bg)',
      color: 'var(--text-color)',
      confirmButtonColor: 'var(--btn-primary)',
      preConfirm: () => {
        const rawPrice = document.getElementById('swal-price').value.trim();
        const rawStock = document.getElementById('swal-stock').value.trim();
        const numPrice = Number(rawPrice);
        const numStock = Number(rawStock);

        if (rawPrice === '' || isNaN(numPrice) || numPrice < 0 ||
            rawStock === '' || isNaN(numStock) || numStock < 0) {
          Swal.showValidationMessage('Por favor ingresa números válidos (0 o mayores)');
          return false;
        }
        return { newPrice: numPrice, newStock: numStock };
      }
    });

    if (formValues) {
      // Guardar Stock
      const modifiedStock = JSON.parse(localStorage.getItem('modifiedStock')) || {};
      modifiedStock[id] = formValues.newStock;
      localStorage.setItem('modifiedStock', JSON.stringify(modifiedStock));

      // Guardar Precio
      const modifiedPrice = JSON.parse(localStorage.getItem('modifiedPrice')) || {};
      modifiedPrice[id] = formValues.newPrice;
      localStorage.setItem('modifiedPrice', JSON.stringify(modifiedPrice));
      
      setRefreshTrigger(prev => prev + 1);
      
      Swal.fire({
        title: '¡Actualizado!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: 'var(--card-bg)',
        color: 'var(--text-color)',
      });
    }
  };

  // Filtrado y Paginación
  const filteredProducts = allProducts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Acceso Denegado</h2>
        <p style={{ color: 'var(--text-muted)' }}>Solo los administradores pueden acceder a este panel.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      
      {/* SECCIÓN 1: AGREGAR PRODUCTO */}
      <div className="admin-section">
        <div className="admin-header">
          <h2>Panel de Administración</h2>
          <p>Añade nuevos productos al catálogo.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="customId">ID del Producto (Opcional)</label>
              <input 
                type="text" 
                id="customId" 
                value={customId} 
                onChange={(e) => setCustomId(e.target.value)} 
                placeholder="Ej: 101 (o vacío para autogenerar)"
              />
            </div>
            <div className="form-group half">
              <label htmlFor="category">Categoría principal</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="perifericos">Periféricos</option>
                <option value="componentes">Componentes</option>
                <option value="monitores">Monitores</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Nombre del Producto</label>
            <input 
              type="text" 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Tarjeta Gráfica RTX 4060"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="price">Precio (ARS)</label>
              <input 
                type="number" 
                id="price" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Ej: 450000"
                min="0"
              />
            </div>

            <div className="form-group half">
              <label htmlFor="stock">Stock Inicial</label>
              <input 
                type="number" 
                id="stock" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                placeholder="Ej: 15"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen del Producto</label>
            <input 
              type="file" 
              id="image" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ padding: '0.5rem', cursor: 'pointer' }}
            />
            {image && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Vista previa:</p>
                <img 
                  src={image} 
                  alt="Vista previa" 
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white' }} 
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción Detallada</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe las características..."
              rows="4"
            />
          </div>

          <button type="submit" className="btn btn-primary admin-submit">Publicar Producto</button>
        </form>
      </div>

      <hr style={{ borderColor: 'var(--border-color)', margin: '4rem 0' }} />

      {/* SECCIÓN 2: GESTIONAR PRODUCTOS */}
      <div className="admin-section">
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Gestión de Inventario</h2>
            <p>Busca, edita precios, controla el stock y elimina productos.</p>
          </div>
          
          {/* Search Bar */}
          <div className="admin-search-wrapper" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.5rem 1rem', width: '100%', maxWidth: '300px' }}>
            <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-color)', width: '100%', outline: 'none' }}
            />
          </div>
        </div>

        <div className="admin-table-container" style={{ marginTop: '1rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.title} className="admin-table-img" />
                  </td>
                  <td>
                    <strong>{product.title}</strong>
                    <br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.category}</span>
                  </td>
                  <td><strong style={{ color: 'var(--btn-primary)' }}>${product.price}</strong></td>
                  <td>
                    <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions-flex">
                      <button 
                        className="action-btn edit" 
                        title="Modificar Stock y Precio"
                        onClick={() => handleEditProduct(product.id, product.stock, product.price, product.title)}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Eliminar Producto"
                        onClick={() => handleDelete(product.id, product.isCustom, product.title)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="admin-pagination" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Página {currentPage} de {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1}
                className="btn"
                style={{ padding: '0.5rem', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages}
                className="btn"
                style={{ padding: '0.5rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Admin;
