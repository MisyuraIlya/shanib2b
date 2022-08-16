import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Switch, HashRouter as Router, Route } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import UserContext from './UserContext';
import Home from './components/routs/Home';
import CategoryPage from './components/routs/CategoryPage';
import CategoryView from './components/routs/CategoryView';
import ShopCart from './components/routs/ShopCart';
import AdminHistory from './components/routs/AdminHistory';
import Header from './components/Header';
import Footer from './components/Footer';
// import Nav from './components/Nav';
import Clients from './components/routs/Clients';
// import CategoryEdit from './components/routs/CategoryEdit';
// import ProductsEdit from './components/routs/ProductsEdit';
import Report from './components/routs/Report';
import LogIn from "./components/routs/home/LogIn";
import RegisterCheck from './components/routs/home/RegisterCheck';
import RegisterInfo from './components/routs/home/RegisterInfo';
import SuccessPage from './components/routs/shopCart/SuccessPage';
import Success from './components/routs/Success';
import './App.scss';
import ShaniHeader from "./components/ShaniHeader";
import StandingOrder from "./components/routs/StandingOrder";
import HistoryOrder from "./components/routs/HistoryOrder";
import OrderStatus from "./components/routs/OrderStatus";
import Roasting from "./components/routs/Roasting";
import FaultPage from "./components/routs/FaultPage";
import HandlingPage from "./components/routs/HandlingPage";
import ClientService from "./components/routs/ClientService";
import  {ProductsProvider} from './state/ProductsProvider';
import {CategoriesProvider} from './state/CategoriesProvider';
import {OrdersProvider} from './state/OrdersProvider';
import {MachinesProvider} from './state/MachineProvider';
import {CartProvider} from './state/CartProvider';
import StandingOrderNew from './components/routs/StandingOrderNew';
import HistoryOrderNew from './components/routs/HistoryOrderNew';
import Statistics from './components/routs/Statistics';
import OtherProducts from "./components/routs/OtherProducts";
//admin panel
import CategoryEdit from './admin/CategoryEdit'
import Nav from './admin/Nav'
import ProductsEdit from './admin/ProductsEdit'
 
require('./globals.js');

if (module.hot) {
	module.hot.accept();
}


