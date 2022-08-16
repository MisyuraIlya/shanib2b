import ReactDOM from "react-dom";
import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import ProductAddToCart from "./productPage/ProductAddToCart";
import Stages from './Stages';

let user;
localStorage.user ? user = JSON.parse(localStorage.user): null;

export default class Success extends Component {
	constructor(props){
		super(props);
		this.state = {
		    extOrdNum:"0"
		}

	}
	componentDidMount(){

		setTimeout(() => {window.scrollTo(0, 0)}, 100);

	}
  componentDidUpdate(prevProps, prevState){
		if (JSON.stringify( prevProps.state.productsInCart) != JSON.stringify(this.props.state.productsInCart)) {
      user ? this.getUserUpdatedDet() : null;

      this.reducePrice();
		}
		if (JSON.stringify(prevProps.state.productSales) != JSON.stringify(this.props.state.productSales)) {
			this.reducePrice();
		}
	}

	reSign = async (getActiveAddress) => {

    const valAjax = {
      funcName: '',
      point: 'sign_in',
      userName: user.Mail,
      password: user.Password
    };

    try {
      const data = await this.props.ajax(valAjax);
      if (data.result == "success") {
				let user = JSON.parse(data.user);
				localStorage.setItem('user', data.user);
				user.Type ? localStorage.setItem('type', user.Type) : null;
				localStorage.setItem('name', user.Name);
				localStorage.setItem('id', user.Id);
				localStorage.setItem('exId', user.ExId);
				localStorage.setItem('sessionId', data.sessionId);
				localStorage.setItem('token', data.token);

				let address = user.AddressJson;
				if (address) {
					let nAddress = JSON.parse(address);
					this.setState({address: nAddress});
					let tmpAddress = nAddress[nAddress.length - 1];
					getActiveAddress ? this.setActiveAddress(tmpAddress) : null;
				}
			}
			if (data.result == "not-found") {
				let products = localStorage.products;
				localStorage.clear();
				localStorage.setItem('products', products);
				location.reload();
			}
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error getUserUpdatedDet');
    }


	}
  updateUserInfo = async (itemId, text, paramName) => {
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId
		};
    const valAjax = {
      funcName: '',
      point: 'new-update_user_info',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
      this.reSign();
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error updateUserInfo');
    }

	}
	roundTo = () => {
		let toPay = (this.state.price + this.state.deliveryPrice + ((this.state.price * parseFloat(this.props.state.defaults.Maam)) / 100)) - this.state.payed;
		let temp = {
			Price: toPay.toFixed(2),
			Check: false
		}
		if (parseFloat(toPay.toFixed(2)) <= 0.04 && parseFloat(toPay.toFixed(2)) > -0.1) {
			temp.Check = true;
		}
		return temp;
	}
	writeOrder = async (userDetails, order, cardPayment, writeOrderMode) => {

    this.setState({preload:true});


    let user;
    localStorage.user ? user = JSON.parse(localStorage.user) : null;
    order = JSON.stringify(order);

		let params = {userDetails, order, cardPayment};

    params.DeliveryPrice = this.state.deliveryPrice;
    params.PriceNoVat = ((this.state.priceBefore - (this.state.priceBefore*this.state.discount/100)) + this.state.deliveryPrice).toFixed(2);
    params.TotalPrice = ((this.state.priceBefore - (this.state.priceBefore*this.state.discount/100)) + this.state.deliveryPrice + ((this.state.glbVatActive - (this.state.glbVatActive * this.state.discount / 100)) * parseFloat(this.props.state.defaults.Maam) / 100)).toFixed(2);
    this.state.discount ? params.Discount = this.state.discount : null;
    user ? params.ClientName = user.Name : null;
    localStorage.agent ? params.AgentId = localStorage.agent : null;
    localStorage.agent ? params.AgentExtId = localStorage.agentExId : null
    localStorage.agent ? params.ClientName = localStorage.agent : null
    if(localStorage.agent){
      userDetails.Agent = parseInt(localStorage.agent);
    }
    params.Merakez = user.Merakez;

    this.state.requestedDate ? params.RequestedDate = this.state.requestedDate : null;
    this.state.comment ? params.OrdComment = this.state.comment.substring(0, 250) : null;


    if(user){
      params.allUser = JSON.parse(localStorage.user);
    }
    params.orderType= writeOrderMode;
    params.pickupSelected = this.state.pickupSelected;
    if(this.props.state.defaults && this.props.state.defaults.userArea){
      params.pickupSelected = false;
    }else{
      params.pickupSelected = '1';
    }
    //debugger;

    params.b2bPickupDiscount = this.props.state.defaults.b2bPickupDiscount;
    let totalSum = params.TotalPrice;


    params = JSON.stringify(params);

    //debugger;

    const valAjax = {
      funcName: '',
      point: 'new-api/write_order',
      params: params
    };
    try {
      const data = await this.props.ajax(valAjax);
      debugger;
      let dataVal = JSON.parse(data);

			if (dataVal.result == "success") {

        this.OrderSuccess(dataVal);
        this.setState({preload:false});
			} else {
				this.orderError();
			}

    } catch(err) {
      console.log('connection error order');
    }

	}
  OrderSuccess = (data) => {

    this.setState({ preload:false});

    SweetAlert({
      title: "הזמנה נרשמה בהצלחה.",
      type: "success",
      showConfirmButton: false,
      timer: 4000,
    })
      .then(
        function () {
          //localStorage.removeItem('askForSale');
          this.props.simpleClearCart();
          this.props.history.push('/docsHistory');

          let val = {'appIds':data.appIds ,
                      'Message': "התקבלה הזמנה חדשה מ" + this.props.state.user.Name};
          $.ajax({
      			url: globalServer + 'new-api/send_not.php',
      			type: 'POST',
      			data: val
      		}).done(function(data) {
      		}.bind(this)).fail(function() { console.log('error'); });

      		let valMail = {
      			siteName: globalSiteName,
            from: this.props.state.defaults.statosMail,
      			to: this.props.state.defaults.toMail,
      			siteUrl: globalSiteUrl + '/#/admin-history'
      		};
      		$.ajax({
            url: 'https://statos.co/statos_web_mail/send_order_admin.php',
      			type: 'POST',
      			data: valMail,
      			dataType: "json",
      		}).done(function(d) {}.bind(this)).fail(function() { console.log('error'); });


        }.bind(this)
      )
      .catch(SweetAlert.noop);
  };
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
	splitPaymentsPay = (data, isB2b, writeOrderMode) => {


		let user = JSON.parse(localStorage.user);
		let addressJson = this.state.address.length ? this.state.address : null;
		let cardPayment = "";
		let order = [];
    let shippingHandle = this.props.state.defaults.Delivery.filter(item => item.Id == this.state.shippingMethod)[0];

    let userDetails = {
			UserId: user.Id,
			UserExId: user.ExId,
			UserName: user.Name,
			Passport: user.Passport,
			Address: addressJson ? addressJson[0].address : '',
			Town: addressJson ? addressJson[0].town : '',
			Zip: addressJson ? addressJson[0].zip : '',
			Tel: addressJson ? addressJson[0].tel : '',
			Mail: user.Mail,
			Agent: user.AgentId,
			Delivery: !isB2b ? shippingHandle.Code : null
		};


    let price = 0;
    let product;
    let tempSingle;
    let singlePriceNoDiscount = 0;
    let singlePrice = 0;
    let linePrice = 0;
		this.props.state.productsInCart.map((element) => {
      price = this.props.globalPriceCalc(element.Products, element.Quantity, element.UnitChosen)[0];
      product = element.Products;

      if(this.props.state.user.Type == 1){
        if(element.UnitChosen==1){
          singlePriceNoDiscount = (parseFloat(element.Products.Price) * parseInt(element.Products.PackQuan)).toFixed(2)
        }else{
          singlePriceNoDiscount = parseFloat(product.Price).toFixed(2);
        }
        singlePrice = (price.toFixed(2)/parseFloat(element.Quantity)).toFixed(2);
        linePrice = (price).toFixed(2);
      }else{

        if(element.UnitChosen==1){
          if(!product.Vat){
            singlePriceNoDiscount = (parseFloat(element.Products.Price / this.props.state.defaults.MaamDecimal) * parseInt(element.Products.PackQuan)).toFixed(2)
          }else{
            singlePriceNoDiscount = (parseFloat(element.Products.Price) * parseInt(element.Products.PackQuan)).toFixed(2)
          }
        }else{
          if(!product.Vat){
            singlePriceNoDiscount = (parseFloat(product.Price) / this.props.state.defaults.MaamDecimal).toFixed(2);
          }else{
            singlePriceNoDiscount = parseFloat(product.Price).toFixed(2);
          }
        }
        if(!product.Vat){
          singlePrice = (price.toFixed(2) / this.props.state.defaults.MaamDecimal /parseFloat(element.Quantity)).toFixed(2);
        }else{
          singlePrice = (price.toFixed(2)/parseFloat(element.Quantity)).toFixed(2);
        }
        if(!product.Vat){
          linePrice = (price / this.props.state.defaults.MaamDecimal).toFixed(2);
        }else{
          linePrice = (price).toFixed(2);
        }
      }

      tempSingle = {
        Id: product.Id,
        ExtId: product.ExtId,
        CatalogNumber: product.CatalogNumber,
        Title: product.Title,
        Quantity: element.Quantity,
        SinglePrice: singlePrice,
        Price: linePrice,
        UnitChosen: element.UnitChosen,
        BaseUnit: product.Unit,

        PackQuan: element.Products.PackQuan,
        SinglePriceNoDiscount: singlePriceNoDiscount,
        NoVat: product.Vat
      }
      order.push(tempSingle);

		});

    if(this.props.state.user.Type == 2){

      let delPrice = parseFloat(parseFloat(this.state.deliveryPrice)/this.props.state.defaults.MaamDecimal).toFixed(2);

      tempSingle = {
        Id: 999125,
        ExtId: null,
        CatalogNumber: '125',
        Title: 'משלוח',
        Quantity: 1,
        SinglePrice: delPrice,
        Price: delPrice,
        UnitChosen: 0,
        BaseUnit: '0',
        PackQuan: '1',
        SinglePriceNoDiscount: delPrice,
        NoVat: null
      }
      order.push(tempSingle);
    }


    let freeProdsInCart = [];
    localStorage.freeProdsInCart ? freeProdsInCart = JSON.parse(localStorage.getItem('freeProdsInCart')) : null;

    singlePriceNoDiscount = 0;
    freeProdsInCart.map((item) => {
      product = item.Products;
      if(!item.Products.Vat){
        singlePriceNoDiscount = parseFloat(item.Products.Price);
      }else{
        singlePriceNoDiscount = parseFloat(item.Products.Price)/this.props.state.defaults.MaamDecimal;
      }
      tempSingle = {

        Id: item.Id,
        ExtId: item.Products.ExtId,
        CatalogNumber: item.Products.CatalogNumber,
        Title: item.Products.Title,
        Quantity: item.Quantity,
        SinglePrice: 0,
        Price: 0,
        UnitChosen: item.unitChosen,
        BaseUnit: product.Unit,

        PackQuan: item.Products.PackQuan,
        SinglePriceNoDiscount: singlePriceNoDiscount,
        NoVat: item.Products.Vat
      }
      order.push(tempSingle);
    })

    data ? cardPayment = data : null;
		this.writeOrder(userDetails, order, cardPayment, writeOrderMode);
	}
	toPay = (action)=>{
		let user = localStorage.user ? JSON.parse(localStorage.user) : null;
		if (!user || !this.state.termsAndConditions) {
			if (!this.state.termsAndConditions && user) {
				this.error('אנא קרא והסכם לתנאי השימוש', 'error');
			}
			if (!user) {
				$('#signIn').click();
			}
			if (user) {
				if (!user.Id) {
					localStorage.clear();
					location.reload();
				}
			}
		}
		if (user && this.state.termsAndConditions) {
			if (!this.props.state.productsInCart.length) {
				this.props.history.push('/');
			}
			if (this.props.state.productsInCart.length) {
        let totall = ((this.state.priceBefore - (this.state.priceBefore*this.state.discount/100)) + this.state.deliveryPrice + ((this.state.glbVatActive - (this.state.glbVatActive * this.state.discount / 100)) * parseFloat(this.props.state.defaults.Maam) / 100)).toFixed(2);
        if(this.props.state.user.Type){
          let minPrice;
          user.MinPrice ? minPrice = parseFloat(user.MinPrice) : minPrice = this.props.state.defaults.minPriceB2b;
          if(!this.props.state.defaults.userArea){
            minPrice = 0;
          }
          if(totall >= minPrice){
            let writeOrderMode;
            if(action=="pay"){
              this.setState({writeOrderMode: "0"});
              writeOrderMode = '0';
            }else{
              this.setState({writeOrderMode: "1"});
              writeOrderMode = '1';
            }
            this.splitPaymentsPay(false,true,writeOrderMode);
          }else{
            this.error('מינימום הזמנה: ' + minPrice + ' ש״ח', 'error');
          }
        }else{
          if (!this.state.deliveryOption || (this.state.deliveryOption && this.state.address.length)) {
            if(totall >= this.props.state.defaults.minPriceB2c){
              this.payPopup();
            }else{
              this.error('מינימום הזמנה: ' + this.props.state.defaults.minPriceB2c + ' ש״ח', 'error');
            }
          }
          if (this.state.deliveryOption && !this.state.address.length) {
            this.error('אנא בחר כתובת', 'error');
          }
        }
			}
		}
	}
	reducePrice = ()=> {

		let priceArray = [];
    let vatArray = [];
    let noVatArray = [];
    let isVat = false;

		this.props.state.productsInCart.map((element, index) => {
			priceArray.push((this.props.globalPriceCalc(element.Products, element.Quantity, element.UnitChosen))[0]);

      isVat = this.props.glbVatCalc(element.Products);
      if(!isVat){
        vatArray.push(priceArray[priceArray.length-1]);
      }
		});
    //debugger;
		const reducer = (accumulator, currentValue) => accumulator + currentValue;

		let price = 0;
    let priceBefore = 0;

		if (priceArray.length) {
			priceBefore = price = priceArray.reduce(reducer);
			if (localStorage.user) {
				let user = JSON.parse(localStorage.user);
				price = priceArray.reduce(reducer);
				if (this.state.discount) {
					let percent = parseFloat(this.state.discount);
					let p = parseFloat(price);
					let prePrice = (p - ((p * percent) / 100));
					price = prePrice;
					this.setState({discount: this.state.discount});
				}
			}
		}
    let glbVatActive = 0;
    vatArray.length ? glbVatActive = (vatArray.reduce(reducer)).toFixed(2) : null;

    this.setState({price: price, glbVatActive, priceBefore});

	}
	error = (textError, type) => {
		SweetAlert({
			title: textError,
			type: type,
			timer: 3000,
			showConfirmButton: false
		}).catch(SweetAlert.noop);
	}
  getUserUpdatedDet = async () => {

    const valAjax = {
      funcName: '',
      point: 'new-api/getUserUpdatedDet',
      userId: user.Id
    };

    try {
      const data = await this.props.ajax(valAjax);

      if(data.result=="success"){
        localStorage.setItem('user', data.user);

        let tmpUser = JSON.parse(data.user);
        let areaCode;
        let split;
        let daysArr = [];
        let tmpDefaults = this.props.state.defaults;

        if(tmpUser.DispatchingDays){
          areaCode = tmpUser.DispatchingDays;
          let dayObj = [{"Id":"1","Title":"ראשון"},{"Id":"1","Title":"שני"},{"Id":"1","Title":"שלישי"},{"Id":"1","Title":"רביעי"},
                          {"Id":"1","Title":"חמישי"},{"Id":"1","Title":"שישי"},{"Id":"1","Title":"שבת"}];

          if(areaCode.includes(",")){
            split = areaCode.split(",");
            split.map((item) => {
              daysArr.push(dayObj[parseInt(item)-1].Title);
            })
          }else{
            daysArr.push(dayObj[parseInt(areaCode)-1].Title);
          }
          tmpDefaults.userArea = daysArr.join(" , ");
        }else{
          tmpDefaults.userArea = null;
        }

        this.props.updateDefaults(tmpDefaults)

        let discount = JSON.parse(data.user).Discount;
        if(discount){
          this.setState({discount:discount});
        }else{
          this.setState({discount:0});
        }
      }
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error getUserUpdatedDet');
    }

  }
  payPopBtnFunc = (action) => {
    this.splitPaymentsPay(false,true)
  }

	render(){
    let props = Object.assign({}, this.props);

    let totalBasket = 0;
    if(user && user.Type == 1){
      totalBasket = ((this.state.priceBefore - (this.state.priceBefore*this.state.discount/100)) + this.state.deliveryPrice + ((this.state.glbVatActive - (this.state.glbVatActive * this.state.discount / 100)) * parseFloat(this.props.state.defaults.Maam) / 100)).toFixed(2)
    }else{
      totalBasket = ((this.state.priceBefore - (this.state.priceBefore*this.state.discount/100)) + this.state.deliveryPrice).toFixed(2)
    }
    let minPrice = 0;

    localStorage.user ? user = JSON.parse(localStorage.user): null;
    user && user.MinPrice ? minPrice = parseFloat(user.MinPrice) : minPrice = this.props.state.defaults.minPriceB2b;

		return (
			<div className="page-container shop-cart">
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
  									<div className="col-lg-2 center">
  										<p>כמות</p>
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
  								</div>
  							</div>

  							{this.props.state.productsInCart.length ? this.props.state.productsInCart.map((element, index) => {
                  let maam = !this.props.state.user.Type ? 1 : 1;
                  let priceCalcFunc = this.props.globalPriceCalc(element.Products, element.Quantity, element.UnitChosen);
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
                              <p>{element.Products.CatalogNumber}</p>

  													</div>
  												</div>
                          <div className="col-lg-2 packQuan-col">
  													<div className="wrapper title center">
                              <p>{parseFloat(element.Products.PackQuan).toFixed(2)}</p>
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
              <div className="send-btn-main">
                <div className="send-btn-subcont">
                    <p>שלח הזמנה</p>
                </div>
              </div>
            </div>
					</div>

				</div>
			</div>
		)
	}
}
