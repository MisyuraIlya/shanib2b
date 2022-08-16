import ReactDOM from "react-dom";
import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import ProductAddToCart from "./productPage/ProductAddToCart";
import Stages from './Stages';

let user;
localStorage.user ? user = JSON.parse(localStorage.user): null;

export default class ShopCart extends Component {
	constructor(props){
		super(props);
		this.state = {
      termsAndConditions: true,
      pickupSelected: false,
      pickupDiscount: 0,
			order: [],
			date: '',
			preload: false,
			discount: 0,
      requestedDate: false,
      comment:"",
      writeOrderMode: "0",
      orderVal:[],
      destCodes:[],
      destCodeChosen:false,
      openSelect:false
		}

	}
	componentDidMount(){
		setTimeout(() => {window.scrollTo(0, 0)}, 100);

    this.getDestCodes();

	}
  componentDidUpdate(prevProps, prevState){
	}

  getDestCodes = async()=>{
    localStorage.user ? user = JSON.parse(localStorage.user) : null;
    let userExId;
    if(user){
      userExId = user.ExId;
    }

    const valAjax = {
      funcName: 'GetAtarim',
      point: 'data',
      exId: userExId
    };

    try {
      const data = await this.props.ajax(valAjax);

      if(data.result == "success"){
        // debugger;
        // if(data.DestCodes.length == 1){
        //   this.setState({destCodeChosen:data.DestCodes[0].Code});
        // }
        this.setState({destCodes: data.DestCodes})
      }
    } catch(err) {
      console.log('connection error order');
    }
  }
	writeOrder = async () => {

    this.setState({preload:true});

    let user;
    let userExId;
    localStorage.user ? user = JSON.parse(localStorage.user) : null;

    if(user){
      userExId = user.ExId;
    }
    let order = [];
    let tempSingle;
    this.props.state.productsInCart.map((item) => {
      tempSingle = {
        Id: item.Id,
        CatalogNumber: item.Products.CatalogNumber,
        Title: item.Products.Title,
        Quantity: item.Quantity,
        UnitChosen: item.UnitChosen,
        PackQuan: item.Products.PackQuan,
      }
      order.push(tempSingle);
    })



//destCodeChosen
    let params = {
      userExId: userExId,
      products: order,
      destCodeChosen: this.state.destCodeChosen
    };

    params = JSON.stringify(params);


    const valAjax = {
      funcName: 'WriteOrder',
      point: 'data',
      params: params
    };


    try {
      const data = await this.props.ajax(valAjax);
      debugger;
			if (data.result == "success" && data.confirmation) {
        this.props.simpleClearCart();
        this.props.history.push('/successPage/' + data.confirmation + "/1");
        this.setState({preload:false});
			} else {
				this.orderError();
			}

    } catch(err) {
      console.log('connection error order');
    }

	}

  orderError = () => {

    this.setState({preload:false});
    SweetAlert({
      title: 'העסקה נכשלה',
      text: 'אנו צרו קשר עם מוקד התמיכה',
      type: 'error',
      showConfirmButton: true
    }).then(function(res) {
      if (res.value) {
        //localStorage.clear();
        location.reload();
      }
    }.bind(this)).catch(SweetAlert.noop);
  }



	error = (textError, type) => {
		SweetAlert({
			title: textError,
			type: type,
			timer: 3000,
			showConfirmButton: false
		}).catch(SweetAlert.noop);
	}

  selectChosen = async (element) => {

    this.setState({destCodeChosen:element.Code, openSelect:false})

  }

	render(){
    let props = Object.assign({}, this.props);
    let totalBasket = 0;
    localStorage.user ? user = JSON.parse(localStorage.user): null;

		return (
			<div className="page-container shop-cart">
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

				<div className="container prods-main-cont">
					<div className="right-cont">
            <div className="right-cont-subcont">
              <div className="first-line-cont">
                <div className= "h1-cont">
                  <h1 className="title">סיכום הזמנה</h1>
                </div>
              </div>
  						<div className="products">
  							<div className="heading">
  								<div className="flex-container heading-subcont">
                    <div className="col-lg-1">
                      <p></p>
                    </div>
                    <div className="col-lg-2">
                      <p></p>
                    </div>
                    <section className="col-lg-7 flex-container section-cls">
    									<div className="col-lg-6">
    										<p>שם פריט</p>
    									</div>
                      <div className="col-lg-2 center">
    										<p>יח' בקרטון</p>
    									</div>
                    </section>
                    <div className="col-lg-2 center">
  										<p>כמות</p>
  									</div>
  								</div>
  							</div>

  							{this.props.state.productsInCart.length ? this.props.state.productsInCart.map((element, index) => {
                  let maam = !this.props.state.user.Type ? 1 : 1;
                  let inCart = [];
                  inCart.push(element);
  								return (
  									<div className="item" key={index}>
											<div className="flex-container item-flex">
												<div className="col-lg-1 delProd-col">
													<div className="wrapper delete">
														<img
															onClick={this.props.deleteProduct.bind(this, element.Id,"cart")}
															src={globalFileServer + 'icons/delete.svg'}
														/>
													</div>
												</div>

												<div className="col-lg-2 img-col">
                          <img className="img" src={globalFileServer + "products/" + element.Products.CatalogNumber + ".jpg"} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
												</div>
                        <section className="col-lg-7 flex-container section-cls">
  												<div className="col-lg-6 title-col">
  													<div className="wrapper title">
  														<p>{element.Products.Title}</p>
                              <p className="catalog">{element.Products.CatalogNumber}</p>

  													</div>
  												</div>
                          <div className="col-lg-2 packQuan-col">
  													<div className="wrapper title center">
                              <p>{parseFloat(element.Products.PackQuan).toFixed(0)}</p>
  													</div>
  												</div>
                        </section>
                        <div className="add-to-cart col-lg-2">
                            <ProductAddToCart
                              inCart={inCart}
                              element={element.Products}
                              {...props}
                            />
                        </div>
											</div>
  									</div>
  								);
  							}) :
  							<h1 className="empty">עגלת הקניות שלך ריקה</h1>
  							}
  						</div>
            </div>

					</div>

				</div>



        {this.props.state.productsInCart.length && this.state.destCodes && this.state.destCodes.length ?
          <div className={this.state.openSelect ? "select active padding" : "select padding"}>
            <div onClick={this.state.openSelect ? () => this.setState({openSelect:false}) : () => this.setState({openSelect:true})} className="headind">
              <p>{this.state.destCodeChosen ? this.state.destCodeChosen : 'בחר אתר'}</p>
              <div className="img">
                <img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
              </div>
            </div>
            <div className={this.state.openSelect ? "masc active" : "masc"}>
              <ul>
                {this.state.destCodes.map((ele,ind) => {
                  return(
                    <li key={ind}>
                      <div className="mask-li-cls" onClick={() => this.selectChosen(ele)}>
                        <span>{ele.Code + ' | ' +ele.CODEDES}</span>
                        <div className="img">
                          <img src={globalFileServer + 'icons/back-select.svg'} alt=""/>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        :null}

        {this.props.state.productsInCart.length && this.state.destCodeChosen ?
          <div className="send-btn-main">
            <div onClick={()=> this.writeOrder()} className="send-btn-subcont">
                <p>שלח הזמנה</p>
            </div>
          </div>
        :null}
			</div>
		)
	}
}
