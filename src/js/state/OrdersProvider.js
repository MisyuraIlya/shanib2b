// Global
import { createContext, useState, useContext, useEffect } from 'react';
import React from 'react';
import { ajax } from './ajaxFunction';
import { useCart } from './CartProvider';
import moment from 'moment-timezone';

// Defines
const OrdersContex = createContext();

// React hook
const useOrders = () => {
  const context = useContext(OrdersContex);
  if (!context) {
    throw new Error('Can not run without "OrdersProvider"');
  }
  return context;
}

const OrdersProvider = (props) => {
  //providers
  const {cart, methodsCart} = useCart();
  // State
  const [orders, setOrders] = useState([]);
  const [statisticsDates, setStatisticsDates] = useState([])
  const [statisticsParams, setStatisticsParams] = useState([])
  const [statisticsLimit, setStatisticsLimit] = useState([])
  const [loading, setLoading] = useState(false);
  const [migvans, setMigvans] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [orderProds, setOrderProds] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  // Helpers

  const getOrders = async (date) => {
    setLoading(true)
    const valAjax = {
      funcName: 'getItems',
      point: 'orders',
      id:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
      date:date
    };

    try {
      const data = await ajax(valAjax);
      setOrders(data.Orders)
    } catch (error) {
      console.error('[state/Orders/loadOrders] Failed to load Orderss', { error });
    } finally {
      setLoading(false);
    }
  }

  const migvanProducts = async () => {
    setLoading(true);
    const valAjax = {
      funcName: 'GetMigvans',
      point: 'products',
      id:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
    };

    try {
      const data = await ajax(valAjax);
      const oneArray = data.Orders.reduce((a,b) => a.concat(b))
      const categories = [];
      oneArray.map((item) => {
        categories.push(item.Category);
      })
      let uniqCategories = [...new Set(categories)];

      const mobileChooseCategory = [
        {id:1, title:'פולי קפה', img:globalFileServer + '/shaniIcons/Asset 48.svg'},
        {id:2, title:'גרניטה ואייסים', img:globalFileServer + '/shaniIcons/Asset 52.svg'},
        {id:3, title:'גלידות', img:globalFileServer + '/shaniIcons/Asset 51.svg'},
      ]

      let resCatRes = [];
      let resCat = uniqCategories.map((item) => {
        mobileChooseCategory.map((cat) =>{
          if(item == cat.title){
            let obj = {
              title:item,
              img:cat.img
            }
            resCatRes.push(obj);

          }
        })
      })
      console.log(resCatRes)
      setCurrentCategories(resCatRes)
      setMigvans(oneArray);

    } catch (error) {
      console.error('[state/Orders/loadOrders] Failed to load Orderss', { error });
    } finally {
      setLoading(false);
    }
  }
  
  const createOrders = async (title, description) => {
    try {
      
    } catch (error) {
      console.error('[state/Orders/createPost] Failed to load Orderss', { error });
    }
  }
  
  const restoreOrder = async (obj) => {

  setLoading(true);
  let user;
  let userExId;
  localStorage.user ? user = JSON.parse(localStorage.user) : null;

  if(user){
    userExId = user.ExId;
  }
  let order = [];
  let tempSingle;
  let storage = obj.products[0]
  storage.map((item) => {
    tempSingle = {
      Id: item.Id,
      CatalogNumber: item.CatalogNumber,
      Title: item.Title,
      Quantity: item.QuantityProd,
      // UnitChosen: item.UnitChosen,
      // PackQuan: item.Products.PackQuan,
    }
    order.push(tempSingle);
  })
  let optionsState;
  if(!optionsState){
    optionsState = '200'
  }
  let params = {
    userExId: userExId,
    products: order,
    destCodeChosen: optionsState
  };
  params = JSON.stringify(params);
  const valAjax = {
    funcName: 'WriteOrder',
    point: 'orders',
    params: params
  };

  try {
    // const data = await ajax(valAjax);
    let data = {
      result:'cancel'
    }
    if(data.result == 'success'){
      return true
    } else {
      return false
    }
  } catch(e) {
    console.error('[state/cart/wrtieNewOrder] Failed to write new order', { e });
  } finally{
    setLoading(false);
  }

  }

  const getItemsInOrder = async (orderNumber) => {
    setSubLoading(true)
    const valAjax = {
      funcName: 'getOneItem',
      point: 'orders',
      id:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
      val:orderNumber
    };

    try {
      const data = await ajax(valAjax);
      setOrderProds(data.Order[0].AllProducts)
    } catch (error) {
      console.error('[state/Orders/loadOrders] Failed to load Orderss', { error });
    } finally {
      setSubLoading(false);
    }
  }

  const CartRestored = () => {
    const arrLocal = [];

    orderProds.map((item) => {

      if(item.QuantityProd > 0){
        item.Quantity = item.QuantityProd
        arrLocal.push(item)
      }

      // methodsCart.setCart(oldArr => [...oldArr, item])
    })


    let uniq = [...new Set(arrLocal)];
    let newArr = cart.concat(uniq)

    function uniqByKeepFirst(a, key) {
      let seen = new Set();
      return a.filter(item => {
          let k = key(item);
          return seen.has(k) ? false : seen.add(k);
      });
    }
    console.log(uniqByKeepFirst(newArr, it => it.CatalogNumber))
  
    // const resArr = cart
    // const newArr = allCart.concat(orderProds)
    // let uniq = [...new Set(newArr)];
    // console.log(uniq)
    methodsCart.setCart(uniqByKeepFirst(newArr, it => it.CatalogNumber))
    localStorage.setItem('CartProducts', JSON.stringify(uniqByKeepFirst(newArr, it => it.CatalogNumber)))


  }

  const fetchStatistics = async () => {
    setSubLoading(true)
    const valAjax = {
      funcName: 'Statistics',
      point: 'orders',
      id:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
    };

    try {
      const data = await ajax(valAjax);
      const dates = []
      const params = []
      const limited = []
      console.log('here',data.Orders)
      data.Orders.map((item) => {
        console.log(item)
        dates.push(moment(item.FDATE).format('l'))
        params.push(item.CQUANT)
        limited.push(item.TQUANT)
      })
      console.log('1',dates)
      console.log('2',params)
      console.log('3',limited)
      setStatisticsDates(dates)
      setStatisticsParams(params)
      setStatisticsLimit(limited)
      // setOrderProds(data.Order[0].AllProducts)
    } catch (error) {
      console.error('[state/Orders/loadOrders] Failed to load Orderss', { error });
    } finally {
      setSubLoading(false);
    }
  }




  // Logic
  // useEffect(() => getOrders(), []);
  // Export
  const methods = {
    createOrders,
    getOrders,
    migvanProducts,
    restoreOrder,
    getItemsInOrder,
    CartRestored,
    fetchStatistics
  };
  return <OrdersContex.Provider value={{
    orders,
    loading,
    migvans,
    methods,
    orderProds,
    subLoading,
    statisticsDates,
    statisticsParams,
    statisticsLimit,
    currentCategories

  }} {...props} />
}

export { useOrders, OrdersProvider };