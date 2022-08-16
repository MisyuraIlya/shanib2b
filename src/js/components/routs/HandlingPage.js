import React from 'react';
import { globalFileServer } from '../enums/global';

const orderList = [
    {id:1, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:2, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:3, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:4, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:5, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:6, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:7, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},
    {id:8, date:'11/09/20', extId:'100659' ,img:globalFileServer + '/shaniIcons/Asset 56.svg', title:'טיפול תקופתי', desc:'החלפת פילטר מכונת גרניטה ניקוי צנרת מכונת אספרסו'},

]


const HandlingPage = () => {
    return (
        <div className='handling_page_container'>
            <div className='order_tech_list'>
                <div className='cards_list'>
                    {orderList.map((item) => (
                        <div className='flex-container card_list'>
                            <div className='col-lg-4 card_cont'>
                                <div className='card_img'>
                                    <div className='card_img_circle'> 
                                        <img src={item.img} />
                                    </div>
                                </div>
                                <div className='list_title'>
                                    <h1>{item.date}</h1>
                                    <p>טיפול {item.extId}</p>
                                </div>
                            </div>
                            <div className='col-lg-2 delimiter'>
                            </div>
                            <div className='col-lg-6'>
                                <h1>{item.title}</h1>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='order_tech'>
                <div className='tech_content'>

                    <div className='card_tech'>
                        <div className='tech_img'>
                            <img src={globalFileServer + '/shaniIcons/Asset 46.svg'}/>
                        </div>
                        <div className='tech_title'>
                            <h1>הזמנת טיפול</h1>
                            <p>אם קיינת תקלה דחופה טכנאי יישמח להגיע במהירות לטפל בה!</p>
                        </div>
                        <div className='tech_button'>
                            <button>הזמן</button>
                        </div>
                    </div>

                    <div className='card_tech'>
                        <div className='tech_img'>
                            <img src={globalFileServer + '/shaniIcons/Asset 45.svg'}/>
                        </div>
                        <div className='tech_title'>
                            <h1>הזמנת טיפול</h1>
                            <p>אם קיינת תקלה דחופה טכנאי יישמח להגיע במהירות לטפל בה!</p>
                        </div>
                        <div className='tech_button'>
                            <button>הזמן</button>
                        </div>
                    </div>

                    <div className='card_tech'>
                        <div className='tech_img'>
                            <img src={globalFileServer + '/shaniIcons/Asset 44.svg'}/>
                        </div>
                        <div className='tech_title'>
                            <h1>הזמנת טיפול</h1>
                            <p>אם קיינת תקלה דחופה טכנאי יישמח להגיע במהירות לטפל בה!</p>
                        </div>
                        <div className='tech_button'>
                            <button>הזמן</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default HandlingPage;