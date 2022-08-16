import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const header = [
    // {id:1, title:'בחירת מוצרין' ,url:'/category-page'},
    {id:2, title:'הזמנה' ,url:'/standing-order'},
    {id:3, title:'היסטוריית הזמנות' ,url:'/history-order'},
    // {id:4, title:'סטטוס הזמנה' ,url:'/order-status'},
    // {id:5, title:'מאזן קליית קפה' ,url:'/roasting'},
]

const SideHeader = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className='side_header_container'>
            <ul className='side_header_categories'>
                {header.map((category, index) => (
                <NavLink to={category.url} key={index}>
                    <li  className={path == category.url ? 'active_header' : null}>
                        {category.title}
                    </li>
                </NavLink>
                ))}
            </ul>
        </div>
    );
};

export default SideHeader;