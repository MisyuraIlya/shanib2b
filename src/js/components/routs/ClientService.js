import React, { useState } from 'react';
import { globalFileServer } from '../enums/global';
import { ajax } from 'jquery';
const contacts = [
    {id:1, title:'073-3743750', img:globalFileServer + '/shaniIcons/Asset 43.svg'},
    {id:2, title:'view@shanishenhav.com', img:globalFileServer + '/shaniIcons/Asset 42.svg'},
    {id:3, title:'073-3743750', img:globalFileServer + '/shaniIcons/Asset 41.svg'},
]




const ClientService = () => {

  const [textValue, setTextValue] = useState('');


const sendEmail = async () => {


    if(textValue){
  
        let valMail = {
          siteName: globalSiteName,
          from: this.props.props.state.defaults.statosMail,
          to: this.props.props.state.defaults.toMail,
          name: this.state.name,
          mail: this.state.mail,
          phone: this.state.phone,
          company: this.state.company,
          message: this.state.msg
        };
  
        $.ajax({
          url: 'https://statos.co/statos_web_mail/ilya_newPhpMailer_6.6.3/index.php',
          type: 'POST',
          data: valMail,
          dataType: "json",
        }).done(function(d) {
          SweetAlert({
            title: 'הודעה נשלחה בהצלחה',
            type: 'success',
            showConfirmButton: false,
            timer: 4000
          }).catch(SweetAlert.noop);
  
          this.setState({name:"",mail:"",phone:"",msg:"",company:"",preload:false});
  
        }.bind(this)).fail(function() {
           console.log('error');
           this.setState({preload:false});
        }.bind(this));
      }else{
        SweetAlert({
          title: 'אנא מלא את כל השדות',
          type: 'info',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
      }
}

    return (
        <div className='client_service_container'>
            <div className='service_container_block'>
                <div className='send_cleint_card'>
                    <div className='content_card_client'>
                        <h2>שירות לקוחות</h2>
                        <p>נשמח לענות לך על כל שאלה</p>
                        <input type="text" placeholder='רציתי לספר לכם ש...' value={textValue} onChange={(e) => setTextValue(e.value.target)}/>
                        <button onClick={() => sendEmail()}>שלח</button>
                    </div>
                </div>
                <div className='client_service_contact'>
                    <h2>דרכי התקשרות נוספות</h2>
                    <div className='flex-container'>
                        {contacts.map((item) => (
                        <div className='col-lg-4 card_service'>
                            <div>
                                <div className='circle'>
                                    <img src={item.img} />
                                </div>
                                <p>{item.title}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientService;