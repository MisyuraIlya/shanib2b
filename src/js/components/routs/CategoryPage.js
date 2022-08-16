import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import Parallax from './Parallax';
import ProductAddToCart from "./productPage/ProductAddToCart";

import UserContext from '../../UserContext';
import Stages from './Stages';


export default class CategoryPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			products: [],
      tmpProducts:[],
			toShow: 24,
			viewMode: window.innerWidth > 1000 ? false : true,
      selectedProd:[],
      dateNew:"",
      preload: false,
		}
		this.handleScroll = this.handleScroll.bind(this);

	}

	componentDidMount(){

    let products = localStorage.categoryProducts ? JSON.parse(localStorage.categoryProducts) : [];
    if (localStorage.categoryId == this.props.match.params.id && products.length) {
			this.setState({
				products: products,
				toShow: localStorage.toShow
			});
      let scrollVal = localStorage.scrollVal;
      setTimeout(() => {
        window.scrollTo(0, scrollVal);
      }, 50);
      localStorage.removeItem('categoryProducts');
      localStorage.removeItem('categoryId');
      localStorage.removeItem('toShow');
      localStorage.removeItem('scrollVal');
      window.addEventListener('scroll', this.handleScroll, true);

		}
		else {
      let tmpParams = {
  			Id: this.props.match.params.id,
  			SubId: this.props.match.params.subId
  		};

  		this.props.setMatch(tmpParams);
  		this.getProducts(this.props.match.params);
  		setTimeout(() => {
  			window.scrollTo(0, 0);
  			window.addEventListener('scroll', this.handleScroll, true);
  		}, 100);
		}
  }
  componentWillReceiveProps(nextProps){
		if (this.props.match.params.lvl1 != nextProps.match.params.lvl1 || this.props.match.params.lvl2 != nextProps.match.params.lvl2 || this.props.match.params.lvl3 != nextProps.match.params.lvl3) {
			window.scrollTo(0, 0);
      this.getProducts(nextProps.match.params);
		}
	}
	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll, true);
		let tmpParams = {
			Id: false,
			SubId: false
		};
		this.props.setMatch(tmpParams);
    if (location.hash.includes('/cart')) {
			localStorage.setItem('categoryProducts', JSON.stringify(this.state.products));
			localStorage.setItem('categoryId', this.props.match.params.id);
			localStorage.setItem('toShow', this.state.toShow);
		}
	}


	handleScroll(e) {
		var parallax = document.getElementsByClassName("parallax");
		let wh = window.innerHeight
		if (e.currentTarget.pageYOffset + wh > parallax[0].offsetTop) {
			if (this.state.toShow <= this.state.products.length) {
				this.setState({toShow: this.state.toShow + 24});
			}
		}
    localStorage.setItem('scrollVal', e.currentTarget.pageYOffset);
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextProps.match.params.id !== this.props.match.params.id || nextProps.match.params.subId !== this.props.match.params.subId ) {
			this.setState({toShow: 24});
      let tmpParams = {
				Id: nextProps.match.params.id,
				SubId: nextProps.match.params.subId
			};
			this.props.setMatch(tmpParams);
      setTimeout(() => {
				window.scrollTo(0, 0);
			}, 100);
			this.getProducts(nextProps.match.params);
		}
	}
	getProducts = async (param) => {
    this.setState({preload:true});

		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {
      'id': param.subId ? param.subId : param.id,
      'b2cPriceCode': this.props.state.b2cPriceCode,
      'priceNoLogin': this.props.state.priceNoLogin,
      'lvl1id': param.lvl1 ? param.lvl1 : null,
      'lvl2id': param.lvl2 ? param.lvl2 : null,
      'lvl3id': param.lvl3 ? param.lvl3 : null
    };

		user ? val.priceFor = user.Type : null;
    user ? val.priceCode = user.PriceList : null;
    user ? val.userId = user.Id : null;
    user ? val.userExtId = user.ExId : null;
    localStorage.role ? val.admin = true : null;


    const valAjax = {
      funcName: 'ViewItems',
      point: 'data',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
      let products = data.Productss;
      let tmpDistinctVol = [];
      let match;
			products.map(item => {
				item.Price ? item.Price = parseFloat(item.Price) : null;
				item.Discount ? item.Discount = parseFloat(item.Discount) : null;
				item.SpecialPrice ? item.SpecialPrice = parseFloat(item.SpecialPrice) : null;

        match = tmpDistinctVol.filter((ele) => {return ele == item.Code});
        if(!match.length && item.Code != "" && item.Code){
          tmpDistinctVol.push(item.Code);
        }

			});

			this.setState({ products, tmpProducts: products});

      this.setState({preload:false});
    } catch(err) {
      console.log('connection error GetSales');
      this.setState({preload:false});
    }

	}


	render(){
		let parentCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl1)[0];
    let childCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl2)[0];
    let subChildCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl3)[0];

    let props = Object.assign({}, this.props);
    let lang = this.props.state.lang;

		return (

			<div className="page-container category-page">
        <div className={"category-page-sub"}>

          {this.state.preload ?
            <div className="spinner-wrapper">
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
          : null}

          <Stages props={this.props}/>

          <div className="category-cont">
            <div className="category-subcont flex-container">
              {this.props.state.categories.length ? this.props.state.categories.map((item, ind) => {
                return(
                  <div key={ind} className="cat-col col-lg-3">
                    <NavLink to={'/categoryItems/' + item.Id + "/0/0/"}>
                      <p className={item.Id == parseInt(this.props.match.params.lvl1) ? "active" : null}>{item.Title}</p>
                    </NavLink>
                  </div>
                )
              }):null}
            </div>
          </div>


  				{parentCategory ?
  					<Helmet>
  						<title>{parentCategory.Title}</title>
  						<meta name="keywords" content={parentCategory.Title} />
  						<link rel="canonical" href={entry + '/category/' + parentCategory.ParentId + '/' + parentCategory.Id} />
  						<link rel="alternate" href={entry + '/category/' + parentCategory.ParentId + '/' + parentCategory.Id} hreflang="he-il" />
  					</Helmet>
  				: null}



          <div className="category-wrapper">
  					<div id="navFix" className={this.state.viewMode ? "flex-container products-view list-view" : "flex-container products-view"}>
  						{!this.state.tmpProducts.length ? <h1 className="hide-on-desctop no-product">לא קיימים מוצרים</h1> : null}
  						{this.state.tmpProducts.map((element, index) => {
  							let inCart = this.props.state.productsInCart.filter(item => item.Products.CatalogNumber == element.CatalogNumber);
  							let maam = this.props.state.user.Type == 2 ? 1 : 1;
                let type;

                if((inCart.length && !("UnitChosen" in inCart[0])) ||  (inCart.length == 0)){
                  element.Unit == 2 ? type = " לק״ג" : type = " / יח'"
                }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 0)))){
                  type = " / יח'";
                }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1)))){
                  type = " / מארז"
                }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 2)))){
                  type = " / יח'";
                }

                if(index <= this.state.toShow){
                  return(
                    <div key={index} className={element.Unpublished ? "col-lg-12 wrapper-cont unpublished" : "wrapper-cont col-lg-12"}>
  										<div className={!element.ActualQuan ? "wrapper flex-container" : "wrapper disable flex-container"}>
                        <div className="img-cont col-lg-2">
                          <img className="img" src={globalFileServer + "products/" + element.CatalogNumber + ".png"} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
                        </div>
                        <div className={"prod-data-cont col-lg-7"}>
    											<h3 className="p-title">{element.Title}</h3>
                          <p className="p-packquan">{"יח' באריזה: " + element.PackQuan}</p>
                          <p className="p-catalog-num">{'מק״ט: ' + element.CatalogNumber}</p>
                        </div>
                        <div className="add-to-cart col-lg-3">
                            <ProductAddToCart
                              inCart={inCart}
                              element={element}
                              {...props}
                            />
                        </div>
  										</div>
  									</div>
  								);
                }
  						})}
  					</div>
  				</div>
          <Parallax img="parrallax_5.jpg" />

          <div className="goToCart-maincont">
            <NavLink  to="/cart">
              <div className="goToCart-subcont">
                <p className="arrows">{">>"}</p>
                <p>המשך לסיכום</p>
              </div>
            </NavLink>
          </div>
        </div>
			</div>
		)
	}
}
