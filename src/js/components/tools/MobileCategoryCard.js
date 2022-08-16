import React, { useState } from 'react';
import MobileAddProduct from './MobileAddProduct';
const MobileCategoryCard = ({item}) => {
    const [active, setActive] = useState(false)
    return (
    <div className='card_container'>
        <div className='flex-container'>
            <div className='col-lg-4 image_cont'>
                <img src={item.Extra1 ? item.Extra1 : globalFileServer + 'placeholder.jpg'}/>
            </div>
            <div className='col-lg-4 card_title'>
                <h4>{item.Title}</h4>
            </div>
            <div className='col-lg-4 mobile_counter'>
                {!active 
                ?   
                <div className='circle' onClick={() => setActive(true)}>
                    +
                </div>
                : <MobileAddProduct/>
                }
            </div>
        </div>
    </div>
    );
};

export default MobileCategoryCard;