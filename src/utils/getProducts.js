/**
 * getProducts.js
 * Utility function to merge JSON products with localStorage overrides.
 * Used by: Home.jsx, Admin.jsx, ItemListContainer.jsx, ItemDetailContainer.jsx
 */
export const applyProductOverrides = (baseData) => {
  const customProducts = JSON.parse(localStorage.getItem('customProducts')) || [];
  const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts')) || [];
  const modifiedStock = JSON.parse(localStorage.getItem('modifiedStock')) || {};
  const modifiedPrice = JSON.parse(localStorage.getItem('modifiedPrice')) || {};

  return [...baseData, ...customProducts]
    .filter(p => !deletedProducts.includes(p.id))
    .map(p => ({
      ...p,
      stock: modifiedStock[p.id] !== undefined ? modifiedStock[p.id] : p.stock,
      price: modifiedPrice[p.id] !== undefined ? modifiedPrice[p.id] : p.price
    }));
};
