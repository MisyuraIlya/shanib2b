import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from '../UserContext';

const SiteNav = params => {
	const [active, setActive] = useState(false);
	const [parent, setParent] = useState(false);
	const [activeHard, setActiveHard] = useState(false);
	const [parentHard, setParentHard] = useState(false);

  const app = useContext(UserContext);

	useEffect(() => {
		let el = document.getElementById('sub_categories');
		if (el) el.scrollTop = 0;
	}, [parent]);


	let categories = params.categories;
  let nav = app.state.nav.filter(item => item.Lang == app.state.lang);

	return (
		<nav className={params.active ? "site-nav active" : "site-nav"}>

			<div className="flex-container">
        <div className={localStorage.agent ? "reg-menu agent-mode" : "reg-menu"}>
          <ul>
            <li className="home-icon">
              <div className="img">
                <NavLink to={'/'}>
                  <img src={globalFileServer + 'icons/Home_icon_bl.svg'} />
                </NavLink>
              </div>
            </li>
            <li>
              <NavLink to={'/category-page'}>{"הזמנת מוצרים"}</NavLink>
            </li>
            <li>
              <NavLink to={'/report'}>{"קריאת שירות"}</NavLink>
            </li>

          </ul>
        </div>

			</div>

		</nav>
	);
}

