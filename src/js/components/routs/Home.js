import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useHistory } from "react-router-dom";

import { pageRoutes } from "../enums/routes";


export default class Home extends Component {
	state = {
	};
	componentDidMount = () => {
		setTimeout(() => window.scrollTo(0, 0), 100);
	}
	render(){

		return (
      <>
        <div className='home_container'>
            <div className='home_center_cont'>
                <div className='home_center_img_cont'>
                    <img src={globalFileServer + 'userPlaceholder.png'}/>
                </div>
                <div className='home_center_title_cont'>
                    <h1>בוקר טוב {localStorage.user ? JSON.parse(localStorage.user).Name : null}</h1>
                    <h4>איך נוכל לעזור לך היום?</h4>
                </div>
                <div className='flex-container home_center_configure'>
                    {pageRoutes.map((item,index) => {
                        if(item.img && item.desc){
                            return(
                                <div className='col-lg-4 home_center_configure_cont' key={index}>
                                    <NavLink to={item.link}>
                                        <div className='home_center_configure_circle'>
                                            <img src={item.img}/>
                                        </div>
                                    </NavLink>
                                    <div className='home_center_configure_title'>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            )  
                        }
                    })}
                </div>
            </div>
        </div>
        <div className="home_container_mobile">
            <div className="flex-container">
                <div className="col-lg-6">
                  <div className="right_side">
                    <div className="img_cirlce">
                      <img src={globalFileServer + 'userPlaceholder.png'}/>
                    </div>
                  </div>
                </div>  
                <div className="col-lg-6 left_side">
                    <div className="title">
                        <h1>בוקר טוב {JSON.parse(localStorage.user).Name}</h1>
                        <p>איך נוכל לעזור לך היום?</p>
                    </div>
                </div>
            </div>

            <div className="home_card">
                {pageRoutes.map((item,index) => {
                  if(item.img&&item.desc){
                    return(
                      <div className="flex-container mobile_card">
                        <NavLink to={item.link}>
                          <div className="col-lg-4 circle_img">
                            <img src={item.img}/>
                          </div>
                        </NavLink>
                        <div className="col-lg-8 title_cont">
                          <h4>{item.title}</h4>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    )
                  }
                })}
            </div>
        </div>
        {/* <div className="home-page">
        <div className="nav-cont">
          <div className="nav-sub-cont flex-container">
            <div className="col-cont col-lg-6">
              <NavLink to={'/category-page'}>
                <img src={globalFileServer + 'home/shop.png'} />
                <div className="send btn-cont">
                    <button onClick={()=> this.signIn()}>הזמנת מוצרים</button>
                </div>
              </NavLink>
            </div>
            <div className="col-cont col-lg-6">
              <NavLink to={'/report'}>
                <img src={globalFileServer + 'home/report.png'} />
                <div className="send btn-cont">
                    <button onClick={()=> this.signIn()}>קריאת שירות</button>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
    	</div> */}

      </>

		)
	}
}
