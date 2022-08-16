import React, { useState } from 'react';
import DesktopAddProduct from './DesktopAddProduct';

const StandingOrderContent = ({item}) => {

   


    return (
    <div className='standing_content_card'>
        <div className='right_side_cont'>
            <img src='#' />
            <p>{item.Title}</p>
        </div>
        <div>
            <DesktopAddProduct/>
        </div>
    </div>
    );
};

export default StandingOrderContent;