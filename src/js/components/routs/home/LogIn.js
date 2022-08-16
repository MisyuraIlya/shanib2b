import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';
import { NavLink, useHistory } from "react-router-dom";

export default class LogIn extends Component {
	constructor(props){
		super(props);
		this.state = {
      email: "",
      pass:""
		}


  }
	componentWillMount(){
	}
	componentWillUnmount(){
	}

  signIn = async () => {

    $('#password').blur();
    let val = {
      userName: this.state.email,
      password: this.state.pass,
      funcName: 'LogIn',
      point: 'user',
    };
    try {
      const data = await this.props.ajax(val);
      if (data.result == "success") {
        SweetAlert({
          title: 'ברוכים הבאים',
          text: '',
          type: 'success',
          timer: 3000,
          showConfirmButton: false
        }).then(function () {
          let siteVer = localStorage.siteVer;

          if(data.role =="super_user"){
            localStorage.clear();
            localStorage.setItem('adminId', data.adminId);
            localStorage.setItem('name', data.name);
            localStorage.setItem('role', data.role);
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('token', data.token);
          }else{
            localStorage.setItem('user', JSON.stringify(data.user));

          }
          localStorage.siteVer = siteVer;

          location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      }
      if (data.result == "not-found") {
        SweetAlert({
          title: 'שם משתמש או סיסמה אינם נכונים',
          text: 'אנא נסה שנית או שחזר סיסמה',
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {}.bind(this)).catch(SweetAlert.noop);
      }

    } catch(err) {
      console.log('connection error sign in',err);
    }


  }

  sendPass = async() =>{

    let val = {
      'Email': this.state.email, 'siteUrl': entry
    };
    const valAjax = {
      funcName: 'ForgotPass',
      point: 'data',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
debugger;
      if (data.result == "success") {
        if (data.mail) {
          this.sendPassStatos(data.mail, data.random);
          SweetAlert({
            title: 'קוד הבקשה נשלח לכתובת המייל',
            text: 'יש לעבור לתיבת הדואר',
            type: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {

            this.setState({forgotPass: 'stepTwo',pass: ""});
          }.bind(this)).catch(SweetAlert.noop);
        } else {
          SweetAlert({
            title: 'מייל לא קיים',
            text: 'אנא פנה לשירות תמיכה',
            type: 'error',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {
          }.bind(this)).catch(SweetAlert.noop);
        }
      }
      if (data.result == "not-found") {
        SweetAlert({
          title: 'משתמש לא קיים',
          text: 'אנא נסה שנית',
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
        }).catch(SweetAlert.noop);
      }

    } catch(err) {
      console.log('connection error b2b_registration');
    }

	}

  restorePass = async() =>{
		if (this.state.pass == this.state.confirmPass) {
			let val = { 'UserCod': this.state.requestCode, 'pass': this.state.pass };

      const valAjax = {
        funcName: 'RestorePassword',
        point: 'data',
        val: val
      };
      try {
        const data = await this.props.ajax(valAjax);

        if (data.result == "success") {
          SweetAlert({
            title: 'הסיסמה עודכנה בהצלחה',
            text: '',
            type: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(function() {
            this.setState({forgotPass: false});
          }.bind(this)).catch(SweetAlert.noop);
        }
        if (data.result == "not-found") {
          SweetAlert({
            title: 'קוד האיפוס אינו תקין',
            text: 'אנא נסה שנית',
            type: 'error',
            timer: 3000,
            showConfirmButton: false,
          }).catch(SweetAlert.noop);
        }

      } catch(err) {
        console.log('connection error b2b_registration');
      }


		} else {
			SweetAlert({
				title: 'סיסמה אינה תואמת',
				text: 'אנא נסה שנית',
				type: 'error',
				timer: 3000,
				showConfirmButton: false,
			}).catch(SweetAlert.noop);
		}
	}

  sendPassStatos(mail, random){
		let val = { 'Random': random, 'Mail': mail, 'SiteUrl': location.origin ,'SiteName': globalSiteName};
		$.ajax({
			url: 'https://statos.co/statos_web_mail/restore_pass_glb.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
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
                <h3>{ "כניסה"}</h3>
                <div className="input-cont">
                  <p>{"מייל"}</p>
                  <input type="text" onChange={(e)=> this.setState({email: e.target.value})} value={this.state.email} />
                </div>
                <div className="input-cont">
                  <p>{ "סיסמה"}</p>
                  <input id="password" onKeyPress={(e) => e.charCode == 13 ? this.signIn() : null} type="password" onChange={(e)=> this.setState({pass: e.target.value})} value={this.state.pass} />
                </div>


                <div className="first-time">
                  <p>פעם ראשונה?</p>
                  <NavLink to="/register">
                    <p>להרשמה</p>
                  </NavLink>

                </div>

                <div className="actions">
                  {this.state.pass && this.state.pass ?
                    <div className="send btn-cont">
                      <button onClick={()=> this.signIn()}>היכנס</button>
                    </div>
                  :
                  <div className="accept btn-cont">
                    <button>היכנס</button>
                  </div>
                  }
                </div>
                <p onClick={() => this.setState({forgotPass : "stepOne"})} className="forgot-pass">שחזר סיסמה</p>
                {this.state.forgotPass ?
                  <div className="forgot-pass-wrapp">
                    <div className="forgot-password">
                      <div className="cancel">
                        <div onClick={()=> this.setState({forgotPass : false})}>
                          <img src={globalFileServer + 'icons/close.svg'} alt="" />
                        </div>
                      </div>
                      {this.state.forgotPass == "stepOne" ?
                        <div>
                          <h3>אנא הקלידו את כתובת המייל שלכם</h3>
                          <input type="text" onChange={(e)=> this.setState({email: e.target.value})} placeholder="אימייל" value={this.state.email} />
                          <button onClick={this.sendPass}>שלח</button>
                        </div> : null}
                      {this.state.forgotPass == "stepTwo" ?
                        <div>
                          <h3>אנא הקלד קוד הבקשה וסיסמה חדשה</h3>
                          <input type="text" onChange={(e)=> this.setState({requestCode: e.target.value})} placeholder="קוד הבקשה" value={this.state.requestCode} />
                          <input type="text" onChange={(e)=> this.setState({pass: e.target.value})} placeholder="סיסמה חדשה" value={this.state.pass} />
                          <input type="text" onChange={(e)=> this.setState({confirmPass: e.target.value})} placeholder="אימות סיסמה חדשה" value={this.state.confirmPass} />
                          <button onClick={this.restorePass}>שלח</button>
                        </div> : null}
                    </div>
                  </div>
                : null}
              </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
