import React, { useState } from 'react';
import moment from 'moment-timezone';
const Accordion = ({setCalendarActive, subLoading, orderProds, getItems, restoreProducts, item}) => {
    const [active, setActive] = useState(false)

    const activeHanlder = () => {
        setActive(!active)
        setCalendarActive(false)

    }
    const getItemsProd = () => {
        if(!active) {
            getItems(item)
        }
    }

    const restoreFunc = (e, item) => {
        e.currentTarget.disabled = true;
        restoreProducts(e, item)
    }
    return (
        <div className={`accordion ${active ? 'active ' : ''}`} onClick={() => getItemsProd()}>
            <div className="flex-container accordion__title" onClick={() => activeHanlder()}>
                <div className='col-lg-4 accordion_id date'>
                    <span className=''>{moment(item.OrderDate).format('L')}</span>
                </div>
                <div className={`col-lg-4  ${active ? 'myzone_card_devider_active ' : 'myzone_card_devider'}`}>
                    <span>הזמנה {item.OrderNumber}</span>
                </div>
                <div className={`col-lg-4  ${active ? 'myzone_card_devider_active ' : 'myzone_card_devider'}`}>
                    <div className='flex-container'>
                         <div className='col-lg-6' style={{width:'80%'}}>
                            {/* <span>{props.status}</span> */}
                        </div>
                        <div className="accordion__icon col-lg-6" style={{width:'20%'}}>
                            <i className='bx bxs-chevron-down'></i>
                            <div className='circle' onClick={(e) => restoreFunc(e, item)}> 
                                <img src={globalFileServer + '/shaniIcons/Asset 70.svg'}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="accordion__content">
            {!subLoading ?
                    orderProds.map((prods) => {
                        return (
                        <>
                            <div className='flex-container '>
                                <div className='col-lg-3 cont'>
                                    <img src={prods.Extra1} />
                                </div>
                                <div className='col-lg-3 cont'> 
                                    <h5>{prods.Title}</h5>
                                </div>
                                <div className='col-lg-3 cont'>
                                    <span>כמות : {prods.QuantityProd}</span>
                                </div>
                                <div className='col-lg-3 cont'>
                                </div>
                            </div>    
                            <hr class="myzone_zone_zard_devider"></hr>
                        </>  
                        )
                    })
                :   <div className="spinner-wrapper">
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </div> }
            </div>
        </div>
    );
};

export default Accordion;