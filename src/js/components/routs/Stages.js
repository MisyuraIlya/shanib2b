import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useParams } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';

SwiperCore.use([Autoplay]);

const Stages = res => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeKey, setActiveKey] = useState([]);

  const ref = useRef(null);

  useEffect(() => {
    let activeKey = [];
    if(res.props.location.pathname.includes('category-page')){
      activeKey.push(1);
    }
    if(res.props.location.pathname.includes('categoryItems')){
      activeKey.push(1);
      activeKey.push(2);
    }
    if(res.props.location.pathname.includes('cart')){
      activeKey.push(1);
      activeKey.push(2);
      activeKey.push(3);
    }
    setActiveKey(activeKey);
  });


  return (

    <div className="stages-page">
      <div className="stages-main-cont flex-container">
        <div className="stage-cont col-lg-3 first">
          <div className={activeKey && activeKey.includes(1) ? "circle  active" : "circle"}>
            <p>1</p>
          </div>
          <p className='title'>בחר קטגוריה</p>
        </div>
        <div className="stage-cont col-lg-3">
          <div className={activeKey.includes(2) ? "circle active" : "circle"}>
            <p>2</p>
          </div>
          <p className='title'>בחר מוצרים</p>
        </div>
        <div className="stage-cont col-lg-3">
          <div className={activeKey.includes(3) ? "circle active" : "circle"}>
            <p>3</p>
          </div>
          <p className='title'>סיכום הזמנה</p>
        </div>
        <div className="stage-cont col-lg-3 last">
          <div className={activeKey.includes(4) ? "circle active" : "circle"}>
            <p>4</p>
          </div>
          <p className='title'>אישור</p>
        </div>
      </div>
    </div>
  );
}

export default Stages;
