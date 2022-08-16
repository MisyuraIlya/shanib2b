import React from 'react';
import SideHeader from '../tools/SideHeader';


const roasts = [
    {id:1, kg:'7.5', title:'פולים קלויים שמוכנים לאיסוף'},
    {id:2, kg:'8.5', title:'פולים קלויים שמוכנים לאיסוף'},
    {id:3, kg:'9.5', title:'פולים קלויים שמוכנים לאיסוף'},
]

const credists = [
    {id:1, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:2, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:3, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:4, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:5, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:6, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:7, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
    {id:8, date:'18/9/20', title:'נסמרו 18 ק"ג קפה קלוי החשבון זוכה ב -22 ש"ח'},
]
const Roasting = () => {
    return (
        <div className='flex-container roasting_order_container'>
        {/* <div className='col-lg-2 right_side_header'>
            <SideHeader/>
        </div> */}
        <div className=''>
            <div className='flex-container roasting_container'>
                <div className='col-lg-6 roast_card'>
                    <div className='roast_card'>
                        <div className='roasts_cont'>
                            <div className='rasts_title'>
                                <h1>7.5 KG</h1>
                                <p>פולים קלויים שמוכנים לאיסוף</p>
                                <button>עדכן כמות</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='credits'>
                        <div className='credits_content'>
                            <h1>הסטוריית זיכויים</h1>
                            {credists.map((item) => (
                                <div>
                                    <h2>{item.date}</h2>
                                    <span>{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    );
};

export default Roasting;