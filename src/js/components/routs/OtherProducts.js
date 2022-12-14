import React from 'react';
import { globalFileServer } from '../enums/global';

const data = [
    {id:1, img:globalFileServer + '/shaniIcons/Asset 38.svg', title:'עולם חכם יותר ונטול תפתחות', desc:'המנעול החכם של KEYLESS מספק לאורחי מלונות, צימרים ובתי נפוש חווית אירוח מדהימה, בה הם מקבלים מבעוד מועד הודעה עם אפשרות לצ"ק אין מראש ומפתח דיגיטלי אישי שתקף למשך כל שהותם ביחידת ההארחה. הטכנולוגיה החכמה מתחברת לכל סוגי המנעולים החשמליים ומאפשרת פתיחה מהירה ומאובטחת של הדלת ללא מתפח. זיהוי המשתמש מתבצע באמצעות טביעות אצבע/סריקת פנים/סריקת קרנית, כך שהאבטחה הינה גבוה ביותר וזיהוי המשתמש הוא מהימן ומדויק. המערכת מותאמת כמו כן לבעלי בתים ודיירים, משרדים, חללים משותפים ומתקנים ומבנים מקוחרים.'},
    {id:2, img:globalFileServer + '/shaniIcons/Asset 39.svg', title:'מייצרים עסקה אידיאלית', desc:`מערכת אורורה הינה זירת מסחר חכמה העונה על הצרכים של בעלי העקסים הסיטונאיים והקמעונאים ביעילות ובנגישות גבוההץ המערכת מבצעת את החיבור בין ספקים ללקוחתיהם ומדמה את כלל שלבי הסחר המתרחשים בעולם האימיתי כאשר האלגוריתם החכם שלה יודע לייצר עסקה אופטימלית לשני הצדדים.`},
    {id:3, img:globalFileServer + '/shaniIcons/Asset 40.svg', title:'פיתוח זרוע און ליין לעסקים', desc:`חברת קסיפאה מספקת ללקוחות הקבוצה פיתרון כולל לביצוע מכירות און ליין, המערכת המתקדמת "קופה חכמה" מורכבת מחנות אינטרגטית מותאמת אישית למיתוג ומלאי העסק, ומשירות משלוחים בשיתוף פעולה עם חברות גט טקסי ויאנגו המאפר פריסה ארצית של משלוחים לכל עסקץ המערכת בעלת ממשק וח וקל לתפעול וניתן לנהל דרכה את קטלוג המוצרים, המבצעים, מועדוני המחירונים וכיו"ב וכן להפיק דו"חות חכמים לניתוח וניהול ביצועים.`}
]
const OtherProducts = () => {
    return (
        <div className='otherProducts'>
            <div className='otherProducts__container'>
                <div className='otherProducts__body'>
                    {data.map((item) => 
                        <div className='otherProducts__content'>
                            <div className='otherProducts__content__aligned'>
                                <img src={item.img}/>
                                <h2>{item.title}</h2>
                                <p>{item.desc}</p>
                                <button>ספרו לי עוד</button>
                            </div>

                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default OtherProducts;