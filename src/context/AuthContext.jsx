import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('auth', isAuthenticated);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  const register = (email, username, password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return { success: false, error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número o símbolo.' };
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'El correo ya está registrado.' };
    }

    const newUser = { email, username, password, role: 'user' };
    localStorage.setItem('registeredUsers', JSON.stringify([...users, newUser]));
    
    setIsAuthenticated(true);
    setUser({ name: username, email: email, role: 'user' });
    return { success: true };
  };

  const login = (email, password) => {
    // Cuenta Admin Hardcodeada
    if (email === 'admin@admin.com' && password === 'Admin123!') {
      setIsAuthenticated(true);
      setUser({ name: 'Administrador', email: 'admin@admin.com', role: 'admin' });
      return { success: true };
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setIsAuthenticated(true);
      setUser({ name: foundUser.username, email: foundUser.email, role: foundUser.role || 'user' });
      return { success: true };
    }
    return { success: false, error: 'Credenciales inválidas o usuario no registrado.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
