import React, { Component, Fragment, useEffect, useState } from 'react';
import DesktopAddProduct from './DesktopAddProduct';
import { useCart } from '../../state/CartProvider';

const CategoryCard = ({item, CQUANT, TQUANT}) => {
	const [isShown, setIsShown] = useState(false);
    const [active, setActive ] = useState(false);
    const [number, setNumber] = useState(0);
    const {methodsCart, cart} = useCart();
    const [limited, setLimited] = useState(false)

    const addPorductHandler = () => {
        if(item.PackQuan !== '0'){ 
            setActive(true);
            setNumber( parseInt(item.PackQuan))
            methodsCart.addProduct(item)
        } else {
            setActive(true);
            setNumber(1)
            methodsCart.addProduct(item)
        }

    }

    const checkActivated = () => {
        cart.map((prod) => {
            if(prod.CatalogNumber == item.CatalogNumber) {
                setActive(true)
                checkNumber()
                if(prod.Quantity == 0) {
                    setActive(false)
                }
            } 
        })
        
    }

    const increaseFunc = () => {
        if(item.PackQuan !== '0'){ 
            if(number > 0){
                let tmp = number/ parseInt(item.PackQuan)
                let num = (tmp+1) * parseInt(item.PackQuan)
                console.log(tmp, num)
                setNumber(num)
                methodsCart.increase(item,num)
            } else {
                let num = (number+1) * parseInt(item.PackQuan)
                console.log(num)
                setNumber(num)
                methodsCart.increase(item,num)
            }

        } else {
            setNumber(e => e + 1)
            methodsCart.increase(item,number + 1)
        }

    }

    const decreaseFunc = () => {
        if(number > 0){
            if(item.PackQuan !== '0'){ 
                if(number > 0){
                    let tmp = number/ parseInt(item.PackQuan)
                    let num = (tmp-1) * parseInt(item.PackQuan)
                    setNumber(num)
                    methodsCart.decrease(item,num)
                } else {
                    let num = (number-1) * parseInt(item.PackQuan)
                    console.log(num)
                    setNumber(num)
                    methodsCart.decrease(item,num)
                }
    
            } else {
                setNumber(e => e - 1)
                methodsCart.decrease(item,number - 1)
            }
        } else {
            setActive(false)
        }
    }

    const handleInput = (e) => {
        if(typeof(e.target.value ) !== 'string'){
            if(item.PackQuan == '0'){
                if(number > 0){
                    setNumber(parseInt(e.target.value))
                    methodsCart.handleInputProvider(item,parseInt(e.target.value))
                }
            } else {
                if(number > 0){
                    let num =  parseInt(e.target.value)  *  parseInt(item.PackQuan)
    
    
                    setNumber(num)
                    methodsCart.handleInputProvider(item,num)
                }
            }
        } else {
            if(item.PackQuan == '0'){
                if(number > 0){
                    setNumber(parseInt(1))
                    methodsCart.handleInputProvider(item,parseInt(1))
                }
            }else {
                if(number > 0){
                    let num =  parseInt(1)  *  parseInt(item.PackQuan)
    
    
                    setNumber(num)
                    methodsCart.handleInputProvider(item,num)
                }
            }
        }

    }

    const checkNumber = () => {
        let prodsActive = JSON.parse(localStorage.CartProducts)
        prodsActive.map((prod) => {
            if(prod.CatalogNumber == item.CatalogNumber){
                if(prod.Quantity){
                    setNumber(prod.Quantity)
                } 
            }
        })
        
    }

    useEffect(() => {
        checkActivated()
    },[])

    return (
    <div  className='col-lg-4 mobile_cont_card'>
        {CQUANT + number >  TQUANT? 
            <h2>limited</h2>
        : null}
        <div className='categories_content_card'>

            <div className='img_cont' 
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
            > 
                <img className='categories_content_card_img' src={globalFileServer + `/products/${item.CatalogNumber}.jpg`} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
                {isShown && !active ? 
                    <div className='categories_content_card_add' onClick={addPorductHandler}>
                        <img  src={globalFileServer + 'shaniIcons/Asset 71.svg'} />
                    </div>
                : null}

            </div>

            <h4>{item.Title}</h4>

            <div className='counter_comp'>
                {active ? 
                <div className='flex-container shop_cont'>

                    <div className='button_cont col-lg-4' onClick={increaseFunc}>
                        <div>+</div>
                    </div>
                    <div className='col-lg-4'>
                        <input type='text'  value={number} onChange={(e) => handleInput(e)} />
                    </div>
                    <div className='button_cont col-lg-4' onClick={decreaseFunc}>
                        <div>-</div>
                    </div>
                </div>
                : 
                <div className='add_show_cont' onClick={addPorductHandler}>
                    <span>
                        <p>הוסף לסל</p>
                        <img src={globalFileServer + '/shaniIcons/Asset 60.svg'}/>
                    </span>
                </div>
                }

            </div>
        </div>
    </div>
    );
};

export default CategoryCard;