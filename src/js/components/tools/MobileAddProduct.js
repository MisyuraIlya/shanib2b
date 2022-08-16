import React from 'react';

const MobileAddProduct = () => {
    return (
        <div className='flex-container mobile_add_product_container'>
                <div className='col-lg-4 '>
                    <div className='circle right'>
                        +
                    </div>
                </div>
                <div className='col-lg-4 counter'>
                    <div className='counter_input'>
                        <input type='text' value={0}/>
                    </div>
                </div>
                <div className='col-lg-4 '>
                    <div className='circle left'>
                        -
                    </div>
                </div>
        </div>

    );
};

export default MobileAddProduct;