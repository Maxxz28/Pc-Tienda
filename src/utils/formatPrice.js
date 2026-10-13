/**
 * formatPrice.js
 * Formats a number with thousands dot separator for Argentine Spanish locale.
 * Example: 35000 -> "35.000"
 */
export const formatPrice = (price) => {
  return Number(price || 0).toLocaleString('es-AR');
};
