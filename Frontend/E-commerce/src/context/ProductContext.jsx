import { createContext, useContext, useState } from 'react';
import { products as initProducts } from '../data/mockData';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initProducts);

  const addProduct = (product) => setProducts(prev => [product, ...prev]);

  const updateProduct = (id, updates) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const deleteProduct = (id) =>
    setProducts(prev => prev.filter(p => p.id !== id));

  const getFeaturedProducts = () => products.filter(p => p.featured);

  const getProductBySlug = (slug) => products.find(p => p.slug === slug);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getFeaturedProducts, getProductBySlug }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