let user;

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userEntry: false,
			foundProducts: [],
			search: false,
			toggleMenu: false,
			showCategories: false,
			prevPath: '/'
		}
		this.close = this.close.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
	}
	componentDidMount() {
		if (localStorage.user) {
			user = JSON.parse(localStorage.user)
		}
		this.setState({ prevPath: this.props.location.pathname });
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location !== this.props.location) {
			this.setState({ prevPath: this.props.location.pathname });
		}
	}

	toggleMenu() {
		this.setState({ toggleMenu: !this.state.toggleMenu });
	}

	close() {
		this.setState({
			userEntry: false,
			openChat: false
		});
	}

	beforeLogOut(user) {
		this.props.history.push('/');

    if(user == "admin"){
      this.props.history.push('/');
      this.props.localStorageClear();
    }else if(user == "agent"){
      this.props.history.push('/');
      this.props.signOut(user);
    }else{
      if(localStorage.agent && localStorage.user){
        this.props.history.push('/categoryAllPage');
        this.props.signOut("agentForUser");
      }else{
        this.props.history.push('/');
        this.props.signOut(user);
      }
    }

	}

  goBack = () => {
		if (this.state.prevPath !== '/') {
			this.props.history.goBack();
		} else {
			this.props.history.push('/');
		}
	}



	render() {
		let siteMenu =
			<div className="header-right-cont col-lg-5">
				<ul className={this.state.showCategories ? 'to-left' : null}>
					<li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
						<NavLink exact to="/">{'בית'}</NavLink>
					</li>
          {/* {localStorage.user?
  					<li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
  						<NavLink to={'/category-page'}>הזמנת מוצרים</NavLink>
  					</li>
          :null} */}
          {/* {localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/report'}>קריאת שירות</NavLink>
            </li>
          :null} */}
		    {localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/standing-order'}>הזמנות</NavLink>
            </li>
          :null}
		    {localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/statistics'}> נתוני צריכה</NavLink>
            </li>
          :null}
		    {localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/fault-page'}> דיווח על תקלה</NavLink>
            </li>
          :null}
		  	{/* {localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/handling'}>טיפולים ותחזוקה</NavLink>
            </li>
          :null} */}
		  	{localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/service'}>שירות לקוחות</NavLink>
            </li>
          :null}
		  	{localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/other-products'}>מוצרים נוספים</NavLink>
            </li>
          :null}
		  	{localStorage.user?
            <li className="shop" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/history-order'}>היסטוריית הזמנות</NavLink>
            </li>
          :null}


				</ul>
        {localStorage.user ?
          <button onClick={this.beforeLogOut.bind(this, "user")} className={"sign-in sign-out"}>
              <span>{this.props.state.user.Name ? (this.props.state.user.Name.length > 16 ? this.props.state.user.Name.substring(0, 16) + '.. / יציאה' : this.props.state.user.Name + ' / יציאה') : null}</span>
          </button>
        : null}
        {localStorage.role ?
            <button onClick={this.beforeLogOut.bind(this, "admin")} className={"sign-in sign-out"}>
                <span>{'יציאה מאדמין'}</span>
            </button>
        : null}
			</div>
		return (
			<header  id="header">
				<div className="header-wrapper">
					<div className={this.state.toggleMenu ? "main-menu col-lg-5 opened" : "main-menu col-lg-5 closed"}>
						<div className="open-menu">
              <div onClick={this.toggleMenu} className={this.state.toggleMenu ? "nav-icon3 open" : "nav-icon3"}>
                <span></span><span></span><span></span><span></span>
              </div>
							{/* <div className="main-logo-mobile">
                <NavLink to="/">
								  <img src={globalFileServer + 'logo.png'} />
                </NavLink>
							</div> */}
							<div>
				<div className="cart">
					<div className="cart_circle">
						<img src={globalFileServer + '/shaniIcons/Asset 60.svg'} />
					</div>
				</div>
				{/* <div className="news">
					<div className="news_circle">
						<img src={globalFileServer + '/shaniIcons/Asset 59.svg'}/> 
					</div>
				</div> */}
				{/* <div className="mySearch">
					<div className="search_circle">
						<img src={globalFileServer + '/shaniIcons/Asset 58.svg'}/>
					</div>
				</div> */}
                <div className="back" onClick={this.goBack}>
                  <img src={globalFileServer + 'icons/back-white-glb.svg'} />
                </div>
							</div>
						</div>
						<nav className={this.state.toggleMenu ? "opened desktop" : "closed  desktop"}>
							{localStorage.role || localStorage.agent ?
								<div onClick={this.props.toggleMenu.bind(this)} className="menu-new">
									<img src={globalFileServer + 'icons/head_icons/menu_new.svg'} />
								</div>
							:null}
              {localStorage.user ?
                <div className="header-right-cont">
                  <SiteNav headProps={this.props} goToWishList={()=> this.goToWishList()} currState={this.state} items={this.props.state.categories} />
                </div>
              :null}
						</nav>
          <div>
            <nav className={this.state.toggleMenu ? "opened mob" : "closed mob"}>
							{siteMenu}
						</nav>
						<div onClick={() => this.setState({ toggleMenu: false, showCategories: false })} className={this.state.toggleMenu ? "fake-click opened" : "fake-click closed"}></div>
          </div>
					</div>
					<div className="logo-center flex-container col-lg-2">
            <NavLink to={'/'}>
              <img src={ globalFileServer + 'logo.png'} alt=""/>
            </NavLink>
					</div>
					<div className="actions col-lg-5">
						<ul className={!localStorage.user ? "prelogIn" : "afterLog"}>
							{localStorage.user ?
								<li>
									<button onClick={this.beforeLogOut.bind(this, "user")} className={"sign-in sign-out"}>
											<span>{this.props.state.user.Name ? (this.props.state.user.Name.length > 10 ? this.props.state.user.Name.substring(0, 10) + '.. / יציאה' : this.props.state.user.Name + ' / יציאה') : null}</span>
									</button>
								</li>
							: null}
							{localStorage.role ?
								<li>
									<button onClick={this.beforeLogOut.bind(this, "admin")} className={"sign-in sign-out"}>
											<span>{'יציאה מאדמין'}</span>
									</button>
								</li>
							: null}


              {localStorage.user  ?
								<li>
									<NavLink  to="/cart">
										<button  className="icon">
											{this.props.state.productsInCart.length ?
												<span>{this.props.state.productsInCart.length}</span> : null}
											<img src={globalFileServer + 'icons/cart.svg'} />
										</button>
									</NavLink>
								</li>
              :null}



						</ul>
					</div>
					<div className={this.props.state.headerPop ? "header-popup-main-cont active" : "header-popup-main-cont"}>
						<div className="header-popup-sub-cont">
							<h3>מוצר התווסף לסל הקניות</h3>
							<img src={globalFileServer + 'icons/head_icons/cart.svg'} />
						</div>
					</div>
				</div>

				{this.state.showCategories ?
					<div onClick={() => this.setState({ showCategories: false })} className="close-categories"></div>
					: null}
			</header>
		)
	}
}
