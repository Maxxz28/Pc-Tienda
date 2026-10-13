import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer';
import Cart from './pages/Cart';
import Favoritos from './pages/Favoritos';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Contacto from './pages/Contacto';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="productos" element={<ItemListContainer />} />
                  <Route path="categoria/:categoryId" element={<ItemListContainer />} />
                  <Route path="producto/:id" element={<ItemDetailContainer />} />
                  <Route path="carrito" element={<Cart />} />
                  <Route path="favoritos" element={<Favoritos />} />
                  <Route path="login" element={<Login />} />
                  <Route path="contacto" element={<Contacto />} />
                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="perfil" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="admin" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
                </Route>
              </Routes>
              <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
