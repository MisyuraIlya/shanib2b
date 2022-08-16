import React, { Component, Fragment, useState } from 'react';
import { NavLink } from "react-router-dom";
import SideHeader from '../tools/SideHeader';
import { useProducts } from '../../state/ProductsProvider';
import { useCategories } from '../../state/CategoriesProvider';
import SideHeaderMobile from '../tools/SideHeaderMobile';
import { globalFileServer } from '../enums/global';
import MobileAddProduct from '../tools/MobileAddProduct';
import CategoryCard from '../tools/CategoryCard';
import MobileCategoryCard from '../tools/MobileCategoryCard';

const CategoryView = () => {

	const {loading, products} = useProducts();
	const {categories} = useCategories();
	const [mobileChoosed, setMobileChoosed] = useState('פולי קפה');

	const mobileChooseCategory = [
		{id:1, title:'פולי קפה', img:globalFileServer + '/shaniIcons/Asset 48.svg'},
		{id:2, title:'גרניטה ואייסים', img:globalFileServer + '/shaniIcons/Asset 52.svg'},
		{id:3, title:'גלידות', img:globalFileServer + '/shaniIcons/Asset 51.svg'},
	]


	
	return (

		<>
		<div className='desktop_category_view'>
			<div className='flex-container'>
				<div className='col-lg-2 right_side_header'>
					<SideHeader/>
				</div>
				<div className='col-lg-10 left_side_content'>
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

						{!loading ?
						<div className="container categories categories_category">
							{categories.map((element, index) => {
								return(
									<>
										<div key={index} className="category_concent">
											<NavLink to={ ('/categoryItems/' + element.Id + "/0/0/")}>
													<h2><span>{element.Title}</span></h2>
											</NavLink>
										</div>
										<div className='flex-container categories_content'>
											{products.map((item, key) => {
												if(element.Title === item.Category) {
													return (
														<CategoryCard item={item}/>
													)
												}
											})}
										</div>
									</>
								);
							})}
						</div>
						:
							null
						}


					</div>
				</div>
			</div>
		</div>

		<div className='mobile_category_view'>
			<SideHeaderMobile/>

			<div className='mobile_category_choose'>
				{mobileChooseCategory.map((item,index) => 
					<div className='card' key={index} onClick={() => setMobileChoosed(item.title)}>
						<div className={item.title == mobileChoosed ? 'circle_card_active' : 'cirlce_card_img'}>
							<img src={item.img}/>
						</div>
						{item.title}
					</div>
				)}
			</div>

			<div className='mobile_category_content'>
				<h2>{mobileChoosed}</h2>

					{products.map((item,index) => {
						if(mobileChoosed == item.Category){
							return(
								<MobileCategoryCard item={item}/>
							)
						}
					})}
			</div>
		</div>
		</>
	);
};

export default CategoryView;







// export default class CategoryView extends Component {
// 	constructor(props){
// 		super(props);
// 		this.state = {}
// 	}
	
// 	componentDidMount(){
// 		setTimeout(() => window.scrollTo(0, 0), 100);
//     if(localStorage.getItem('lastUrl')){
//       localStorage.removeItem('lastUrl');
//     }

// 	}
// 	render(){
// 	// const {products, getProducts} = useProducts;
// 	// console.log(products)
// 	let categories = [];
//     let id = parseInt(this.props.match.params.lvl1);
//     let subId = parseInt(this.props.match.params.lvl2);

//     let parentCategory;
//     let childCategory;

//     if(this.props.state.categories.length>0){
//       if(!id && !subId){
//         categories = this.props.state.categories.filter(item => !item.ParentId && !item.SubParentId);
//       }else if(id && !subId){
//         categories = this.props.state.categories.filter(item => item.Lvl2ParentMyId == id && !item.Lvl3ParentMyId);
//         parentCategory = this.props.state.categories.filter(item => item.Id == id)[0];

//       }else{
//         categories = this.props.state.categories.filter(item =>  item.Lvl3ParentMyId == subId);
//         parentCategory = this.props.state.categories.filter(item => item.Id == id)[0];
//         childCategory= this.props.state.categories.filter(item => item.Id == subId)[0];
//       }
//     }
//     let lang = this.props.state.lang;
// 		if (categories.length) {
// 		return (
		// <div className='flex-container'>
		// 	<div className='col-lg-2 right_side_header'>
		// 		<SideHeader/>
		// 	</div>
		// 	<div className='col-lg-10 left_side_content'>
		// 		<div className="category-view">
		// 			<div className="heading">
		// 				{this.state.preload ?
		// 					<div className="spinner-wrapper">
		// 						<div className="spinner">
		// 							<div className="bounce1"></div>
		// 							<div className="bounce2"></div>
		// 							<div className="bounce3"></div>
		// 						</div>
		// 					</div>
		// 				: null}
		// 			</div>

		// 	{/* <Stages props={this.props}/> */}

		// 			<div className="container categories categories_category">
		// 					{categories.map((element, index) => {
		// 						return(
		// 							<>
		// 								<div key={index} className="">
		// 									<NavLink to={ ('/categoryItems/' + element.Id + "/0/0/")}>
		// 										{/* <div className="wrapper"> */}
		// 											<h2><span>{element.Title}</span></h2>
		// 										{/* </div> */}
		// 									</NavLink>
		// 								</div>
		// 								<div className='flex-container categories_content'>
		// 									{product.map((item, key) => (
		// 										<div  key={key} className='col-lg-4'>
		// 											<div className='categories_content_card'>
		// 												<img className='categories_content_card_img' src='#'/>
		// 												<h4>{item.title}</h4>
		// 												<p>{item.kg}</p>
		// 											</div>
		// 										</div>
		// 									))}
		// 								</div>
		// 							</>
		// 						);
		// 					})}
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>

// 		)
// 	} else return null;
// 	}
// }