import React, { Component, Fragment, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import Autosuggest from 'react-autosuggest';
import SweetAlert from 'sweetalert2';



const sidebarAdmin = [
  
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
	},
	{
		Title: 'הזמנות',
		Link: '/admin-history',
		Img: 'cart.svg',
		Password: false,
    Pop: false
	}
];

export default class Nav extends Component {
	constructor(props){
		super(props);
		this.state = {
			preload: false,
		}
    this.preload = this.preload.bind(this);
	}
	componentDidMount(){}

  preload(){
    this.setState({preload: !this.state.preload});
  }




	render(){
		let lang = this.props.state.lang;
		const { value, suggestions } = this.state;

		return (
			<nav id="main" data-class={lang == 'he' ? 'he' : 'ru'} className={this.props.state.toggleMenu ? 'active' : null}>
				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
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
                    <a onClick={() => this.setState({syncPop:true})}>
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
        </ul>
			</nav>
		)
	}
}
