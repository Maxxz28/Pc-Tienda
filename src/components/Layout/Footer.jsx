import { Link } from 'react-router-dom';
import { User, MapPin, Mail, MessageSquare } from 'lucide-react';
import './Footer.css';

// Lista modular del equipo
const equipo = [
  { id: 1, nombre: 'Paz Maximo', rol: 'CEO & Full Stack Dev', email: 'maxpaz28220@gmail.com' }
];

// Componente reutilizable para cada integrante
const TeamCard = ({ nombre, rol, email }) => (
  <div className="team-card">
    <User size={38} className="team-avatar-icon" />
    <div>
      <h4>{nombre}</h4>
      <p>{rol}</p>
      {email && (
        <p style={{ fontSize: '0.8rem', color: 'var(--navbar-text-soft)', marginTop: '2px' }}>
          {email}
        </p>
      )}
    </div>
  </div>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3>PC-Tienda</h3>
          <p>Ofreciendo los mejores periféricos y componentes de hardware. Calidad, garantía y rendimiento para tu setup.</p>
        </div>
        
        <div className="footer-col">
          <h3>Contacto</h3>
          <div className="footer-contact-list">
            <p className="contact-item">
              <MapPin size={16} className="contact-icon" />
              <span>Av. Tecnológica 1024, CABA, Argentina</span>
            </p>
            <p className="contact-item">
              <Mail size={16} className="contact-icon" />
              <span>maxpaz28220@gmail.com</span>
            </p>
            <p className="contact-item">
              <MessageSquare size={16} className="contact-icon" />
              <Link to="/contacto" className="footer-link-highlight">
                Escribinos desde el formulario
              </Link>
            </p>
          </div>
        </div>

        <div className="footer-col">
          <h3>Nuestro Equipo</h3>
          <div className="team-cards">
            {equipo.map((persona) => (
              <TeamCard key={persona.id} {...persona} />
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span>&copy; {new Date().getFullYear()} PC-Tienda · Todos los derechos reservados</span>
          
          <nav className="footer-nav" aria-label="Enlaces del pie">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/favoritos">Favoritos</Link>
            <Link to="/carrito">Carrito</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
