import { User } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3>PC-Tienda</h3>
          <p>Ofreciendo los mejores periféricos y componentes desde 2026. Calidad y rendimiento para tu setup.</p>
        </div>
        
        <div className="footer-col">
          <h3>Contacto</h3>
          <p>Dirección: Calle Falsa 123, Ciudad</p>
          <p>Email: maxpaz28220@gmail.com</p>
        </div>

        <div className="footer-col">
          <h3>Nuestro Equipo</h3>
          <div className="team-cards">
            <div className="team-card">
              <User size={40} className="team-avatar-icon" />
              <div>
                <h4>Paz Maximo</h4>
                <p>CEO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 PC-Tienda. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
