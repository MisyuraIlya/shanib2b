// Global
import { createContext, useState, useContext, useEffect } from 'react';
import React from 'react';
import { ajax } from './ajaxFunction';
// Defines
const ProductsContex = createContext();

// React hook
const useProducts = () => {
  const context = useContext(ProductsContex);
  if (!context) {
    throw new Error('Can not run without "ProductsProvider"');
  }
  return context;
}

const ProductsProvider = (props) => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helpers

  const getProducts = async () => {
    setLoading(true);

    const valAjax = {
      funcName: 'getItems',
      point: 'products',
    };

    try {
      const data = await ajax(valAjax);
      setProducts(data.Products)
    } catch (error) {
      console.error('[state/Products/loadProducts] Failed to load Productss', { error });
      setError({ isError: true, message: error.message });
    } finally {
      setLoading(false);
    }
  }

  
  const createProducts = async (title, description) => {
    try {
      
    } catch (error) {
      console.error('[state/Products/createPost] Failed to load Productss', { error });
      setError({ isError: true, message: error.message });
    }
  }






  // Logic
  
  useEffect(() => getProducts(), []);

  // Export
  const methods = {
    createProducts,
    getProducts,
  };
  return <ProductsContex.Provider value={{
    products,
    loading,
    methods,
  }} {...props} />
}

export { useProducts, ProductsProvider };