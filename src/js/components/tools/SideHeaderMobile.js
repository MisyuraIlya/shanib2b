import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const header = [
    // {id:1, title:'בחירת מוצרין' ,url:'/category-page'},
    {id:2, title:'הזמנה ' ,url:'/standing-order'},
    {id:3, title:'היסטוריית הזמנות' ,url:'/history-order'},
    // {id:4, title:'סטטוס הזמנה' ,url:'/order-status'},
    // {id:5, title:'מאזן קליית קפה' ,url:'/roasting'},
]


const SideHeaderMobile = () => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className='sideHeader_mobile_container' style={{marginTop:'10px'}}>
            <div className='content'>
                {header.map((item,index) => 
                <NavLink to={item.url} key={index}>
                    <div className={path == item.url ? 'currentLocation' : 'card_content'} >
                        <h4>{item.title}</h4>
                    </div>
                </NavLink>

                )}
            </div>
        </div>
    );
};

export default SideHeaderMobile;