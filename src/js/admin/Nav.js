import React, { Component, Fragment, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import Autosuggest from 'react-autosuggest';
import SweetAlert from 'sweetalert2';
// import SyncPop from './header/SyncPop';


const sidebarLight = [
  /*
	{
		Title: 'פרופיל אישי',
		Link: '/profil',
		Img: 'profil.svg'
	},

	{
		Title:'כרטסת',
		Link: '/docs',
		Img: 'list.svg',
		Password: false
	},
*/
	{
		Title:'היסטוריית הזמנות',
		Link: '/history',
		Img: 'cart.svg',
		Password: false
	}
  /*,
	{
		Title:'החזרות',
		Link: '/returns',
		Img: 'returns.svg',
		Password: false
	}*/
];
const sidebarLightb2c = [
	{
		Title: 'פרופיל אישי',
		Link: '/profil',
		Img: 'profil.svg'
	},
	{
		Title:'הזמנות אונליין',
		Link: '/history',
		Img: 'cart.svg',
		Password: false
	}

];
const sidebarAdmin = [
/*  {
    Title: 'שיוך קטגוריות',
    Link: '/category-build/0',
    Img: 'list.svg',
    Password: false
  },*/
  {
    Title: 'ניהול מוצרים',
    Link: '/category-edit/0/0',
    Img: 'nav_prod.svg',
    Password: false
  },
	{
		Title: 'לקוחות',
		Link: '/clients',
		Img: 'clients.svg',
		Password: false,
    Pop: false
	}/*,
	{
		Title: 'אזורי חלוקה',
		Link: '/gis',
		Img: 'gps.svg',
		Password: false,
    Pop: false
	}*/,
	{
		Title: 'הודעות פרסומיות',
		Link: '/notification',
		Img: 'mail.svg',
		Password: false,
    Pop: false
	},
  {
		Title: 'סוכנים',
		Link: '/agents',
	 	Img: 'agent.svg',
	 	Password: false
	 },
  /*{
		Title: 'מחלקות',
		Link: '/deptEdit',
		Img: 'department.svg',
		Password: false
	},*/
  {
		Title: 'ניהול מלקטים',
		Link: '/employee',
		Img: 'employees.svg',
		Password: false
	},
  {
    Title: 'ליקוט',
    Link: '/collector-step-three',
    Img: 'box.svg',
    Password: false
  },
	{
		Title: 'הזמנות',
		Link: '/admin-history',
		Img: 'cart.svg',
		Password: false,
    Pop: false
	},/*
  {
	 	Title: 'מבצעים',
	 	Link: '/admin-sales',
	 	Img: 'sales.svg',
	 	Password: false,
    Pop: false
	},
  {
	 	Title: 'מידע',
	 	Link: '/admin-info',
	 	Img: 'info.svg',
	 	Password: false,
    Pop: false
	}/*,
	{
		Title: 'עדכון מערכת',
		Link: '/admin-history',
		Img: 'sync.svg',
		Password: false,
    Pop: true
	}*/
];
const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
	<div className="hello">
    <p className='title'>{suggestion.Name}</p>
    <p>{'מס: ' + suggestion.ExId}</p>
    {suggestion.PriceList ?
      <p>{'מחירון: ' + suggestion.PriceList}</p>
    :null}
    {suggestion.MigvanTitle ?
      <p>{'מגוון: ' + suggestion.MigvanTitle}</p>
    :null}
    {suggestion.Address ?
      <p>{'כתובת: ' + suggestion.Address}</p>
    :null}
  </div>
);

