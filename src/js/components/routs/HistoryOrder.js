import React from 'react';
import SideHeader from '../tools/SideHeader';
import { useOrders } from '../../state/OrdersProvider';
import { globalFileServer } from '../enums/global';
import moment from 'moment-timezone';
import { useHistory } from 'react-router-dom';
import SideHeaderMobile from '../tools/SideHeaderMobile';
import { Swiper, SwiperSlide } from 'swiper/react';
import Calendar from 'react-calendar';
import { useState } from 'react';
import Accordion from '../tools/Accordion';
const HistoryOrder = () => {
    const [value, onChange] = useState(new Date());
    const [calendarActive, setCalendarActive] = useState(false)
    const {loading, orders} = useOrders();
    let d = new Date();
    const history = useHistory();

    const data = [ 
        {id:1, title:'גלידה', num:'30', makat:'as123123123'},
        {id:2, title:'גלידה', num:'30', makat:'as123123123'},
        {id:3, title:'גלידה', num:'30', makat:'as123123123'},
        {id:4, title:'גלידה', num:'30', makat:'as123123123'},
    ]
    console.log('this is the date', value)
    return (
        <>
        <div className='history_order_desktop'>
            <div className='flex-container history_order_container'>
                {/* <div className='col-lg-2 right_side_header'>
                    <SideHeader/>
                </div> */}
                <div className='' style={{marginTop:'200px'}}>
                    <div className='calendar'>
                        <div className='standing_button'>
                            <button onClick={() => setCalendarActive(!calendarActive)}>בחר מתאריך</button>
                        </div>
                        <div className='table_calender'>
                            {calendarActive ? 
                            <Calendar onChange={onChange} value={value} />
                            : null
                            }
                        </div>
                    </div>

                    <div className='accordion_container'>
                        <Accordion data={data}/>
                    </div>
                    {/* <div className='history_order_conts'>
                        {loading ? 
                        <div className="spinner-wrapper">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                        : 
                        orders.map((item) => (
                            <div className='flex-container history_order_conts_card' onClick={() => history.push(`/order-status/${item.OrderNumber}`)}>
                                <div className='col-lg-5 history_order_date'>
                                    <div>
                                        <h1>{moment(item.OrderDate).format('L')}</h1>
                                        <h4>הזמנה {item.OrderNumber}</h4>
                                    </div>
                                </div>
                            
                                <div className='col-lg-5 history_order_prods' >
                                    <div className='swiper_cont'>
                                        <Swiper
                                        spaceBetween={50}
                                        slidesPerView={3}
                                        loop={true}
                                        autoplay={{
                                            delay: 2500,
                                            disableOnInteraction: false,
                                          }}
                                        >
                                            {item.products[0] ?
                                                item.products[0].map((prods) => {
            
                                                    return (
                                                        <SwiperSlide>
                                                        <div className='card_prod'>
                                                            <img src={prods.Extra1}/>
                                                            <p>{prods.Title}</p>
                                                            <p>כמות : {prods.QuantityProd}</p>
                                                        </div>
                                                        </SwiperSlide>
                                                    )
                                                

                                                })
                                            : null }
                                        </Swiper>
                                    </div>
                                </div>
                                <div className='col-lg-2 restore_history_order'>
                                    <div className='circle'> 
                                        <img src={globalFileServer + '/shaniIcons/Asset 70.svg'}/>

                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </div> */}
                </div>
            </div>
        </div>

        <div className='history_roder_mobile'>
            <SideHeaderMobile/>

            {orders.map((item,index) => 
                <div className='card' key={index} onClick={() => history.push(`/order-status/${item.OrderNumber}`)}>
                    <h1>{moment(item.OrderDate).format('L')}</h1>
                    <p>הזמנה {item.OrderNumber}</p>
                    <div className='flex-container prods_container'>
                    <div className='col-lg-2 restore'>
                        <div className='restore'>
                            <img src={globalFileServer + '/shaniIcons/Asset 70.svg'}/>
                        </div>
                    </div> 
                    {/* {prods.map((item,indexx) => 

                            <div className='col-lg-3 prod_cont' key={indexx}>
                                <img src={item.img}/>
                                <p>{item.title}</p>
                            </div>

                    )} */}
                </div>
                </div>

            )}
        </div>
        </>

    );
};

export default HistoryOrder;