import React, { useEffect, useState } from 'react';
import SideHeader from '../tools/SideHeader';
import { globalFileServer } from '../enums/global';
import {ajax} from '../../state/ajaxFunction'
import { useLocation } from 'react-router-dom';
import moment from 'moment-timezone';
import SideHeaderMobile from '../tools/SideHeaderMobile';
const order = {id:1, date:'11/09/20', orderNum:'100659', desc:'2 קילו ו 5 שקים של גרניטה בטים אבטיח בדרך אלייך'}

const progress = [
    {id:1, title:'ההזמנה שלך הועברה למחסנים שלנו', desc:'ובקטוב תארז למשלוח', img:globalFileServer + '/shaniIcons/Asset 31.svg'},
    {id:2, title:'ההזמנה שלך הועברה למחסנים שלנו', desc:'ובקטוב תארז למשלוח', img:globalFileServer + '/shaniIcons/Asset 32.svg'},
    {id:3, title:'ההזמנה שלך הועברה למחסנים שלנו', desc:'ובקטוב תארז למשלוח', img:globalFileServer + '/shaniIcons/Asset 35.svg', completed:'yes', here:'here'},
    {id:4, title:'ההזמנה שלך הועברה למחסנים שלנו', desc:'ובקטוב תארז למשלוח', img:globalFileServer + '/shaniIcons/Asset 36.svg', completed:'yes'},
    {id:5, title:'ההזמנה שלך הועברה למחסנים שלנו', desc:'ובקטוב תארז למשלוח', img:globalFileServer + '/shaniIcons/Asset37.svg', completed:'yes'},
]

const OrderStatus = () => {

    const [loading, setLoading] = useState(false)
    const location = useLocation();
    const [orderItem,setOrderItem] = useState({});
    const [products, setProducts] = useState([]);

    const fetchOrderStatus = async () => {    
        setLoading(true);
        const valAjax = {
            funcName: 'getOneItem',
            point: 'orders',
            id:JSON.parse(localStorage.user).Custname  ? JSON.parse(localStorage.user).Custname : JSON.parse(localStorage.user).ExId,
            val:location.pathname.split('/')[2],
          };
        try {
            const data = await ajax(valAjax);
            console.log(data.Order[0],'as')
            setOrderItem(data.Order[0]);
            setProducts(data.Order[0].AllProducts)
        } catch(error) {
            console.log('error to fetch orderStatus');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderStatus()
    },[])

    console.log(products)
    return (
    <>
    
    <div className='order_status_desktop'>
    <div className='flex-container order_status_container'>
        {/* <div className='col-lg-2 right_side_header'>
            <SideHeader/>
        </div> */}
        <div className=''>
            {
                loading ? 
                <div className="spinner-wrapper" >
                    <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                    </div>
                </div>
            :
            <div className='status_order_container'>
                <div className='status_order_content'>
                    <div className='staths_content'>
                        <h1>{moment(orderItem.OrderDate).format('L')}</h1>
                        <h4>הזמנה {orderItem.OrderNumber}</h4>
                        <p>{orderItem.Status}</p>
                    </div>
                </div>
                <div className='flex-container prods_container'>
                    {products.map((item) => 
                        <div className='col-lg-2'>
                            <div className='card_prod'>
                                <div>
                                    <img src={item.Extra1} />
                                    
                                    <p>{item.Title}</p>
                                    <p>כמות : {item.QuantityProd}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className='order_status_progress'>
                    <div className='order_status_progress_line'></div>
                    {progress.map((item,index) => (
                        <div className='card'>
                        {item.here ?
                        <div className='order_status_progress_check'>
                            <div className='circle'>
                                <img src={globalFileServer + '/shaniIcons/Asset 65.svg'}/>
                            </div>
                        </div>
                        : null }
                        <div key={index} className='progress_container'>
                            <div className={item.completed ? 'img_circle' : 'img_circle_uncompleted'}>
                                <img src={item.img}/>
                            </div>
                            {item.here ?
                            <div className='progress_title'>
                                <p>{item.title}</p>
                                <span>{item.desc}</span>
                            </div>
                            : null
                            }

                        </div>
                        </div>

                    ))}
                </div> */}
                <div className='orderStatus_button'>
                    <button>שחר הזמנה</button>
                </div>
            </div>
            }
        </div>
    </div>
    </div>

    <div className='order_status_mobile'>
        <SideHeaderMobile/>
        <div className='card_container'>
            <h1>{moment(orderItem.OrderDate).format('L')}</h1>
            <h4>הזמנה {orderItem.OrderNumber}</h4>
            <p>{orderItem.Status}</p>
        </div>
    </div>

    </>
    );
};

export default OrderStatus;