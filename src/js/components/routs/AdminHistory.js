import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SweetAlert from 'sweetalert2';
import Calendar from 'react-calendar';

export default class AdminHistory extends Component {
	constructor(props){
		super(props);
		this.state = {
			date: new Date(),
      toDate: new Date(),
			items: [],
			tempItems: [],
			product: false,
			showCalendar: false,
			preload: false,
			search: false,
      calType:'',
      orderState: 0,
      toShow: 30,
      currentPage: 1,
      preload: false,
      userInfo: null


		}
		this.getItems = this.getItems.bind(this);
		this.selectDate = this.selectDate.bind(this);
		this.sortItems = this.sortItems.bind(this);
	}
	componentDidMount(){
    let tmpDate = new Date();
    let firstDay = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate());
    this.setState({date:firstDay});

		let date = firstDay.toLocaleDateString('ru-RU').split('.').join('/');
    let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
		this.getItems(date,toDate,this.state.orderState);
		setTimeout(() => window.scrollTo(0, 0), 200);
	}
  setActiveOrder(id){
		this.setState({activeOrder: this.state.activeOrder == id ? false : id});
	}
  setPage(currentPage){
		this.setState({currentPage});
		window.scrollTo(0, 0);
	}

	showInfo(element){
		let html = ``;

		if (element.AddressJson) {
			html = `
			<div class="flex-container info-user">
				<div class="col-lg-4">
					<p>שם מלא</p>
					<p>מייל</p>
					<p>ת.ז.</p>
					<p>טלפון</p>
					<p>עיר</p>
					<p>שם הרחוב</p>
          <p>הערה:</p>
				</div>
				<div class="col-lg-8">
					<p>${element.UserName}</p>
					<p>${element.Mail}</p>
					<p>${element.Hp}</p>
					<p>${element.AddressJson.tel}</p>
					<p>${element.AddressJson.town}</p>
					<p>${element.AddressJson.streetName}</p>
          <p>${element.AddressJson.streetName}</p>
          <p>${element.OrdComment}</p>
					<p></p>
				</div>
			</div>
			`;
		} else {
			html = `
			<div class="flex-container info-user">
				<div class="col-lg-4">
					<p>שם מלא</p>
					<p>מייל</p>
					<p>טלפון</p>
          <p>מס' לקוח</p>
					<p>ח.פ/ע.מ</p>
          <p>הערה:</p>
				</div>
				<div class="col-lg-8">
					<p>${element.UserName}</p>
					<p>${element.Mail}</p>
					<p>${element.Tel}</p>
          <p>${element.ExtId}</p>
					<p>${element.Hp}</p>
          <p>${element.OrdComment}</p>
				</div>
			</div>
			`;
		}
		SweetAlert({
			html: html,
			showConfirmButton: false,
			showCloseButton: true
		}).catch(SweetAlert.noop);
	}
	restoreOrder(element){

    SweetAlert({
			title: 'שדר הזמנה מחדש?',
			type: 'success',
			showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'אשר',
      cancelButtonText: 'בטל'
		}).then(function (element,res) {
      if (res.value) {
        this.setState({preload: true});
    		let val = {
    		 	order: JSON.stringify(element)
    		};

    		$.ajax({
    			url: globalServer + 'new-api/rewrite_order.php',
    			type: 'POST',
    			data: val,
    		}).done(function(data) {
          if(JSON.parse(data).result = "success"){
      			SweetAlert({
      				title: 'הזמנה נשלחה בהצלחה',
      				type: 'success',
      				showConfirmButton: false,
      				timer: '4000'
      			}).catch(SweetAlert.noop);
          }else{
            SweetAlert({
      				title: 'לא ניתן לשחזר הזמנה',
      				type: 'info',
      				showConfirmButton: false,
      				timer: '4000'
      			}).catch(SweetAlert.noop);
          }
    			this.setState({preload: false});
    		}.bind(this)).fail(function() {	console.log("error"); });
      }
    }.bind(this,element)).catch(SweetAlert.noop);
	}
	sortItems(e){
		let val = e.target.value.toLowerCase();
		this.setState({search: val});

		let items = this.state.items.filter(item => item.UserName ? item.UserName.toLowerCase().includes(val) : null);

    this.setState({tempItems:items});
	}
	calendarChange(date){
    if(this.state.calType=='from'){
		    this.setState({ date, showCalendar: false });
        this.getItems(date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
    }else if(this.state.calType=='to'){
        this.setState({ toDate: date, showCalendar: false });
        this.getItems(this.state.date.toLocaleDateString('ru-RU').split('.').join('/'),date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
    }
	}
	selectDate(calType){
		this.setState({showCalendar: true,calType});
	}
	getItems = async(date,toDate,orderState)=>{

    this.setState({preload:true});

    let tmpDate = date.split("/");
    tmpDate = tmpDate[2]+"-"+tmpDate[1]+"-"+tmpDate[0];
    let tmpToDate = toDate.split("/");
    tmpToDate = tmpToDate[2]+"-"+tmpToDate[1]+"-"+tmpToDate[0];

		let val = {
			token: localStorage.token,
			role: localStorage.role,
			date: tmpDate,
      toDate:tmpToDate,
      orderState:orderState
		};


    const valAjax = {
      funcName: '',
      point: 'new-api/admin-history',
      token: localStorage.token,
      role: localStorage.role,
      val: val
    };


    try {
      const data = await this.props.ajax(valAjax);

      let items = JSON.parse(data);

      items.map(item => {
        item.Products = JSON.parse(item.Products).HistoryDetaileds;
        item.AddressJson ? item.AddressJson = JSON.parse(item.AddressJson)[0] : null;
      });


      this.setState({items, tempItems: items, search: false, preload:false});
    } catch(err) {
      console.log('connection error getItems');
      this.setState({preload:false});
    }

	}
  tabClickFunc(tabIndex){
    this.setState({orderState:tabIndex});
    let date = this.state.date.toLocaleDateString('ru-RU').split('.').join('/');
    let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
		this.getItems(date,toDate,tabIndex);
  }

  deleteOrder(element){
    SweetAlert({
				title: 'מחק הזמנה?',
				type: 'success',
				showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'אשר',
        cancelButtonText: 'בטל'
			}).then(function (element,res) {
        if (res.value) {
          this.setState({preload: true});


          const valAjax = {
            funcName: '',
            point: 'new-api/removeOrder',
            ordId: element.Id
          };

          this.deleteOrderFunc(valAjax, element);

        }
      }.bind(this,element)).catch(SweetAlert.noop);

	}
  deleteOrderFunc = async(valAjax, element) =>{
    try {
      const data = await this.props.ajax(valAjax);

      SweetAlert({
        title: 'הזמנה נמחקה בהצלחה',
        type: 'success',
        showConfirmButton: false,
        timer: '4000'
      }).catch(SweetAlert.noop);

      let items = this.state.items.filter(item => item.Id != element.Id);
      this.setState({items, tempItems:items, preload: false});

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }
  }
  changeMoreVal(id,val){
    let items = this.state.items;
    //userListAll
    items.find(item => item.Id == id).More = val;
    this.setState({items})
  }
  unsetMore(itemId){
    let items = this.state.items;
    items.find(item => item.Id == itemId).More = false;

    this.setState({items})
  }
	render(){
    let pagination = [...Array(Math.ceil(this.state.items.length / this.state.toShow)).keys()];

		return (
      <div className="page-container history admin-history">
        <div className="admin-history-sub">
  				{this.state.preload ?
  					<div className="spinner-wrapper">
  						<div className="spinner">
  							<div className="bounce1"></div>
  							<div className="bounce2"></div>
  							<div className="bounce3"></div>
  						</div>
  					</div>
  				: null}
  				<h1 className="title">היסטוריית הזמנות</h1>
  				<Calendar
  					onChange={(date) => this.calendarChange(date)}
  					value={this.state.date}
  					calendarType="Hebrew"
  					locale="he-IL"
  					className={this.state.showCalendar ? 'active' : null}
  				/>
          <div className="for-calendar flex-container">
            <div className="flex-container right-side-header col-lg-7">
              <div className="cal-cls  right-side-comp">
                <div className="open-calendar">
                  <p className="inline-cls">מתאריך</p>
                  <button className="inline-cls" onClick={this.selectDate.bind(this,'from')}>
                    <img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
                    <span>{this.state.date.toLocaleDateString('he-IL').split('.').join('/')}</span>
                  </button>
                </div>
              </div>
              <div className="cal-cls  right-side-comp">
                <div className="open-calendar">
                  <p className="inline-cls">לתאריך</p>
                  <button className="inline-cls" onClick={this.selectDate.bind(this,'to')}>
                    <img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
                    <span>{this.state.toDate.toLocaleDateString('he-IL').split('.').join('/')}</span>
                  </button>
                </div>
              </div>

              <div className="search-cls  right-side-comp">
                <div className="search">
                  <input
                    type="text"
                    value={this.state.search ? this.state.search : ''}
                    onChange={this.sortItems}
                    placeholder="חפש שם לקוח"
                  />
                  {!this.state.search ?
                    <img src={globalFileServer + 'icons/search-gray.svg'} alt=""/>
                  :
                  <img onClick={() => this.setState({search: false, tempItems: this.state.items})} src={globalFileServer + 'icons/close.svg'} alt=""/>
                  }
                </div>
              </div>
            </div>
            <div className="flex-container left-side-header col-lg-5">
              <ul className="filter-ul" style={{backgroundImage: 'url(' + globalFileServer + '/icons/filter.svg)'}}>
              </ul>
            </div>
          </div>

  				<div className={this.state.showCalendar ? 'container active' : 'container'}>
            <div className="items">
              <div className="heading">
                <div className="flex-container">
                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p></p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>#</p>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>שם לקוח</p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>תאריך</p>
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>זמן</p>
                    </div>
                  </div>

                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>סה״כ</p>
                    </div>
                  </div>

                  <div className="col-lg-1">
                    <div className="wrapp info">
                      <p>חיוב</p>
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="wrapp info">
                      <p>הערה</p>
                    </div>
                  </div>
                  <div className="col-lg-1 info">
                    <div className="wrapp">
                      <p>פעולות</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="body">
                {!this.state.tempItems.length ? <h1 className="no-products">לא קיימות הזמנות</h1> : null}
                {this.state.tempItems.map((element, index) => {
                  if (index < this.state.toShow * this.state.currentPage && index >= (this.state.currentPage - 1) * this.state.toShow) {
                    return(
                      <div key={index} className={this.state.activeOrder == element.Id ? "item active" : "item"}>
                        <div className="flex-container body-main-cls">
                          <div className="col-lg-1 col-drop" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              {this.state.activeOrder == element.Id ?
                                <img src={globalFileServer + 'icons/up-purple.svg'} alt=""/>
                                :
                                <img src={globalFileServer + 'icons/down-purple.svg'} alt=""/>
                              }
                            </div>
                          </div>
                          <div className="col-lg-2 col-id">
                            <div className="wrapp">
                              <p>{element.OrdExtId ? element.OrdExtId : element.Id}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-name">
                            <div className="wrapp">
                              <p>{element.UserName}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-date">
                            <div className="wrapp">
                              <p>{element.OrderDate}</p>
                            </div>
                          </div>
                          <div className="col-lg-1 col-time">
                            <div className="wrapp">
                              <p>{element.Date.split("| ")[1].substring(0, 5)}</p>
                            </div>
                          </div>

                          <div className="col-lg-1 col-total">
                            <div className="wrapp">
                              <p className="price">{(parseFloat(element.Total)).toFixed(1)}</p>
                            </div>
                          </div>

                          <div className="col-lg-1 col-approved">
                            {element.TranzillaOrder ?
                              <div>
                                {element.TranzillaStatus == "Payed" ?
                                  <div className="wrapp img">
                                    <p className="Active">שולם</p>
                                  </div>
                                :null}
                                {element.TranzillaStatus == "Denied" ?
                                  <div className="wrapp img">
                                    <p>סורב</p>
                                  </div>
                                :null}
                                {element.TranzillaStatus == "Token" ?
                                  <div className="approve-btn-1" >
                                    <p>ממתין</p>
                                  </div>
                                :null}
                              </div>
                            :
                              <div className="approve-btn-1" >
                                <p className="Active">שוטף</p>
                              </div>

                            }
    											</div>
                          <div className="col-lg-1 col-info">
                            <div className="wrapp">
                              {element.OrdComment ?
                                <div className="img" >
                                  <img className="info-icon-img"  onClick={() => this.setState({userInfo: element.Id})} src={globalFileServer + 'icons/info.svg'}/>
                                  {this.state.userInfo == element.Id ?
      															<div className="user-info-wrapp">
      																<div className="popup-contant">
                                        <div className="popup-contant-header flex-container">
                                          <div className="col-lg-10" >
                                            <p>מידע</p>
                                          </div>
                                          <div className="close-popup col-lg-2">
                                            <div className="close-popup-cont" onClick={() => this.setState({userInfo: false})}>
                                              <img src={globalFileServer + 'icons/close_purple.svg'} />
                                              </div>
                                          </div>
                                        </div>
                                        <div className="all-row-cont">
                                          <div className="flex-container row-cont">
                                            <div className="col-lg-4 title">
                                              <p>שם הלקוח</p>
                                            </div>
                                            <div className="col-lg-8 value">
                                              <p>{element.UserName}</p>
                                            </div>
                                          </div>
                                          {element.Hp ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>ח.פ / ע.מ</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Hp}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.ExId ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>מס' לקוח</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.ExtId}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.Mail ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>שם משתמש</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Mail}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.AddressJson ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>כתובת</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.AddressJson.address}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.OrdComment ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>הערה</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.OrdComment}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.Tel ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>טלפון</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Tel}</p>
                                              </div>
                                            </div>
                                          :null}
                                        </div>
      																</div>
      															</div>
      														: null}
                                </div>
                              :null}
                            </div>
                          </div>
                          {/*
                          <div className="col-lg-1 restore-btn">
    												<div className="wrapp img" onClick={this.restoreOrder.bind(this, element)}>
    													<img src={globalFileServer + 'icons/restore.svg'} />
    												</div>
    											</div>
                          */}
                          <div className="col-lg-1 more">
                            <div className="wrapp" >
                              <img src={globalFileServer + 'icons/more.svg'} onClick={this.changeMoreVal.bind(this,element.Id,!element.More)}/>
                            </div>
                            {element.More ?
                              <div className="more_cont">
                                <div className="more_cont-header flex-container">
                                  <div className="col-lg-10" >
                                    <p></p>
                                  </div>
                                  <div className="close-popup col-lg-2">
                                    <div className="close-popup-cont" onClick={this.unsetMore.bind(this,element.Id)}>
                                      <img src={globalFileServer + 'icons/close_purple.svg'} />
                                      </div>
                                  </div>
                                </div>

                                <div className="flex-container row" onClick={this.deleteOrder.bind(this,element)}>
                                  <div className="col-lg-2">
                                    <img src={globalFileServer + 'icons/wheel1.svg'} />
                                  </div>
                                  <div className="col-lg-10">
                                    <p>מחק הזמנה</p>
                                  </div>
                                </div>

                              </div>
                            :null}
                          </div>
                        </div>
                        <div className={this.state.activeOrder == element.Id ? "products active" : "products"}>
                          <div className="prod-heading">
                            <div className="flex-container">
                              <div className="col-lg-1 head-drop-col">
                                <div className="wrapp">
                                  <p></p>
                                </div>
                              </div>
                              <div className="col-lg-4 head-title-col">
                                <div className="wrapp title">
                                  <p>כותרת</p>
                                </div>
                              </div>
                              <div className="col-lg-1 head-quan-col">
                                <div className="wrapp">
                                  <p>כמות</p>
                                </div>
                              </div>
                              <div className="col-lg-2 head-sum-col">
                                <div className="wrapp">
                                  <p>מחיר</p>
                                </div>
                              </div>

                            </div>
                          </div>
                          {this.props.state.products.length > 0 && element.Products && element.Products.length > 0 ? element.Products.map((el, ind) => {

                            //let image = this.props.state.images.length ? this.props.state.images.filter(item => item == el.CatalogNum) : [];

                            return(
                              <div key={ind} className="product">
                                <div className="flex-container row-cls">
                                  <div className="col-lg-1 col-prod-img">
                                    <div className="wrapp">
                                      <div className="img">
                                      {/*
                                        <img src={el.Extra1 ? globalFileServer + el.Extra1 : globalFileServer + 'placeholder.jpg'} />
                                      */}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-prod-title">
                                    <div className="wrapp title">
                                      <p>{el.ProdName}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-1 col-prod-quan">
                                    <div className="wrapp">
                                      <p>{(el.Quantity).toFixed(2)}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-price">
                                    <div className="wrapp">
                                      <p className="price">
                                        {el.Total}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 col-prod-comment">
                                    <div className="wrapp comment">
                                      <p></p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }):null}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {pagination.length > 1 ?
  						<div className="pagination">
  							<ul>
  								{this.state.currentPage > 1 ?
  									<li onClick={this.setPage.bind(this, this.state.currentPage - 1)}>
  										<img src={globalFileServer + 'icons/right-arrow.svg'} alt="back"/>
  									</li>
  								: null}
  								{pagination.map((element, index) => {
  									let pageN = element + 1;
  									return(
  										<li onClick={this.setPage.bind(this, pageN)} key={index} className={pageN == this.state.currentPage ? 'active' : null}>
  											<span>{pageN}</span>
  										</li>
  									);
  								})}
  								{this.state.currentPage < pagination.length ?
  									<li onClick={this.setPage.bind(this, this.state.currentPage + 1)}>
  										<img src={globalFileServer + 'icons/left-arrow.svg'} alt="next"/>
  									</li>
  								: null}
  							</ul>
  						</div>
  					: null}
  				</div>
        </div>
			</div>
		)
	}
}
