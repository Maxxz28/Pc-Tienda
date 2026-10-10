import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Checkout.css';

const Checkout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    confirmEmail: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleComprar = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.email || !formData.confirmEmail) {
      setError('Por favor completa todos los campos de facturación.');
      return;
    }
    
    if (formData.email !== formData.confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }
    
    // Generar un ID de orden aleatorio
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Guardar orden
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice()
    };
    
    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];
    localStorage.setItem(`orders_${user.email}`, JSON.stringify([...existingOrders, newOrder]));

    Swal.fire({
      title: '¡Compra confirmada!',
      html: `
        <p>Gracias por tu compra, <strong>${formData.nombre}</strong>.</p>
        <p>Tu número de orden es: <br/><b>${orderId}</b></p>
        <p style="margin-top: 10px; font-size: 0.9em;">Hemos enviado el recibo a ${formData.email}</p>
      `,
      icon: 'success',
      confirmButtonColor: 'var(--btn-primary)',
      confirmButtonText: 'Ver mis órdenes'
    }).then(() => {
      clearCart();
      navigate('/perfil');
    });
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container" style={{ maxWidth: '600px' }}>
        <div className="checkout-summary-section" style={{ textAlign: 'center' }}>
          <h2>Proceso de Checkout</h2>
          <p style={{ color: 'var(--text-color)', marginBottom: '1.5rem' }}>No tienes productos en tu carrito para pagar.</p>
          <Link to="/productos" className="btn btn-primary">Ir al catálogo</Link>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <button className="btn btn-danger" onClick={logout} style={{ padding: '0.5rem 1rem' }}>Cerrar Sesión</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Lado Izquierdo: Formulario */}
      <div className="checkout-form-section">
        <h2>Datos de Facturación</h2>
        <div className="user-info-badge">
          <span>Logueado como: <strong>{user?.name}</strong></span>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--btn-danger)', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </div>
        
        <form onSubmit={handleComprar} className="checkout-form">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Tu nombre" />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Tu apellido" />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Ej: 11 1234-5678" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" />
          </div>
          <div className="form-group">
            <label>Confirmar Email</label>
            <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleInputChange} placeholder="correo@ejemplo.com" />
          </div>
          
          {error && <p className="form-error">{error}</p>}
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Generar Orden de Compra
          </button>
        </form>
      </div>

      {/* Lado Derecho: Resumen */}
      <div className="checkout-summary-section">
        <h3>Resumen de tu pedido</h3>
        <div className="summary-list">
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span className="summary-item-title">{item.quantity}x {item.title}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="summary-total">
          <span>Total a pagar:</span>
          <span>${totalPrice()}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Pagos 100% seguros y encriptados.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