export default class Nav extends Component {
	constructor(props){
		super(props);
		this.state = {
			users: [],
			allUsers: [],
			preload: false,
			suggestions: [],
			value: '',
			adminPass1: localStorage.adminPass1 ? localStorage.adminPass1 : false,
			adminPass2: localStorage.adminPass2 ? localStorage.adminPass2 : false,
      // syncPop: false,
      SelectedUser:[],
      search:"",
      userInfo: null


		}
		this.getUsers = this.getUsers.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.close = this.close.bind(this);
    this.preload = this.preload.bind(this);


	}
	componentDidMount(){}
  close(){
    // this.setState({syncPop:false});
  }
  preload(){
    this.setState({preload: !this.state.preload});
  }
	setPassword(link, eP){
		SweetAlert({
			input: 'text',
			title: 'Enter Password',
			confirmButtonText: 'Accept',
			showCancelButton: true
		}).then(function (res) {
			if (eP == 1) {
				if (res.value == this.props.state.adminPass1) {
					localStorage.setItem('adminPass1', res.value);
					this.setState({adminPass1: res.value});
					this.props.history.push(link);
					this.props.toggleMenu();
				}
				if (res.value && res.value != this.props.state.adminPass1) {
					SweetAlert({
						title: 'Your password is incorrect',
						type: 'error',
						timer: 3000,
						showConfirmButton: false,
					}).catch(SweetAlert.noop);
				}
			}
			if (eP == 2) {
				if (res.value == this.props.state.adminPass2) {
					localStorage.setItem('adminPass2', res.value);
					this.setState({adminPass2: res.value});
					this.props.history.push(link);
					this.props.toggleMenu();
				}
				if (res.value && res.value != this.props.state.adminPass2) {
					SweetAlert({
						title: 'Your password is incorrect',
						type: 'error',
						timer: 3000,
						showConfirmButton: false,
					}).catch(SweetAlert.noop);
				}
			}
		}.bind(this)).catch(SweetAlert.noop);
	}

