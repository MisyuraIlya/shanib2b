import React, { useEffect } from 'react';
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
import SweetAlert from 'sweetalert2';

const HistoryOrderNew = () => {
    console.log(new Date())
    const [value, onChange] = useState(getLastWeeksDate);
    const [calendarActive, setCalendarActive] = useState(false)
    const {loading, orders, methods, orderProds,subLoading } = useOrders();
    let d = new Date();
    const history = useHistory();
    const getOrdersFunc = () => {
        // console.log(moment().subtract(1, "days").format(" YYYY-MM-DDThh:mm:ss")+'.1440844Z')
        methods.getOrders(moment(value).format(" YYYY-MM-DDThh:mm:ss")+'.1440844Z')
    }

    const restoreOrder =  (item) => {
        SweetAlert({
            title: 'שדר הזמנה מחדש?',
            type: 'success',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'אשר',
            cancelButtonText: 'בטל'
            }).then(async (check) => {
                console.log(check)
                if(check.value == true){
                    console.log('we enter here')
                    let response = await methods.restoreOrder(item)
                    if(response){
                        SweetAlert({
                            title: 'הזמנה שודרה בהצלחה',
                            type: 'success',
                            showConfirmButton: false,
                            showCancelButton: false,
                        })
                    } else {
                        SweetAlert({
                            title: 'ההזמנה לא שודרה',
                            type: 'info',
                            showConfirmButton: false,
                            showCancelButton: false,
                        })
                    }
                } else {
                    console.log('null')
                    null
                }
            })
    }

    const restoreProducts = (e,item) => {
        e.stopPropagation()
        methods.CartRestored()
    }

    const getItems = (item) => {
        methods.getItemsInOrder(item.OrderNumber)
    }

    function getLastWeeksDate() {
        const now = new Date();
      
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      }


    
    useEffect(() => {
        getOrdersFunc()
    },[value])
    return (
        <>
        <div className='history_order_desktop'>
            <div className='flex-container history_order_container'>
                {/* <div className='col-lg-2 right_side_header'>
                    <SideHeader/>
                </div> */}
                <div className='' style={{marginTop:'90px'}}>
                    <div className='calendar'>
                        <div className='standing_button'>
                            <button onClick={() => setCalendarActive(!calendarActive)}> מתאריך  {moment(value).format('l')}</button>
                        </div>
                        <div className='table_calender'>
                            {calendarActive ? 
                            <Calendar onChange={onChange} value={value} />
                            : null
                            }
                        </div>
                    </div>

                    <div className='accordion_container'>
                        {/* <Accordion data={data}/> */}
                    </div>
                    <div className='history_order_conts'>
                        {loading ? 
                        <div className="spinner-wrapper">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                        : 
                        <div className='accordion_container'>
                            {orders.map((item) => (
                            <div className='card_accordion'>

                                <Accordion 
                                setCalendarActive={setCalendarActive}
                                subLoading={subLoading}
                                orderProds={orderProds}
                                getItems={getItems} 
                                restoreProducts={restoreProducts} item={item}/>

                            </div>
                        ))}
                        </div>

                    }
                    </div>
                </div>
            </div>
        </div>

        <div className='history_roder_mobile'>
            {/* <SideHeaderMobile/> */}

            {orders.map((item,index) => 
                <div className='card' key={index} onClick={() => history.push(`/order-status/${item.OrderNumber}`)}>
                    <h1>{moment(item.OrderDate).format('l')}</h1>
                    <p>הזמנה {item.OrderNumber}</p>
                    <div className='card__imgCont'>
                        <img src={globalFileServer + '/shaniIcons/Asset 70.svg'}/>
                    </div>    
                </div>

            )}
        </div>
        </>
    );
};

export default HistoryOrderNew;