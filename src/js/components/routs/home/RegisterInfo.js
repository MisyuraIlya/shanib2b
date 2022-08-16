import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';
import { NavLink, useHistory } from "react-router-dom";

export default class RegisterInfo extends Component {
	constructor(props){
		super(props);
		this.state = {
      email: "",
      phone:"",
      pass:"",
      confirmPass:"",
      passError: false,

		}
  }

	componentWillMount(){
	}
	componentWillUnmount(){
	}
  isANumber(str){
		if(/^\d+$/.test(str) || str == "") { return true; } else { return false; }
	}
	validateEmail(email) {
		if(email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
			return true;
		} else {
			return false;
		}
	}
  emptyData(){
		SweetAlert({
			title: 'פרטים חסרים',
			text: 'אנא מלא את כל השדות ואשר את תנאי השימוש',
			type: 'info',
			timer: 4000,
			showConfirmButton: false,
		});
	}
  register = async () => {

    this.setState({preload:true});

    let validMail = this.validateEmail(this.state.email);
    if (validMail && this.state.pass == this.state.confirmPass) {
      let date = new Date();

      let val = {
        'ExId': this.props.match.params.ExId,
        'Password': this.state.pass,
        'Mail': this.state.email,
      };
      const valAjax = {
        funcName: 'B2bRegistration',
        point: 'user',
        val: val
      };


      try {
        const data = await this.props.ajax(valAjax);
        this.setState({preload:false});
        if (data.result == "success") {
          this.signIn();
        }
        if (data.result == "already_exists") {
          SweetAlert({
            title: 'שם משתמש קיים',
            text: 'אנא ציין כתובת מייל שונה ונסה שוב',
            type: 'info',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {});
        }
        if (data.result == "error") {
          SweetAlert({
            title: 'שגיאה',
            text: 'אנא צור קשר',
            type: 'info',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {});
        }
      } catch(err) {
        console.log('connection error b2b_registration');
      }

    } else {
      !validMail ? this.setState({mailError: true}) : null;
      this.state.pass !== this.state.confirmPass ? this.setState({passError: true}) : null;
    }
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
          this.props.history.push('/');

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
      console.log('connection error sign in');
    }


  }
	render(){

		return (
			<div className="login-page userEntry" id="userEntry">
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
                  <h3>{ "אנא הזן את הפרטים הבאים"}</h3>
                  <div className="input-cont">
                    <p>{"כתובת מייל"}</p>
                    <input type="text" onChange={(e)=> this.setState({email: e.target.value})} name="user_name" value={this.state.email} className={this.state.mailError ? "error" : null}  />
                  </div>

                  <div className="input-cont">
                    <p>{ "סיסמה"}</p>
                    <input type="password"
                      className={this.state.passError ? "error" : null}
                      onChange={(e)=> this.state.passError ? this.setState({pass: e.target.value, passError: false}) : this.setState({pass: e.target.value})}
                      name="pass" value={this.state.pass}
                    />
                  </div>
                  <div className="input-cont">
                    <p>{"אימות סיסמה"}</p>
                    <input type="password"
                      className={this.state.passError ? "error" : null}
                      onChange={(e)=> this.state.passError ? this.setState({confirmPass: e.target.value, passError: false}) : this.setState({confirmPass: e.target.value})}
                      name="confirmPass" value={this.state.confirmPass}
                    />
                  </div>
                  <div className="terms-and-conditions">
                    <div className="checkboxes-and-radios">
                      <input type="checkbox"
                        onChange={(e)=> this.setState({termsAndConditions: e.target.checked})}
                        name="checkbox-cats" checked={this.state.termsAndConditions}
                      id="checkbox-3" value="3" />
                      <label htmlFor="checkbox-3"></label>
                    </div>
                    <span>{"קראתי ואני מסכים "}<a target="_blank" href={globalFileServer + 'policy_form.pdf'}>לתנאי השימוש</a></span>
                  </div>
                  <div className="actions">
                    {this.state.email && this.state.termsAndConditions && this.state.pass && this.state.confirmPass ?
                      <div className="send">
                        <button onClick={() => this.register()}>צור חשבון</button>
                      </div>
                    :
                    <div className="accept">
                      <button onClick={() => this.emptyData()}>צור חשבון</button>
                    </div>
                    }
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
