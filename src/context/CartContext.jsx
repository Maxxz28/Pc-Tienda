/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fix: use functional updater (prev =>) to avoid stale closure bugs
  const addToCart = (product, quantity) => {
    const itemInCart = cart.find(item => item.id === product.id);
    const currentQuantity = itemInCart ? itemInCart.quantity : 0;

    if (currentQuantity + quantity > product.stock) {
      toast.error(`Solo quedan ${product.stock} unidades de ${product.title}`);
      return false;
    }

    if (itemInCart) {
      setCart(prev => prev.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart(prev => [...prev, { ...product, quantity }]);
    }

    toast.success(`Agregaste ${product.title} al carrito`);
    return true;
  };

  // Fix: use functional updater to avoid stale closure bugs
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Fix: was defined but never exported — now exposed in context value
  const isInCart = (id) => {
    return cart.some(item => item.id === id);
  };

  const totalQuantity = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const totalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      totalQuantity,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
