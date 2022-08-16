import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';
import { NavLink, useHistory } from "react-router-dom";

export default class RegisterCheck extends Component {
	constructor(props){
		super(props);
		this.state = {
      exId:"",
      phone:""
		}


  }
	componentWillMount(){
	}
	componentWillUnmount(){
	}

  checkB2bConn = async () => {

    if(this.state.exId!='' && this.state.phone!=""){


      this.setState({preload:true});

      const val = {
        funcName: 'Findb2bclient',
        point: 'user',
        exId: this.state.exId,
        phone: this.state.phone,

      };
      try {
        const data = await this.props.ajax(val);
        this.setState({preload:false});
        if (data.result == "success") {
          this.props.history.push('/registerInfo/' + this.state.exId);

        }else if(data.result == "registered"){
          SweetAlert({
            title: 'לקוח רשום. אנא היכנס בתור משתמש קיים.',
            text: 'במידה ואינך זוכר את הסיסמה באפשרותך לשחזרה',
            type: 'info',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {});
        }else if(data.result == "not-found"){
          SweetAlert({
            title: 'פרטי העסק לא נמצאו',
            text: 'צור קשר עם שירות לקוחות לצורך אימות פרטים - 0733743750',
            type: 'info',
            timer: 6000,
            showConfirmButton: false,
          }).then(function () {});
        }
      } catch(err) {
        //this.props.connectionError('connection error GetSales');
        console.log('connection error findb2bclient');
      }
    }else{
      SweetAlert({
        title: 'יש למלא את כל השדות',
        text: '',
        type: 'info',
        timer: 3000,
        showConfirmButton: false,
      }).then(function () {});
    }

  }


	render(){

		return (
			<div className="login-page userEntry">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        : null}
				<div className="popup-wrapper">
					<div className="wrapp">
						<div className="user-entry-wrapper">
							<div className="user-entry">
              <div className="login">
                <img className="user_icon" src={globalFileServer + 'user_icon.png'} />
                <h3>{ "אימות לקוח"}</h3>
                <div className="input-cont">
                  <p>{"מס' לקוח"}</p>
                  <input onKeyPress={(e) => e.charCode == 13 ? this.checkB2bConn() : null} type="text" onChange={(e)=> this.setState({exId: e.target.value})} value={this.state.exId} />
                </div>
                <div className="input-cont">
                  <p>{"מס' טלפון"}</p>
                  <input onKeyPress={(e) => e.charCode == 13 ? this.checkB2bConn() : null} type="text" onChange={(e)=> this.setState({phone: e.target.value})} value={this.state.phone} />
                </div>

                <div className="actions">
                  <div className="send btn-cont">
                    <button onClick={()=> this.checkB2bConn()}>המשך</button>
                  </div>
                </div>
              </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
