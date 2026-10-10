import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Clock, ChevronLeft, ChevronRight, Monitor, Cpu, Mouse, Mail } from 'lucide-react';
import Item from '../components/Item/Item';
import Swal from 'sweetalert2';
import './Home.css';

const slides = [
  {
    id: 1,
    title: "Equipa tu Setup",
    subtitle: "Encuentra los mejores periféricos y componentes de hardware al mejor precio. Calidad garantizada.",
    image: "/img/perifericos/auriculares/1.webp",
    link: "/productos",
    btnText: "Ver Catálogo"
  },
  {
    id: 2,
    title: "Mes Gamer: 20% OFF",
    subtitle: "Aprovecha descuentos exclusivos en toda la línea de monitores de alta tasa de refresco.",
    image: "/img/monitor/1.jpg",
    link: "/categoria/monitores",
    btnText: "Ver Monitores"
  },
  {
    id: 3,
    title: "Potencia Extrema",
    subtitle: "Actualiza tu PC con los últimos SSD NVMe y memorias RAM de alto rendimiento.",
    image: "/img/componentes/disco/1.jpg",
    link: "/categoria/componentes",
    btnText: "Actualizar PC"
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Slider timer
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    // Fetch destacados
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/productos.json');
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
        
        const featured = allProducts.slice(0, 4); 
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error cargando destacados:", error);
      }
    };

    fetchFeatured();

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  return (
    <div className="home-container">
      {/* Slider Section */}
      <section className="slider-section">
        <button className="slider-btn left" onClick={prevSlide}>
          <ChevronLeft size={32} />
        </button>
        
        <div className="slider-content-wrapper">
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to={slide.link} className="btn btn-primary hero-btn">
                  {slide.btnText}
                </Link>
              </div>
              <div className="slide-image">
                <img src={slide.image} alt={slide.title} />
              </div>
            </div>
          ))}
        </div>

        <button className="slider-btn right" onClick={nextSlide}>
          <ChevronRight size={32} />
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categorías Visuales */}
      <section className="home-categories-section">
        <div className="featured-header">
          <h2>Explora por Categoría</h2>
        </div>
        <div className="home-categories-grid">
          <Link to="/categoria/perifericos" className="home-category-card">
            <Mouse size={48} className="cat-icon" />
            <h3>Periféricos</h3>
            <p>Mouses, Teclados y Auriculares</p>
          </Link>
          <Link to="/categoria/componentes" className="home-category-card">
            <Cpu size={48} className="cat-icon" />
            <h3>Componentes</h3>
            <p>Arma la PC de tus sueños</p>
          </Link>
          <Link to="/categoria/monitores" className="home-category-card">
            <Monitor size={48} className="cat-icon" />
            <h3>Monitores</h3>
            <p>Alta tasa de refresco y 4K</p>
          </Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-products-section">
        <div className="featured-header">
          <h2>Productos Destacados</h2>
          <Link to="/productos" className="view-all-link">Ver todo el catálogo →</Link>
        </div>
        <div className="featured-grid">
          {featuredProducts.map(product => (
            <Item key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Características / Beneficios */}
      <section className="features-section">
        <div className="feature-card">
          <Truck size={48} className="feature-icon" />
          <h3>Envío a todo el país</h3>
          <p>Despachamos tu compra en el día a cualquier parte de Argentina.</p>
        </div>
        <div className="feature-card">
          <ShieldCheck size={48} className="feature-icon" />
          <h3>Compra Segura</h3>
          <p>Tus datos están protegidos y todos los productos tienen garantía.</p>
        </div>
        <div className="feature-card">
          <Clock size={48} className="feature-icon" />
          <h3>Soporte 24/7</h3>
          <p>Atención personalizada para ayudarte a armar tu PC ideal.</p>
        </div>
      </section>

      {/* Banner Promocional / Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <Mail size={40} className="newsletter-icon" />
          <h2>Únete a nuestro Boletín</h2>
          <p>Recibe cupones de descuento, noticias de hardware y promociones exclusivas antes que nadie.</p>
          <form 
            className="newsletter-form" 
            onSubmit={(e) => { 
              e.preventDefault(); 
              
              const emailInput = e.target.elements[0].value;
              const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers')) || [];
              
              if (subscribers.includes(emailInput)) {
                Swal.fire({
                  icon: 'info',
                  title: '¡Ya estás suscrito!',
                  text: 'Este correo ya se encuentra en nuestra lista de novedades.',
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  confirmButtonColor: 'var(--btn-primary)'
                });
              } else {
                subscribers.push(emailInput);
                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
                
                Swal.fire({
                  icon: 'success',
                  title: '¡Suscrito con éxito!',
                  text: 'A partir de ahora recibirás nuestras mejores ofertas.',
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  confirmButtonColor: 'var(--btn-primary)'
                });
                e.target.reset(); // Limpia el input
              }
            }}
          >
            <input type="email" placeholder="Tu correo electrónico..." required />
            <button type="submit" className="btn btn-primary">Suscribirme</button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
