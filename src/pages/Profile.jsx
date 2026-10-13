import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const orders = user
    ? (JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ color: 'var(--text-color)', margin: 0 }}>Mi Perfil</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>
        
        <h3 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Historial de Órdenes</h3>
        
        {orders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aún no has realizado ninguna compra.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-color)' }}>Orden: {order.id}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.id || index}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                      <span>{item.quantity}x {item.title}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--price-color)', fontSize: '1.1rem' }}>
                  <span>Total:</span>
                  <span>${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
