import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegistering) {
      if (!email || !username || !password) {
        setError('Por favor, completa todos los campos.');
        return;
      }
      const result = register(email, username, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } else {
      if (!email || !password) {
        setError('Por favor, ingresa tu correo y contraseña.');
        return;
      }
      const result = login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        {error && <p className="login-error">{error}</p>}
        
        {isRegistering && (
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario:</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Ej: Maxxz"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Min. 8 caracteres, 1 mayúscula, 1 número"
          />
        </div>
        
        <button type="submit" className="btn btn-primary login-btn">
          {isRegistering ? 'Registrarse' : 'Ingresar'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
          <button 
            type="button" 
            onClick={toggleMode} 
            style={{ background: 'none', border: 'none', color: 'var(--btn-primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
