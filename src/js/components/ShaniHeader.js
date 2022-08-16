import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { pageRoutes } from './enums/routes';
import { useCart } from '../state/CartProvider';
import SweetAlert from 'sweetalert2';
import { useHistory } from 'react-router-dom';

const ShaniHeader = (props) => {
    console.log('here',props.toggleMenu)
    const [userOptions, setUserOptions] = useState(false);
    const {cart} = useCart();
    const history = useHistory();
    const [activeNavAdmin, setActiveNavAdmin] = useState(false)
    const localStorageClear = (isAgent) => {
        let tmpLocalStorage = JSON.stringify(localStorage);
        let siteVer = localStorage.siteVer;
    
    
        localStorage.clear();
        tmpLocalStorage = JSON.parse(tmpLocalStorage);
        if(tmpLocalStorage.agent && isAgent!="agent"){
          localStorage.setItem('agent', tmpLocalStorage.agent);
          localStorage.setItem('agentExId', tmpLocalStorage.agentExId);
          localStorage.setItem('agentName', tmpLocalStorage.agentName);
          localStorage.setItem('agentToken', tmpLocalStorage.agentToken);
          localStorage.setItem('sessionId', tmpLocalStorage.sessionId);
        }
        tmpLocalStorage.notifications ? localStorage.setItem('notifications', tmpLocalStorage.notifications) : null;
        tmpLocalStorage.logMail ? localStorage.setItem('logMail', tmpLocalStorage.logMail) : null;
        tmpLocalStorage.logPass ? localStorage.setItem('logPass', tmpLocalStorage.logPass) : null;
    
        localStorage.siteVer = siteVer;
    
        if(isAgent=="agentForUser"){
          this.setState({productsInCart:[],user:false});
        }else{
          setTimeout(() => location.reload(), 200);
        }
    
    
    }

    const signOut = (user) => {
    if(this.state.productsInCart.length==0 && user == "agentForUser"){
        this.localStorageClear(user);
    }else{
        SweetAlert({
        title: 'האם אתה בטוח?',
        text: 'כל העסקאות והמוצרים מהעגלה יימחקו.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22b09a',
        cancelButtonColor: '#d80028',
        confirmButtonText: 'אשר',
        cancelButtonText: 'בטל'
        }).then(function(res) {
        if (res.value) {
            this.localStorageClear(user);
        }
        }.bind(this)).catch(SweetAlert.noop);
    }
    }

    const exitFromUser = () => {
		SweetAlert({
            title: 'ברצונך לצאת מהמערכת?',
            type: 'info',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'אשר',
            cancelButtonText: 'בטל'
            }).then((check) => {
                if(check.value){
                    history.push('/');

                    localStorage.clear();
                    location.reload(true);
                
                } 
            })
    }
    console.log(activeNavAdmin)
    return (
    <div className='head_cont'>
        <div className='flex-container header_container'>
            <div className='col-lg-3 right_header'>

                {localStorage.role || localStorage.agent ?
                    <div  className="menu-new" onClick={() => props.toggleMenu()}>
                        <img src={globalFileServer + 'icons/head_icons/menu_new.svg'} />
                    </div>
                :null}

                <div className='circle_cont' onClick={() => setUserOptions(!userOptions)}>
                    <img src={globalFileServer + 'userPlaceholder.png'} style={{width:'25px',height:'35px'}}/>
                    {userOptions ? 
                        <div className='user_options'>
                            <div>
                                <h5 onClick={() => history.push('/')}>שלום {JSON.parse(localStorage.user).Name}</h5>
                                <div className='exit' onClick={exitFromUser}>
                                    <h4>יציאה</h4>
                                </div>
                            </div>
                        </div> 
                        : null}

                </div>
                <div className='circle_cont'>
                    <NavLink to={'/standing-order'}>
                    <div className='circle_count'>
                        {cart.length}
                    </div>
                    <img src={globalFileServer + '/shaniIcons/Asset 60.svg'}/>
                    </NavLink>
                </div>
                {/* <div className='circle_cont'>
                    <img src={globalFileServer + '/shaniIcons/Asset 59.svg'}/>
                </div> */}
            </div>
            <div className='col-lg-3 center_header'>
                {/* <div className='flex-container center_header_search_component'>
                    <div className='col-lg-2 center_header_search_component_img'>
                        <img src={ globalFileServer + 'search.png'}/>
                    </div>
                    <div className='center_header_search_component_img_search col-lg-10'>
                        <input type='text' />
                    </div>
                </div> */}
            </div>
            <div className='col-lg-6 left_header'>
                {pageRoutes.map((item,index) => (
                    <div className='col-lg-4 header_card' key={index}>
                        <NavLink to={item.link}>
                            <h4>{item.title}</h4>
                        </NavLink>
                    </div>

                ))}
            </div>
        </div>
    </div>
    );
};

export default ShaniHeader;