const BasicRouter = (prop) => (
	<Router>
		<Fragment>
      <header id="header">
        {window.innerWidth > 1000 ?
        <Route {...prop} render={matchProps => (<ShaniHeader {...matchProps}{...prop} />)} />
        : 
        <Route {...prop} render={matchProps => (<Header {...matchProps}{...prop} />)} />
        }
      </header>			<Route {...prop} render={matchProps => (<Nav {...matchProps}{...prop} />)} />
			<main id={prop.state.toggleMenu ? 'active' : null} className={'he'}>
				<Switch>
          {localStorage.user ?
            <Route path="/" exact render={(props) => (<Home {...props}{...prop}/>)} />
          :
            <Route path="/" exact render={(props) => (<LogIn {...props}{...prop}/>)} />
          }
          {!localStorage.user ? <Route path="/register" render={(props) => (<RegisterCheck {...props}{...prop}/>)} /> : null}
          {!localStorage.user ? <Route path="/registerInfo/:ExId" render={(props) => (<RegisterInfo {...props}{...prop}/>)} />  : null}
          {localStorage.user ? <Route path="/successPage/:ExId/:Type" render={(props) => (<SuccessPage {...props}{...prop}/>)} />  : null}
          {localStorage.user ? <Route path="/categoryItems/:lvl1/:lvl2/:lvl3" render={(props) => (<CategoryPage {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/standing-order" render={(props) => (<StandingOrderNew {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/history-order" render={(props) => (<HistoryOrderNew {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/statistics" render={(props) => (<Statistics {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/order-status" render={(props) => (<OrderStatus {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/roasting" render={(props) => (<Roasting {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/handling" render={(props) => (<HandlingPage {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/fault-page" render={(props) => (<FaultPage {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/service" render={(props) => (<ClientService {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/other-products" render={(props) => (<OtherProducts {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/category-page" render={(props) => (<CategoryView {...props}{...prop}/>)} /> : null}
					{localStorage.user ? <Route path="/cart" render={(props) => (<ShopCart {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/report" render={(props) => (<Report {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/success/:extId" render={(props) => (<Success {...props}{...prop}/>)} /> : null}

          {localStorage.role ? <Route path="/category-edit/:parentId/:subId" render={(props) => (<CategoryEdit {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/products-edit/:lvl1id/:lvl2id/:lvl3id" render={(props) => (<ProductsEdit key={props.match.params.id} {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/category-build/:id" render={(props) => (<CategoryBuild {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/clients" render={(props) => (<Clients {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/admin-history" render={(props) => (<AdminHistory {...props}{...prop}/>)} /> : null}

        </Switch>
			</main>
			{/* {location.href.includes("category") || location.href.includes("cart") ? null : <Route {...prop} render={matchProps => (<Footer {...matchProps}{...prop} />)} />} */}
		</Fragment>
	</Router>
);
export default BasicRouter;

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
      lang: 'he',
			categories: [],
			productsInCart: [],
			toggleMenu: false,
			user: false,
			products: [],
      defaults: [],
      dateNew:"",
      headerPop:false,
      nav: [],
		}

	}
	componentDidMount(){

    let htmlElement = document.querySelector("html");
    let body = document.querySelector("body");
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.setAttribute('lang', 'he');
		localStorage.user ? this.setState({user: JSON.parse(localStorage.user)}) : null;
		localStorage.products ? this.getProducts() : null;
		this.getCategories();

    if(!localStorage.browser){
      let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if(!isChrome){
        SweetAlert({
          title: 'ברוכים הבאים',
          text: 'אנו ממליצים להשתמש בדפדפן כרום',
          type: 'info',
          timer: 5000,
          showConfirmButton: false,
        }).then(function () {}.bind(this)).catch(SweetAlert.noop);
        localStorage.browser = '1';
      }
    }



	}

  ajax = (value) => {
    return $.ajax({
      url: entry + '/app/app_data.php',
			type: 'POST',
			data: value,
		}).done(function(data) {
		}.bind(this)).fail(function() {
      console.log('error');
    });
	}
	connectionError = (value) => {
		alert(value);
	}

  clearCart = (data) => {
		this.setState({productsInCart: []});
		localStorage.removeItem('products');
		if (data) {
      this.localStorageClear();
			setTimeout(() => location = '/', 2000);
		} else {
			setTimeout(() => location = '/history', 2000);
		}
	}
  simpleClearCart = () => {
    this.setState({productsInCart: []});


		localStorage.removeItem('products');
    localStorage.removeItem('freeProdsInCart');

  }
  signOut = (user) => {
    if(this.state.productsInCart.length==0 && user == "agentForUser"){
      this.localStorageClear(user);
    }else{
      SweetAlert({
        title: 'האם אתה בטוח?',
        text: 'כל העסקאות והמוצרים מהעגלה יימחקו.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22b09a',
        cancelButtonColor: '#d80028',
        confirmButtonText: 'אשר',
        cancelButtonText: 'בטל'
      }).then(function(res) {
        if (res.value) {
          this.localStorageClear(user);
        }
      }.bind(this)).catch(SweetAlert.noop);
    }
	}
  localStorageClear = (isAgent) => {
    let tmpLocalStorage = JSON.stringify(localStorage);
    let siteVer = localStorage.siteVer;


    localStorage.clear();
    tmpLocalStorage = JSON.parse(tmpLocalStorage);
    if(tmpLocalStorage.agent && isAgent!="agent"){
      localStorage.setItem('agent', tmpLocalStorage.agent);
      localStorage.setItem('agentExId', tmpLocalStorage.agentExId);
      localStorage.setItem('agentName', tmpLocalStorage.agentName);
      localStorage.setItem('agentToken', tmpLocalStorage.agentToken);
      localStorage.setItem('sessionId', tmpLocalStorage.sessionId);
    }
    tmpLocalStorage.notifications ? localStorage.setItem('notifications', tmpLocalStorage.notifications) : null;
    tmpLocalStorage.logMail ? localStorage.setItem('logMail', tmpLocalStorage.logMail) : null;
    tmpLocalStorage.logPass ? localStorage.setItem('logPass', tmpLocalStorage.logPass) : null;

    localStorage.siteVer = siteVer;

    if(isAgent=="agentForUser"){
      this.setState({productsInCart:[],user:false});
    }else{
      setTimeout(() => location.reload(), 200);
    }


  }
  addToCart = (product, id, saleProdObj) => {

    let unitChosen = 0;
    if(parseFloat(product.PackQuan)!=1 && product.Unit=='0'){
      unitChosen = 1;
    }else if(parseFloat(product.PackQuan)==1 && product.Unit=='0'){
      unitChosen = 0;
    }else if(parseFloat(product.PackQuan)!=1 && product.Unit=='2'){
      unitChosen = 1;
    }else if(parseFloat(product.PackQuan)==1 && product.Unit=='2'){
      unitChosen = 0;
    }
		let newProduct = {
			Id: id,
			//Quantity: parseInt(product.PackQuan),
      Quantity: 1,
			Products: product,
			CategoryId: product.CategoryId,
      //UnitChosen: saleProdObj ? saleProdObj.Val : product.Unit == "2" ? 2 : 0
      UnitChosen: unitChosen
		};

		let productsSet = [];
		localStorage.products ?	productsSet = JSON.parse(localStorage.getItem('products')) : null;
		productsSet.push(newProduct);
		localStorage.setItem('products', JSON.stringify(productsSet));

    //this.updateTmpProducts();
		if (window.innerWidth > 1000) {
			this.setState({productsInCart: productsSet});
		} else {
			this.setState({productsInCart: productsSet});
		}
    this.setState({headerPop: true});
    setTimeout(() => {
      this.setState({headerPop: false});
    }, 3000);
    if(window.innerWidth > 1000){
      setTimeout(() => {
        $("#input_"+id).focus();
      }, 200);
      setTimeout(() => {
        $("#input_"+id).select();
      }, 300);
    }


	}
  increaseCart = (id, isCart) => {
		let productsSet = JSON.parse(localStorage.getItem('products'));
		productsSet.find(item => item.Id == id).Quantity += 1;
		localStorage.setItem('products', JSON.stringify(productsSet));

		if (window.innerWidth > 1000 && isCart!="cart") {
			this.setState({productsInCart: productsSet});
		} else {
			this.setState({productsInCart: productsSet});
		}
	}
  decreaseCart = (id, isCart) => {
		let productsSet = JSON.parse(localStorage.getItem('products'));

	  productsSet.find(item => item.Id == id).Quantity -= 1;
		localStorage.setItem('products', JSON.stringify(productsSet));
		if (window.innerWidth > 1000 && isCart!="cart") {
			this.setState({productsInCart: productsSet});
		} else {
			this.setState({productsInCart: productsSet});
		}
	}
  deleteProduct = (element, isCart) => {
		let productsInCart = this.state.productsInCart.filter(item => item.Id != element);
		if (window.innerWidth > 1000 && isCart!="cart") {
			this.setState({productsInCart});
		} else {
			this.setState({productsInCart});
		}
		localStorage.products = JSON.stringify(productsInCart);
    localStorage.freeProdsInCart ? localStorage.removeItem('freeProdsInCart') : null;

	}
  changeQuantity = (id, isCart, e) => {

    if(isCart!="cart"){
      e = isCart;
    }
		let productsSet = JSON.parse(localStorage.getItem('products'));
    let value="";

    let prodObj = productsSet.filter(item => item.Id == id);
    if(e.target.value.includes(".") && prodObj[0].Products.Unit == "2" && prodObj[0].UnitChosen == 2 && (!this.state.user || this.state.user.Type == 2)){
      if(e.target.value.split(".")[1] == ".5"){
        value = parseFloat(e.target.value);
      }else if(e.target.value.split(".")[1]==""){
        value = e.target.value + "5";
        value = parseFloat(value);
      }else{
        value = parseFloat(e.target.value).toFixed(1);
      }

    }else{
      value = parseInt(e.target.value);
    }
		if (String(e.target.value) == "-1") {
		} else {

			productsSet.find(item => item.Id == id).Quantity = value;
			localStorage.setItem('products', JSON.stringify(productsSet));
      if (window.innerWidth > 1000  && isCart!="cart") {
			  this.setState({productsInCart: productsSet});
      }else{
        this.setState({productsInCart: productsSet});
      }

		}
    this.getPrice(productsSet);

	}
  updateTmpProducts = async() => {

    let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;

    let localProducts = JSON.parse(localStorage.products);
    let tmpProducts = [];
    let obj;
    localProducts.map((item) => {
      obj = {'Makat': item.Products.CatalogNumber,
            'Quantity': item.Quantity,
            'UnitChosen': item.UnitChosen}
      tmpProducts.push(obj);
    })
    tmpProducts = JSON.stringify(tmpProducts);

    const valAjax = {
      funcName: 'updateTmpProducts',
      point: 'new-api/products_edit',
      val: tmpProducts,
      userId: user.Id
    };

    try {
      const data = await this.ajax(valAjax);

    } catch(err) {
      console.log('connection error catsview');
    }

  }
  avoidNullInCart = (id, e) => {
    if (e.target.value == 0) {
      this.deleteProduct(id);
    }
  }
  changeUnit = (id, unitChosen) => {
    let productsSet = JSON.parse(localStorage.getItem('products'));
    productsSet.map((item) => {
      if(item.Id == id && item.UnitChosen == 2 && unitChosen == 1){
        item.Quantity = Math.ceil(item.Quantity);
        item.UnitChosen = unitChosen;
      }else if(item.Id == id){
        item.UnitChosen = unitChosen;
      }
    });
    localStorage.setItem('products', JSON.stringify(productsSet));
    this.setState({productsInCart: productsSet});
    this.getPrice(productsSet);
  }
  getProducts = () => {
    if(localStorage.getItem('products')!="undefined"){
		  this.setState({productsInCart: JSON.parse(localStorage.getItem('products'))});
    }
	}
  setMatch = (params) => {
		this.setState({
			matchId: params.Id,
			matchSubId: params.SubId
		});
	}
  toggleMenu = () => {
		this.setState({toggleMenu: !this.state.toggleMenu});
	}
	addToState = (stateName, val) => {
		let state = this.state[stateName];
		state.push(val);
		this.setState({[stateName]: state});
	}
	updateState = (stateName, id, paramName, val) => {
		let state = this.state[stateName];
		if (state.find(x=> x.Id == id)) {
			state.find(x=> x.Id == id)[paramName] = val;
			this.setState({[stateName]: state});
		}
	}
	deleteFromState = (stateName, id) => {
		let state = this.state[stateName].filter((element, index) => {	return element.Id != id	});
		this.setState({[stateName]: state});
	}
	getCategories = async() => {
    let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {};
		user ? val.priceFor = user.PriceFor : null;
    user ? val.userType = user.Type : null;
    user ? val.PriceListBase = user.PriceListBase : null;
    user ? val.userId = user.Id : null;
    const valAjax = {
      funcName: 'OnLoad',
      point: 'data',
      val: val
    };

    try {
      const data = await this.ajax(valAjax);
      let tmpDefaults = JSON.parse(data.defaults);
      let tmpmainGlobals = JSON.parse(data.mainGlobals).mainGlobals;
      tmpDefaults.statosMail = tmpmainGlobals.statosMail;
      let areaCode = false;

      if(data.myUser){
        let newUser = data.myUser;
        this.setState({user: data.myUser});
        localStorage.setItem('user', JSON.stringify(data.myUser));
      }

			this.setState({
				categories: JSON.parse(data.categories),
        defaults: tmpDefaults
			});
    } catch(err) {
      console.log('connection error catsview');
    }

	}
  
  updateDefaults = (tmpDefaults) =>{
    this.setState({defaults: tmpDefaults})
  }
  getPrice = (element, lowPrice) => {
		let price = 0;

    if (lowPrice && lowPrice.length) {
			if (lowPrice[0].SpecialPrice) {
				price = lowPrice[0].SpecialPrice;
			} else {
				if (lowPrice[0].Discount) {
					let percent = lowPrice[0].Discount;
					let p = lowPrice[0].Price;
					price = (p - ((p * percent) / 100)).toFixed(2);
				} else {
					price = lowPrice[0].Price;
				}
			}
		} else {
      if (element.Discount) {
        let percent = element.Discount;
        let p = element.Price;
        price = (p - ((p * percent) / 100)).toFixed(2);
      } else {
        price = element.Price;
      }
		}

		return price;
	}
  glbVatCalc = (products) => {
    if(products.Vat){
      return true;
    }else{
      return false;
    }
  }

  toggleSearch = (state) => {
    this.setState({searchMode: state});
  }

	render() {
		return (
      <UserContext.Provider value={this}>
        <CartProvider>
        <CategoriesProvider>
          <ProductsProvider>
            <OrdersProvider>
              <MachinesProvider>
            <BasicRouter {...this} />
            </MachinesProvider>
            </OrdersProvider>
          </ProductsProvider>
        </CategoriesProvider>
        </CartProvider>
			</UserContext.Provider>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
