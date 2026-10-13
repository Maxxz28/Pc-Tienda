import { useContext } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../../context/FavoritesContext';
import './FavoritesWidget.css';

const FavoritesWidget = () => {
  const { favoritesCount } = useContext(FavoritesContext);

  return (
    <Link to="/favoritos" className="favorites-widget" title="Mis Favoritos" aria-label="Favoritos">
      <Star size={24} className={favoritesCount > 0 ? "active-star-icon" : ""} />
      {favoritesCount > 0 && <span className="favorites-indicator">{favoritesCount}</span>}
    </Link>
  );
};

export default FavoritesWidget;
