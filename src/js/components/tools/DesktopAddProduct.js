import React, { useState } from 'react';

const DesktopAddProduct = ({handleInput,increaseFunc, decreaseFunc, number}) => {

    // const [number, setNumber] = useState(0)

    // const increse = () => {
    //     setNumber(e => e + 1)
    // }

    // const decrease = () => {
    //     if(number > 0){
    //         setNumber(e => e - 1)
    //     }
    // }

    // const inputHandler = (e) => {
    //     const number = e.target.value
    //     if(number != NaN  && parseInt(number)){
    //         setNumber(parseInt(e.target.value))
    //     } else {
    //         setNumber(0)
    //     }
    // }


    return (
        <div className='desktop_add_product'>
            <div className='circle' onClick={increaseFunc}>
                <span>+</span>
            </div>
                <input type='text' value={number} onChange={(e) => handleInput(e)} />
            <div className='circle' onClick={decreaseFunc}>
                <span>-</span>
            </div>
        </div>
    );
};

export default DesktopAddProduct;