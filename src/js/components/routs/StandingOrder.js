import React, { useEffect } from 'react';
import MobileAddProduct from '../tools/MobileAddProduct';
import SideHeader from '../tools/SideHeader';
import SideHeaderMobile from '../tools/SideHeaderMobile';
import StandingOrderContent from '../tools/StandingOrderContent';
import { useOrders } from '../../state/OrdersProvider';

const product = [
	{id:1, title:'תמצית ענבים', kg:'10kg', url:'1',img:'#'},
	{id:2, title:'תמצית ענבים', kg:'10kg', url:'1',img:'#'},
	{id:3, title:'תמצית ענבים', kg:'10kg', url:'1',img:'#'},

]

const StandingOrder = () => {

    const {loading, migvans,methods} = useOrders();


    useEffect(() => {
        methods.migvanProducts()
    },[])
    return (
        <>
        <div className='standing_order_desktop'>
            <div className='flex-container standing_order_container'>
                {/* <div className='col-lg-2 right_side_header'>
                    <SideHeader/>
                </div> */}
                <div className=''>
                    {loading ?
                    
                <div className="spinner-wrapper" >
                    <div className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </div>
                </div>
                
                : 
                <>
                    <div className='left_side_content_standing_container'>
                        <div className='left_side_content_standing'>
                            {migvans.map((item) => (
                                <StandingOrderContent item={item}/>
                            ))}
                        </div>
                    </div>

                    <div className='standing_buttons'>
                        <button>בצע הזמנה</button>
                        <button>חזרה למוצרים</button>
                    </div>
                </>
                }
                </div>
            </div>
        </div>

        {/* <div className='standing_order_mobile'>
            <SideHeaderMobile/>
            <div className='standing_container'>
                <h2>הזמנה קבועה</h2>
                {methods.map((item) => 
                    <div className='flex-container card_cont'>
                        <div className='col-lg-4 image_cont'>
                            <img src={item.Extra1} />
                        </div>
                        <div className='col-lg-4 title_cont'>
                            <p>{item.Title}</p>
                        </div>
                        <div className='col-lg-4 counter_cont'>
                            <MobileAddProduct/>  
                        </div>
                    </div>
                )}
                <div className='flex-container form_cont'>
                    <div className='col-lg-6 card'>
                        <button className=''>הוסף לסל</button>
                    </div>
                    <div className='col-lg-6 card'>
                        <button className=''>חזרה למוצרים</button>
                    </div>
                </div>
            </div>
        </div> */}
        </>
    );
};

export default StandingOrder;