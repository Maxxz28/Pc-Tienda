import { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import CartWidget from './CartWidget';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { Moon, Sun, User, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          PC-<span style={{ color: 'var(--btn-primary)' }}>Tienda</span>
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Inicio</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/productos" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Productos</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/contacto" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Contacto</NavLink>
          </li>
          {user?.role === 'admin' && (
            <li className="nav-item">
              <NavLink to="/admin" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} style={{ color: 'var(--btn-primary)', fontWeight: 'bold' }}>Panel Admin</NavLink>
            </li>
          )}
        </ul>
        <div className="navbar-actions">
          <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '20px', padding: '0.3rem 0.8rem', marginRight: '1rem', border: '1px solid var(--border-color)' }}>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-color)', outline: 'none', width: '120px' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Search size={16} />
            </button>
          </form>

          <div className="icons-group" style={{ display: 'flex', gap: '0' }}>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            
            <CartWidget />

            {isAuthenticated ? (
              <Link to="/perfil" className="auth-link" title="Mi Perfil">
                <User size={24} />
                <span className="auth-name">{user?.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="auth-link" title="Iniciar Sesión">
                <User size={24} />
                <span className="auth-name">Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
