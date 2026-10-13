/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    const productId = typeof product === 'object' ? product.id : product;
    const title = typeof product === 'object' ? product.title : null;

    setFavorites(prev => {
      const isAlreadyFav = prev.includes(productId);
      if (isAlreadyFav) {
        if (title) toast.info(`Quitaste "${title}" de favoritos`);
        return prev.filter(id => id !== productId);
      } else {
        if (title) toast.success(`Agregaste "${title}" a favoritos`);
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      clearFavorites,
      favoritesCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
