import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';
import { NavLink, useHistory } from "react-router-dom";

export default class SuccessPage extends Component {
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


	render(){

    let type="";
    let title = "";
    if(this.props.match.params.Type){
      if(this.props.match.params.Type=='1'){
        type = "מס' הזמנה:";
        title = "הזמנתך נשלחה בהצלחה!";
      }else if(this.props.match.params.Type=='2'){
        type = "מס' קריאה:";
        title = "קריאת שירות נשלחה בהצלחה!";
      }
    }
    
		return (
			<div className="login-page userEntry success">
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
                <img className="user_icon" src={globalFileServer + 'icons/done.svg'} />
                <h3>{title}</h3>
                <div className="details-cont">
                  <p>{type}</p>
                  <p className="number">{this.props.match.params.ExId ? this.props.match.params.ExId : ""}</p>
                </div>
                <div className="actions">
                  <div className="send btn-cont">
                    <NavLink to="/">
                      <button>חזור לעמוד ראשי</button>
                    </NavLink>

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