	signIn(user) {
    SweetAlert({
			title: 'שם הלקוח: ' + user.Name,
			text: '',
			type: 'success',
			timer: 1300,
			showConfirmButton: false,
		}).then(function () {
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('type', user.Type);
			localStorage.setItem('name', user.Name);
			localStorage.setItem('id', user.Id);
			localStorage.setItem('exId', user.ExId);
      this.props.toggleMenu();
      this.props.AgentLog("in");
      this.props.history.push('/category-page/0/0/he');

			//location.reload();
		}.bind(this)).catch(SweetAlert.noop);
	}
	getUsers = async()=>{
		this.setState({preload: true});

    const valAjax = {
      funcName: '',
      point: 'new-api/get_agent_users',
      token: localStorage.agentToken
    };

    try {
      const data = await this.props.ajax(valAjax);

      this.setState({
        preload: false,
        users: data.Userss,
        allUsers: data.Userss
      });
    } catch(err) {
      console.log('connection error getItems');
      this.setState({preload:false});
    }




	}
	onChange(event, { newValue }) {
		this.setState({	value: newValue	});
    console.log(newValue);
	}
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		let isNumber =  /^\d+$/.test(value);
    //debugger;
		if (isNumber) {
			return inputLength === 0 ? [] : this.state.users.filter(user =>
				user.ExId ? user.ExId.slice(0, inputLength) === inputValue : null
			);
		} else {
			return (
				inputLength === 0 ? [] : this.state.users.filter(user => {
					if (user.Name.split(' ').length > 1) {
            return user.Name.includes(inputValue)
					} else {
						return user.Name.toLowerCase().slice(0, inputLength) === inputValue
					}
				})
			)
		}
	}
	onSuggestionsFetchRequested({ value }) {
		this.setState({	suggestions: this.getSuggestions(value)	});
	}
	onSuggestionsClearRequested() {
		//this.setState({	suggestions: [], value: "" });
	}
	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		if (method == "click" || method == "enter") {
      let users = this.state.users.filter((elem) => { return elem.Id == suggestion.Id });

			this.setState({users: [], value:""});
      this.signIn(users[0]);
		}
	}
  signOut(){
    this.props.history.push('/');
    this.props.toggleMenu();
    this.props.signOut("agentForUser");
  }
  checkNewUser = () => {
    this.setState({preload: true});

    let value = this.state.value;
		let val = {'token': localStorage.agentToken,
                'value': value,
                'action': 'agent_new_user'
              };

		$.ajax({
			url: globalServer + 'b2b_registration.php',
			type: 'POST',
			data: val,
		}).done(function(data) {


      if(data.result=="success"){

        this.setState({users: []});
        this.signIn(data.user);
      }else if(data.result == "already_exists"){
        this.setState({users: []});
        this.signIn(data.user);
      }else{
        SweetAlert({
          title: "מס' לקוח לא קיים",
          type: 'info',
          timer: 3000,
          showConfirmButton: false,
        }).catch(SweetAlert.noop);

      }

			this.setState({
				preload: false
			});

		}.bind(this)).fail(function() {
      console.log("error");
      this.setState({preload: false});
    });
//


  }

  search = (e) =>{

     let value = e.target.value;

     const inputValue = value.trim().toLowerCase();
     const inputLength = inputValue.length;

     let isNumber =  /^\d+$/.test(value);
     let newUsers = [];

     if(inputLength === 0){
       newUsers = []
     }else{
       if (isNumber) {
         newUsers = this.state.allUsers.filter(user => user.ExId ? user.ExId.slice(0, inputLength) === inputValue : null);
       }else{
         newUsers = this.state.allUsers.filter(user => {
          if (user.Name.split(' ').length > 1) {
             return user.Name.toLowerCase().includes(inputValue) || user.Town.toLowerCase().includes(inputValue)
          } else {
            return user.Name.toLowerCase().slice(0, inputLength) === inputValue || user.Town.toLowerCase().slice(0, inputLength) === inputValue
          }
        })
       }
     }

     if(newUsers.length == 0){
       newUsers = this.state.allUsers;
     }
     this.setState({users: newUsers, search: value})

  }

  clearSearch = () =>{
    this.setState({users: this.state.allUsers, search: ""})
  }

  setSelectedUserForInfo = (item) => {
    let selectedUser = [];
    selectedUser.push(item);
    this.setState({SelectedUser: selectedUser})
  }

  selectUser = (user) => {
    this.setState({users: [], value:""});
    this.signIn(user);

  }
	render(){
		let lang = this.props.state.lang;
		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: "שם/מס' לקוח..",
			value,
			onChange: this.onChange
		}

    let mismahType = 'הזמנה';
    if(this.props.state.selectedMode == 1){
      mismahType = 'הזמנה';
    }else if(this.props.state.selectedMode == 2){
      mismahType = 'החזרה';
    }else if(this.props.state.selectedMode == 3){
      mismahType = 'ה.מחיר';
    }
		return (
			<nav id="main" data-class={lang == 'he' ? 'he' : 'ru'} className={this.props.state.toggleMenu ? 'active' : null}>
        <div className="nav-cont" onClick={this.props.toggleMenu}></div>
				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
        {/* {this.state.syncPop ? <SyncPop {...this} /> : null} */}
				{localStorage.agent ?
					<div className="agent">
            {!this.state.users.length ?
              <img onClick={this.props.toggleMenu.bind(this)} className="close-cart" src={globalFileServer + 'icons/cross-grey.svg'} />
            :null}
        		{this.state.users.length ?
							<Fragment>
								<div className="user-search">
                  {this.state.SelectedUser.length == 0 ?

                    <div className="search">
                      <input
                        onChange={this.search}
                        value={this.state.search}
                        type="text"
                        placeholder="חיפוש..."
                      />
                      {this.state.search ?
                        <img className="close" onClick={this.clearSearch} src={globalFileServer + "icons/close.svg"} alt=""/>
                      :
                      <img src={globalFileServer + "icons/search.svg"} alt=""/>
                      }
                    </div>

									:
                  <div onClick={() => this.setState({ SelectedUser:[]})} className="back">
										<img src={globalFileServer + 'icons/back-new.svg'} />
									</div>
									}
								</div>
								<div className="user-list">
                  {this.state.users && this.state.users.length > 0 ? this.state.users.map((item, ind) => {
                      return(
                        <div key={ind} className="row-cont-main">
                          <div  className="row-cont" onClick={()=> this.selectUser(item)}>
                            <p className='title'>{item.Name}</p>
                            <p className=''>{'מס לקוח: ' + item.ExId}</p>
                            {item.Address ?
                              <p>{'כתובת: ' + item.Address}</p>
                            :null}
                            {item.Town ?
                              <p>{'עיר: ' + item.Town}</p>
                            :null}
                          </div>
                          <div className="more-trigger">
                            <img className="info-icon-img"  onClick={()=> this.setSelectedUserForInfo(item)} src={globalFileServer + 'icons/info.svg'}/>
                          </div>
                        </div>
                      )
                  }):null}
								</div>
                {this.state.SelectedUser && this.state.SelectedUser.length > 0 ?
                  <div className="user-info above-list">
                    <div className="gobackBtn">
                      <img className="close" onClick={()=> this.setState({SelectedUser:[]})} src={globalFileServer + "icons/close.svg"} alt=""/>
                    </div>

                    <h2 className="title-cont">{this.state.SelectedUser[0].Name}</h2>

                    <div className="flex-container">
                      <div className="col-lg-6">
                        <p>מס' לקוח:</p>
                      </div>
                      <div className="col-lg-6">
                        <p>{this.state.SelectedUser[0].ExId}</p>
                      </div>
                    </div>
                    {this.state.SelectedUser[0].PriceList ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>מחירון:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].PriceList}</p>
                        </div>
                      </div>
                    :null}
                    {this.state.SelectedUser[0].MigvanTitle ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>מגוון:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].MigvanTitle}</p>
                        </div>
                      </div>
                    :null}
                    {this.state.SelectedUser[0].Tel ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>מס' טלפון:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].Tel}</p>
                        </div>
                      </div>
                    :null}
                    {this.state.SelectedUser[0].Mail ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>מייל:</p>
                        </div>
                        <div className="col-lg-6 mail-cls">
                          <p>{this.state.SelectedUser[0].Mail}</p>
                        </div>
                      </div>
                    :null}
                    {this.state.SelectedUser[0].Address ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>כתובת:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].Address}</p>
                        </div>
                      </div>
                    :null}

                    {this.state.SelectedUser[0].Town ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>עיר:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].Town}</p>
                        </div>
                      </div>
                    :null}

                    {this.state.SelectedUser[0].Hp ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>ח.פ:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].Hp}</p>
                        </div>
                      </div>
                    :null}
                    {this.state.SelectedUser[0].Extra1 ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>יעד:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].Extra1}</p>
                        </div>
                      </div>
                    :null}

                    {this.state.SelectedUser[0].PaymentMethod ?
                      <div className="flex-container">
                        <div className="col-lg-6">
                          <p>ת.תשלום:</p>
                        </div>
                        <div className="col-lg-6">
                          <p>{this.state.SelectedUser[0].PaymentMethod}</p>
                        </div>
                      </div>
                    :null}


                    {this.state.SelectedUser[0].AddressJson ?
                      <div className="flex-container">
                        <div className="col-lg-12">
                          <p>הערות:</p>
                        </div>
                        <div className="col-lg-12">
                          <p>{this.state.SelectedUser[0].AddressJson}</p>
                        </div>
                      </div>
                    :null}
                    <button onClick={()=> this.selectUser(this.state.SelectedUser[0])} className="sign-out">
                      <span>כניסה ללקוח</span>
                    </button>


                  </div>
                :null}
							</Fragment>
						:
						<Fragment>
							{localStorage.id && localStorage.exId && localStorage.user ?
								<div className="user-info inside-client">

									<h2 className="control-width">{'משתמש פעיל: ' + localStorage.name}</h2>

                  <h3>{'סוג מסמך: ' + mismahType}</h3>
									<div className="flex-container">
										<div className="col-lg-6">
											<p>מס' לקוח:</p>
										</div>
										<div className="col-lg-6">
											<p>{JSON.parse(localStorage.user).ExId}</p>
										</div>
									</div>
                  {JSON.parse(localStorage.user).PriceList ?
                    <div className="flex-container">
                      <div className="col-lg-6">
                        <p>מחירון:</p>
                      </div>
                      <div className="col-lg-6">
                        <p>{JSON.parse(localStorage.user).PriceList}</p>
                      </div>
                    </div>
                  :null}
                  {JSON.parse(localStorage.user).MigvanTitle ?
                    <div className="flex-container">
                      <div className="col-lg-6">
                        <p>מגוון:</p>
                      </div>
                      <div className="col-lg-6">
                        <p>{JSON.parse(localStorage.user).MigvanTitle}</p>
                      </div>
                    </div>
                  :null}
                  {JSON.parse(localStorage.user).Tel ?
  									<div className="flex-container">
  										<div className="col-lg-6">
  											<p>מס' טלפון:</p>
  										</div>
  										<div className="col-lg-6">
  											<p>{JSON.parse(localStorage.user).Tel}</p>
  										</div>
  									</div>
                  :null}
                  {JSON.parse(localStorage.user).Mail ?
  									<div className="flex-container">
  										<div className="col-lg-6">
  											<p>מייל:</p>
  										</div>
  										<div className="col-lg-6 mail-cls">
  											<p>{JSON.parse(localStorage.user).Mail}</p>
  										</div>
  									</div>
                  :null}
                  {JSON.parse(localStorage.user).Address ?
  									<div className="flex-container">
  										<div className="col-lg-6">
  											<p>כתובת:</p>
  										</div>
  										<div className="col-lg-6">
  											<p>{JSON.parse(localStorage.user).Address}</p>
  										</div>
  									</div>
                  :null}

                  {JSON.parse(localStorage.user).Town ?
  									<div className="flex-container">
  										<div className="col-lg-6">
  											<p>עיר:</p>
  										</div>
  										<div className="col-lg-6">
  											<p>{JSON.parse(localStorage.user).Town}</p>
  										</div>
  									</div>
                  :null}

                  {JSON.parse(localStorage.user).Hp ?
  									<div className="flex-container">
  										<div className="col-lg-6">
  											<p>ח.פ:</p>
  										</div>
  										<div className="col-lg-6">
  											<p>{JSON.parse(localStorage.user).Hp}</p>
  										</div>
  									</div>
                  :null}
                  {JSON.parse(localStorage.user).Extra1 ?
  									<div className="flex-container">
  										<div className="col-lg-6">
  											<p>יעד:</p>
  										</div>
  										<div className="col-lg-6">
  											<p>{JSON.parse(localStorage.user).Extra1}</p>
  										</div>
  									</div>
                  :null}
                  {JSON.parse(localStorage.user).PaymentMethod ?
                    <div className="flex-container">
                      <div className="col-lg-6">
                        <p>ת.תשלום:</p>
                      </div>
                      <div className="col-lg-6">
                        <p>{JSON.parse(localStorage.user).PaymentMethod}</p>
                      </div>
                    </div>
                  :null}



                  {JSON.parse(localStorage.user).AddressJson ?
                    <div className="flex-container">
                      <div className="col-lg-12">
                        <p>הערות:</p>
                      </div>
                      <div className="col-lg-12">
                        <p>{JSON.parse(localStorage.user).AddressJson}</p>
                      </div>
                    </div>
                  :null}


									<button onClick={this.signOut.bind(this)} className="sign-out">
										<span>יציאה מלקוח</span>
									</button>
								</div>
							:
							<button onClick={this.getUsers} className="get-users">החל בהזמנה</button>
							}
						</Fragment>
						}
					</div>
				:
				<ul>

					{localStorage.role ? sidebarAdmin.map((element, index) => {
						return(
							<li key={index}>
								{element.Password ?
									<Fragment>
										{element.Password == 1 && this.props.state.adminPass1 && this.props.state.adminPass1 == this.state.adminPass1 || element.Password == 2 && this.props.state.adminPass2 && this.props.state.adminPass2 == this.state.adminPass2 ?
											<NavLink onClick={this.props.toggleMenu.bind(this)} to={element.Link}>
												<img src={globalFileServer + 'icons/menu/' + element.Img} />
												<span>{element.Title}</span>
											</NavLink>
										:
										<a onClick={this.setPassword.bind(this, element.Link, element.Password)}>
											<img src={globalFileServer + 'icons/menu/' + element.Img} />
											<span>{element.Title}</span>
										</a>
										}
									</Fragment>
								:
                <Fragment>
                  {element.Pop ?
                    <a >
                      <img src={globalFileServer + 'icons/menu/' + element.Img} />
                      <span>{element.Title}</span>
                    </a>
                    :
                    <NavLink onClick={this.props.toggleMenu.bind(this)} to={element.Link}>
                      <img src={globalFileServer + 'icons/menu/' + element.Img} />
                      <span>{element.Title}</span>
                    </NavLink>
                  }
                </Fragment>
								}
							</li>
						);
					}) : null}
					{localStorage.id && !localStorage.type ? sidebarLight.map((element, index) => {
						return(
							<li key={index} onClick={this.props.toggleMenu.bind(this)}>
								<NavLink to={element.Link}>
									<img src={globalFileServer + 'icons/menu/' + element.Img} />
									<span>{element.Title}</span>
								</NavLink>
							</li>
						);
					}) : null}

          {localStorage.user && JSON.parse(localStorage.user).Type == 1 && !localStorage.agent ? sidebarLight.map((element, index) => {
              return(
                <li key={index} onClick={this.props.toggleMenu.bind(this)}>
                  <NavLink to={element.Link}>
                    <img src={globalFileServer + 'icons/menu/' + element.Img} />
                    <span>{element.Title}</span>
                  </NavLink>
                </li>
              )
            }) : null}
            {localStorage.user && JSON.parse(localStorage.user).Type == 2 && !localStorage.agent ? sidebarLightb2c.map((element, index) => {
                return(
                  <li key={index} onClick={this.props.toggleMenu.bind(this)}>
                    <NavLink to={element.Link}>
                      <img src={globalFileServer + 'icons/menu/' + element.Img} />
                      <span>{element.Title}</span>
                    </NavLink>
                  </li>
                )
              }) : null}



				</ul>
				}

			</nav>
		)
	}
}
