import React, { useState,useEffect } from 'react';
import SideHeader from '../tools/SideHeader';
import { NavLink } from 'react-router-dom';
import { useOrders } from '../../state/OrdersProvider';
import { useCart } from '../../state/CartProvider';
import CategoryCard from '../tools/CategoryCard';
import { useMachines } from '../../state/MachineProvider';
import Calendar from 'react-calendar';
import SweetAlert from 'sweetalert2';
import SideHeaderMobile from '../tools/SideHeaderMobile'
import MobileCategoryCard from '../tools/MobileCategoryCard'
import { useCategories } from '../../state/CategoriesProvider'

const StandingOrderNew = () => {

	const [openSelect, setOpenSelect] = useState(false);
    const {loading, migvans,methods,currentCategories} = useOrders();
	const [optionsState, setOptionState] = useState()
	const [value, onChange] = useState(new Date());
    const {cart, methodsCart } = useCart();
	// const {categories} = useCategories();
	const {area} = useMachines();
	const [mobileChoosed, setMobileChoosed] = useState('גלידות');

    const writeNewOrder = () => {
		SweetAlert({
            title: 'לשלוח הזמנה?',
            type: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'אשר',
            cancelButtonText: 'בטל'
            }).then((check) => {
                if(check.value){
       			const orderNew = methodsCart.wrtieNewOrder(optionsState)
                } 
            })
    }

	const selectHandle = (e) => {
        setOptionState(e.ADDRESS)
        setOpenSelect(false);
        const areaChoosed = area.filter((item) => item.ADDRESS == e.ADDRESS);

    }
    useEffect(() => {
		if(!migvans.length > 0){
			methods.migvanProducts()	
		}
    },[])
    return (
		<>
		<div className='desktop_category_view'>
			<div className='flex-container'>
				{/* <div className='col-lg-2 right_side_header'>
					<SideHeader/>
				</div> */}
				<div className='left_side_content'>
					<div className="category-view">
						<div className="heading">
							{loading ?
								<div className="spinner-wrapper">
									<div className="spinner">
										<div className="bounce1"></div>
										<div className="bounce2"></div>
										<div className="bounce3"></div>
									</div>
								</div>
							: null}
						</div>


						<div className="container categories categories_category">
								
						{/* <div className='selection_card'>
							<div className={openSelect ? "select active padding" : "select padding"}>
								<div onClick={() => setOpenSelect(!openSelect)}  className="headind">
								<p>{optionsState ? optionsState : 'בחר אתר'}</p>
								<div className="img">
									<img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
								</div>
								</div>
								<div className={openSelect ? "masc active" : "masc"}>
								<ul>
									{area.map((ele,ind) => {
									return(
										<li key={ind}>
										<div className="mask-li-cls" onClick={() => selectHandle(ele)}>
											<span>{ele.Code + ' | ' +ele.ADDRESS}</span>
											<div className="img">
											<img src={globalFileServer + 'icons/back-select.svg'} alt=""/>
											</div>
										</div>
										</li>
									)
									})}
								</ul>
								</div>
							</div>
						</div> */}

							<div >
								{currentCategories.map((cat,index) => 
								{
									return (
										<div key={index}>
											<div className="category_concent">
												<h2><span>{cat.title}</span></h2>
											</div>
											<div className='flex-container categories_content'>
												{migvans.map((item, key) => {
													if(item.Category ==cat.title)
													return (
														<CategoryCard CQUANT={item.CQUANT} TQUANT={item.TQUANT} item={item} key={key}/>														
													)
												})}
											</div>
										</div>
									)
								}
								)}
							</div>

						</div>
					</div>
					{!loading ?
						<div className='standing_buttons'>
							<button onClick={writeNewOrder}>בצע הזמנה</button>
							{/* <button>חזרה למוצרים</button> */}
						</div>
					: null }
				</div>
			</div>
		</div>

		<div className='mobile_category_view'>

			{/* <SideHeaderMobile/> */}

			<div className='mobile_category_choose'>
				{currentCategories.map((item,index) => 
					<div className='card' key={index} onClick={() => setMobileChoosed(item.title)}>
						<div className={item.title == mobileChoosed ? 'circle_card_active' : 'cirlce_card_img'}>
							<img src={item.img}/>
						</div>
						{item.title}
					</div>
				)}
			</div>

			<div className='mobile_category_content'>
				{/* <h2>{mobileChoosed}</h2> */}
					{migvans.map((item,key) => {
						if(mobileChoosed == item.Category){
							return(
								<CategoryCard CQUANT={item.CQUANT} TQUANT={item.TQUANT} item={item} key={key}/>	
							)
							}
					})}
			</div>
		</div>
		</>
    );
};

export default StandingOrderNew;