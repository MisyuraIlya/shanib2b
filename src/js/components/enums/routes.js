import { globalFileServer } from "./global"

export const pageRoutes = [
    {id:1, title:'הזמנות', desc:'צור הזמנה חדשה והסתכל על היסרויית הזמנות', link:'/standing-order' , img:globalFileServer + '/shaniIcons/Asset 54.svg'},
    {id:1, title:'היסטוריית הזמנות', link:'/history-order' , img:globalFileServer + '/shaniIcons/Asset 54.svg'},
    {id:2, title:'נתוני צריכה', desc:'עקוב אחרי כמות הצריכה החודשית של חומרי גלם', link:'/statistics' , img:globalFileServer + '/shaniIcons/Asset 53.svg'},
    {id:3, title:'דיווח על תקלה', desc:'פתח קריאת שירות עבור מוצר תקול',  link:'/fault-page', img:globalFileServer + '/shaniIcons/Asset 55.svg'},
    // {id:4, title:'טיפולים ותחזוקה', desc:'צפה בהיסטוריית תחזוקה, הזמן הדרכה מקצועית ולקי חילוף', link:'/handling' , img:globalFileServer + '/shaniIcons/Asset 56.svg'},
    {id:5, title:'שירות לקוחות', link:'/service'},
    {id:6, title:'מוצרים נוספים', link:'/other-products'},
]