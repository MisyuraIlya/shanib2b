import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink, useParams } from "react-router-dom";
import UserContext from '../../UserContext';

const SecondLevel = params => {
  const [active, setActive] = useState(false);
  const app = useContext(UserContext);
  let params2 = useParams();
  let { lvl1, lvl2, lvl3} = params2;

  useEffect(() => {
    setActive(params.parentCategory.Id);
  }, []);

  const toggleActive = (id) => {
    if(id == active){
      setActive(false);
    }else{
      setActive(id);
    }
  }

  let element = params.element;
  let child = params.child;

  return(
    <div className="col">
      <NavLink to={'/category/' + params.element.Id + "/0/0/" + app.state.lang}>
        <h3 className={element.Id == params.parentCategory.Id ? "active" : null} onClick={()=> toggleActive(element.Id)}>{element.Title}</h3>
      </NavLink>
      <ul className={active == element.Id && child && child.length ? "active" : null}>
        {child.map((el, ind) => {

          return (
            <li key={ind}>
              <NavLink className={el.Id == lvl2 ? 'active-a' : null} to={'/category/' + element.Id + "/" + el.Id + "/" + 0 + "/" + app.state.lang}>{el.Title}</NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

const CategorySlide = params => {

  const [open, setOpen] = useState(false);

  const app = useContext(UserContext);
  let params2 = useParams();
  let { lvl1, lvl2, lvl3} = params2;

  let parentCategory = app.state.categories.filter(item => item.Id == lvl1)[0];
  let childCategory = app.state.categories.filter(item => item.Id == lvl2)[0];
  let subChildCategory = app.state.categories.filter(item => item.LvlNumber=="1")[0];


  const getSecondLavel = () => {

		let secondLavel = app.state.categories.filter(item => item.LvlNumber=="1");
		return secondLavel;
	}
    return (
      <div className={open ? "category-slidebar-super-main-cont open" : "category-slidebar-super-main-cont closed"}>
        <div onClick={()=> setOpen(!open)} className="close-cont">
          {open ?
            <img src={globalFileServer + 'icons/close.svg'} />
          :
            <img className="open" src={globalFileServer + 'icons/mobile-filter.svg'} />
          }
        </div>
        <div className="category-slidebar-main-cont">
          <div className="category-slidebar-fixed-cont">
            {/*
            <div className="close-cont">
              <img src={globalFileServer + 'icons/close.svg'} />
            </div>
            */}
            <div className="category-slidebar-cont">
            {app.state.categories.length ?
              <div className="category-slidebar-subcont">

                  <div className="lvl1-title-cont">
                    <img src={parentCategory && parentCategory.Img ? globalFileServer + 'categories/' + parentCategory.Img : globalFileServer + 'logo.png'} />
                    <h1>כל הקטגוריות</h1>
                  </div>
                  <div className="category-list-cont">
                    <div className="category-list-subcont" onClick={()=> setOpen(!open)}>

                    {getSecondLavel().map((element, index) => {
                      let child = app.state.categories.filter($item => $item.ParentId == element.Id && $item.LvlNumber == "2");

                      if(child){
                        return (
                          <SecondLevel key={index} allCategories={app.state.categories} element={element} child={child} parentCategory={parentCategory} childCategory={childCategory} subChildCategory={subChildCategory}/>
                        );
                      }
                    })}

                    </div>
                  </div>

              </div>
              :null}
            </div>
          </div>
        </div>
      </div>
    )

}
export default CategorySlide;
