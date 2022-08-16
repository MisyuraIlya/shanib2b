// Global
import { createContext, useState, useContext, useEffect } from 'react';
import React from 'react';
import { ajax } from './ajaxFunction';
// Defines
const CartContex = createContext();

// React hook
const useCart = () => {
  const context = useContext(CartContex);
  if (!context) {
    throw new Error('Can not run without "CartProvider"');
  }
  return context;
}

const CartProvider = (props) => {
  // State
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helpers

const increase = (item,number) => {
    //hereZz
    const localStorageData = JSON.parse(localStorage.CartProducts)
    localStorageData.map((prod) => {
        if(prod.CatalogNumber == item.CatalogNumber ){
            prod.Quantity = number
        }
    })
    localStorage.setItem('CartProducts', JSON.stringify(localStorageData))


}

const decrease = (item,number) => {
  console.log(item,number)
    if(number > 0 ) {
      const localStorageData = JSON.parse(localStorage.CartProducts)
      localStorageData.map((prod) => {
          if(prod.CatalogNumber == item.CatalogNumber ){
              prod.Quantity = number
          }
      })
      localStorage.setItem('CartProducts', JSON.stringify(localStorageData))
    } else {
      const localStorageData = JSON.parse(localStorage.CartProducts)
      let data = localStorageData.filter((prod) =>  prod.CatalogNumber != item.CatalogNumber)
      setCart(data)
      localStorage.setItem('CartProducts', JSON.stringify(data))
    }

}

const handleInputProvider = (item,number) => {
  const localStorageData = JSON.parse(localStorage.CartProducts)
  localStorageData.map((prod) => {
      if(prod.CatalogNumber == item.CatalogNumber ){
          prod.Quantity = number
      }
  })
  localStorage.setItem('CartProducts', JSON.stringify(localStorageData))
}

const addProduct = (item) => {
    setCart(oldArr => [...oldArr, item])
    const dataToLocal = [...cart, item]
    localStorage.setItem('CartProducts', JSON.stringify(dataToLocal))
}

const fetchFromLocalStorage = () => {
    if(localStorage.CartProducts){
        setCart(JSON.parse(localStorage.CartProducts));
    } else {
        setCart([])
    }
}

const wrtieNewOrder = async (optionsState) => {

  setLoading(true);
  let user;
  let userExId;
  localStorage.user ? user = JSON.parse(localStorage.user) : null;

  if(user){
    userExId = user.ExId;
  }
  let order = [];
  let tempSingle;
  let storage = JSON.parse(localStorage.CartProducts)
  storage.map((item) => {
    console.log(item)
    tempSingle = {
      Id: item.Id,
      CatalogNumber: item.CatalogNumber,
      Title: item.Title,
      Quantity: item.Quantity,
      Cquant: item.CQUANT ? item.CQUANT : null,
      Tquant: item.TQUANT ? item.TQUANT : null,
      // UnitChosen: item.UnitChosen,
      PackQuan: item.PackQuan,
      Itbo: item.ItboConvglas,
    }
    order.push(tempSingle);
  })

  if(!optionsState){
    optionsState = '200'
  }
  let params = {
    userExId: userExId,
    products: order,
    destCodeChosen: optionsState
  };
  console.log(params)
  params = JSON.stringify(params);
  const valAjax = {
    funcName: 'WriteOrder',
    point: 'orders',
    params: params
  };

  try {
    const data = await ajax(valAjax);
  } catch(e) {
    console.error('[state/cart/wrtieNewOrder] Failed to write new order', { e });
  } finally{
    setLoading(false);
  }

}




  // Logic
  
  useEffect(() => fetchFromLocalStorage(), []);
  
  // Export
  const methodsCart = {
    increase,
    decrease,
    addProduct,
    handleInputProvider,
    wrtieNewOrder,
    setCart

  };
  return <CartContex.Provider value={{
    cart,
    loading,
    methodsCart,
  }} {...props} />
}

export { useCart, CartProvider };