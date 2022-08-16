import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import MyCropper from "../tools/MyCropper";
import SweetAlert from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default class CategoriesEdit extends Component {
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			constCategories: [],
			preload: false,
			masc: false,
			search: "",
			seo: false,
			load: false
		}
		this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
		this.editItem = this.editItem.bind(this);
		this.search = this.search.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
	}
	componentDidMount(){
		this.getCategories();
		window.scrollTo(0, 0);
		setTimeout(() => window.scrollTo(0, 0), 100);
	}
	componentWillReceiveProps(nextProps){

		if (this.props.match.params.parentId != nextProps.match.params.parentId || this.props.match.params.subId != nextProps.match.params.subId) {
      let prevId = parseInt(this.props.match.params.id);
			let nextId = parseInt(nextProps.match.params.id);
			var id = this.props.match.params.id;

      this.setState({categories: this.state.constCategories, search: ""});
      setTimeout(() => {window.scrollTo(0, 0)}, 200);
		}
	}
	search(e){
		let search = e.target.value;
    let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);
		let categories = [];
    if(!id && !subId){
      categories = this.state.constCategories.filter(item => !item.ParentId && !item.SubParentId && item.Title && item.Title.includes(search));

    }else if(id && !subId){
      categories = this.state.constCategories.filter(item => item.ParentId == id && !item.SubParentId && item.Title && item.Title.includes(search));
    }else{

      categories = this.state.constCategories.filter(item => item.SubParentId == id && item.Title && item.Title.includes(search));

    }
    this.setState({categories, search});

	}
	clearSearch(){
		this.setState({categories: this.state.constCategories, search: ""});
	}
	getCategories = async() => {

    const val = {
      funcName: 'getAllItems',
      point: 'categories'
    };
    try {
      const data = await this.props.ajax(val);

      this.setState({categories: data.categories, constCategories: data.categories, load: true});

    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
    }

	}
	setPreload(){
		this.setState({preload: true});
	}
	unsetPreload(){
		if (this.state.preload) {
			this.setState({preload: false});
		}
	}
	editItem(value, id, paramName){
		let categories = this.state.categories;
		categories.find(x => x.Id == id)[paramName] = value;
		this.setState({categories, constCategories: categories});
	}
  updateItems = async (value, id, paramName) => {
		let categories = this.state.categories;
		categories.find(x => x.Id == id)[paramName] = value;
		this.setState({categories, constCategories: categories});

    const val = {
      funcName: 'editItem',
      point: 'categories',
      token: localStorage.token,
			role: localStorage.role,
			funcName: 'editItem',
			itemId: id,
			paramName: paramName,
			value: value
    };

    try {
      const data = await this.props.ajax(val);
    } catch(err) {
      console.log('connection error editItem');
    }

	}
	uploadImg = async (data) => {
		this.setPreload();
    const val = {
      funcName: 'uploadImg',
      point: 'categories',
      token: localStorage.token,
			role: localStorage.role,
			fileName: data.itemId + data.fileName,
			img: data.img,
			folder: data.folder,
			itemId: data.itemId
    };

    try {
      const data = await this.props.ajax(val);

      let categories = this.state.categories;
      categories.find(x => x.Id == val.itemId).Img = val.fileName;
      this.setState({categories});
      this.unsetPreload();

    } catch(err) {
      console.log('connection error GetSales');
    }

	}
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    background: isDragging ? "#f9f9f9" : "#fff",
    ...draggableStyle
  });
  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#e5e5e5" : "#ddd",
  });
  onDragEnd = (result) => {

    if (!result.destination) {
      return;
    }

    let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);

    let parent = this.state.constCategories.filter(item => item.Id == id);
    let mainParent;

		let categories;

    if(!id && !subId){
      categories = this.state.categories.filter(item => !item.ParentId);
    }else if(id && !subId){
      categories = this.state.categories.filter(item => item.ParentId == id && item.LvlNumber == '2');
    }else{
      categories = this.state.categories.filter(item => item.ParentId == id && item.LvlNumber == '3');
    }


    const categoriesReorder = this.reorder(
      categories,
      result.source.index,
      result.destination.index
    );

		this.setNewOrder(categoriesReorder);

  }
	setNewOrder = async (items) => {

		let newOrder = [];
    let findItem;
    let categories= this.state.categories;
		items.map((element, index) => {
      element.Orden = index;
      categories.find(item => item.Id == element.Id).Orden = index;
		});
    categories.sort((a, b) => (a.Orden > b.Orden) ? 1 : -1)

    this.setState({ categories});

    const val = {
      funcName: 'orderItems',
      point: 'categories',
      token: localStorage.token,
      role: localStorage.role,
      items: JSON.stringify(items)
    };
    try {
      const data = await this.props.ajax(val);
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error orderItems');
    }


	}

	render(){
		if (this.state.constCategories && this.state.constCategories.length || this.state.load) {

    let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);

    let parent = this.state.constCategories.filter(item => item.Id == id);
    let mainParent;

		let categories;
    if(!id && !subId){
      categories = this.state.categories.filter(item => !item.ParentId);
    }else if(id && !subId){
      categories = this.state.categories.filter(item => item.ParentId == id && item.LvlNumber == '2');
    }else{
      categories = this.state.categories.filter(item => item.Lvl3ParentMyId == id);
      mainParent = this.state.constCategories.filter(item => item.Id == subId);
    }
    categories.sort((a, b) => (a.Orden > b.Orden) ? 1 : -1)

		return (
			<div className="category-edit">
				<div className="breadcrumbs">
					<div className="container">
						<div className="flex-container">
							<div className="col-lg-6">
							</div>
							<div className="col-lg-6">
								<ul>
									<li>
										<NavLink to="/"><img src={globalFileServer + 'icons/home.svg'} alt=""/></NavLink>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="container items-container">
					{this.state.preload ?
						<div className="spinner-wrapper">
							<div className="spinner">
								<div className="bounce1"></div>
								<div className="bounce2"></div>
								<div className="bounce3"></div>
							</div>
						</div>
					: null}
					<div className="add-item add-item-main">
						<div className="flex-container">
							<div className="col-lg-6">

							</div>
							<div className="col-lg-6">
								<div className="search">
									<input
										onChange={this.search}
										value={this.state.search}
										type="text"
										placeholder="חיפוש..."
									/>
									{this.state.search ?
										<img className="close" onClick={this.clearSearch} src={globalFileServer + "icons/close.svg"} alt=""/>
									:
									<img src={globalFileServer + "icons/search.svg"} alt=""/>
									}
								</div>
							</div>
						</div>
					</div>
					<div className="items">
						<div className="heading">
							<div className="flex-container">
								<div className="col-lg-1">
									<p>כניסה</p>
								</div>
								<div className="col-lg-1">
									<p>סדר</p>
								</div>
  								<div className="col-lg-2">
                    {this.props.match.params.subId =='0' || !this.props.match.params.subId =='0'?
  									  <p>תמונה</p>
                    :null}
  								</div>
                <div className="col-lg-1 product">
									<p style={{textAlign: 'right'}}>מזהה</p>
								</div>
								<div className={id && !subId ? "col-lg-3 product" : "col-lg-4 product"}>
									<p style={{textAlign: 'right'}}>כותרת</p>
								</div>
								<div className="col-lg-1">
									<p>סטאטוס</p>
								</div>
							</div>
						</div>

            <DragDropContext onDragEnd={this.onDragEnd}>
  						<Droppable droppableId="droppable">
  							{(provided, snapshot) => (
  							<div className="items" {...provided.droppableProps} ref={provided.innerRef} style={this.getListStyle(snapshot.isDraggingOver)}>
                  {categories.map((element, index) => {
                    let is_lvl3 = this.state.categories.filter((item) => {return item.ParentId == element.Id && item.LvlNumber == '3'});
                    let is_lvl2 = this.state.categories.filter((item) => {return item.ParentId == element.Id && item.LvlNumber == '2'});

                    return(
                      <div key={index} id={"item_" + element.Id} className="item">
                        <Draggable key={element.Id} draggableId={element.Id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className="item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >

                              <div className="flex-container">
                                <div className="col-lg-1 enter">
                                  {!id && !subId && is_lvl3.length == 0 && is_lvl2.length == 0 ?
                                    <NavLink to={"/products-edit/" + element.Id + "/null/null"}>
                                      <img src={globalFileServer + "icons/enter.svg"} alt=""/>
                                    </NavLink>
                                  :
                                  <Fragment>
                                    {id && subId || (id && !subId && is_lvl3.length == 0) ?
                                      <NavLink to={id && !subId && is_lvl3 ? "/products-edit/" + id + "/" + element.Id + "/null" : "/products-edit/" + subId + "/" + id + "/" + element.Id}>
                                        <img src={globalFileServer + "icons/enter.svg"} alt=""/>
                                      </NavLink>
                                    :
                                      <NavLink to={"/category-edit/" + element.Id + "/" + element.Lvl2ParentMyId}>
                                        <img src={globalFileServer + "icons/enter.svg"} alt=""/>
                                      </NavLink>
                                    }
                                  </Fragment>
                                  }


                                </div>
                                <div className="col-lg-1 sort">
                                  <img src={globalFileServer + "icons/drag.svg"} alt=""/>
                                </div>
                                <div className="col-lg-2 for-img">
                                  {this.props.match.params.subId =='0' || !this.props.match.params.subId =='0'?
                                    <div
                                      onMouseOver={() => this.state.masc != element.Id ? this.setState({masc: element.Id}) : null}
                                      onMouseLeave={() => this.setState({masc: false})}
                                      className={element.Img ? "img-load active" : "img-load"}>
                                      {element.Img ?
                                        <Fragment>

                                          <img
                                            className="main-img"
                                            src={globalFileServer + 'categories/' + element.Img}
                                            onLoad={this.unsetPreload}
                                          />
                                        </Fragment>
                                      : null}
                                      <MyCropper
                                        aspectRatio={16/16} {...this}
                                        itemId={element.Id}
                                        folder="categories"
                                      />
                                    </div>
                                  :null}
                                </div>
                                <div className={"col-lg-1 title"}>
                                  <p>{element.Id}</p>
                                </div>
                                <div className={id && !subId ? "col-lg-3 title": "col-lg-4 title"}>
                                  <input
                                    id={'input_' + element.Id}
                                    type="text"
                                    placeholder="שם הקטגוריה"
                                    value={element.Title ? element.Title : ""}
                                    onChange={(e) => this.editItem(e.target.value, element.Id, 'Title')}
                                    onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Title')}
                                  />
                                </div>
                                <div className="col-lg-1 status">
                                  {!element.Unpublished ?
                                    <div onClick={(e) => this.updateItems(1, element.Id, 'Unpublished')} className="input active">
                                      <img src={globalFileServer + "icons/done.svg"} alt=""/>
                                    </div>
                                  :
                                  <div onClick={(e) => this.updateItems(null, element.Id, 'Unpublished')} className="input">
                                    <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                                  </div>
                                  }
                                </div>
                              </div>
                            </div>
                          )}
  						 					</Draggable>
                      </div>
      							);
						      })}
                </div>
                )}
              </Droppable>
            </DragDropContext>
					</div>
				</div>
			</div>
		)
	} else return null;
	}
}
