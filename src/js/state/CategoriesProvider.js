// Global
import { createContext, useState, useContext, useEffect } from 'react';
import React from 'react';
import { ajax } from './ajaxFunction';
// Defines
const CategoriesContex = createContext();

// React hook
const useCategories = () => {
  const context = useContext(CategoriesContex);
  if (!context) {
    throw new Error('Can not run without "CategoriesProvider"');
  }
  return context;
}

const CategoriesProvider = (props) => {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helpers

  const getCategories = async () => {
    setLoading(true);

    const valAjax = {
      funcName: 'getItems',
      point: 'categories',
    };

    try {
      const data = await ajax(valAjax);
      setCategories(data.Categories)
    } catch (error) {
      console.error('[state/Categories/loadCategories] Failed to load Categoriess', { error });
      setError({ isError: true, message: error.message });
    } finally {
      setLoading(false);
    }
  }

  
  const createCategories = async (title, description) => {
    try {
      
    } catch (error) {
      console.error('[state/Categories/createPost] Failed to load Categoriess', { error });
      setError({ isError: true, message: error.message });
    }
  }






  // Logic
  
  useEffect(() => getCategories(), []);

  // Export
  const methods = {
    createCategories,
    getCategories,
  };
  return <CategoriesContex.Provider value={{
    categories,
    loading,
    methods,
  }} {...props} />
}

export { useCategories, CategoriesProvider };