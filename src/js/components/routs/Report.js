import ReactDOM from "react-dom";

import React, { Component, Fragment, useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import SweetAlert from 'sweetalert2';
import UserContext from '../../UserContext';
import MyCropper from "../tools/MyCropper";




export default class Report extends Component {
	constructor(props){
		super(props);
		this.state = {
      Phone:"",
      Mail:"",
      Name:"",
      ExId:"",
      Topic:"",
      Comment:"",
      imgUrl:"",//100004_12038.png
      destCodes:[],
      destCodeChosen:false,
      openSelect:false
    }
	}
	componentDidMount(){
    let user = false;
    user = JSON.parse(localStorage.user);

    if(user){
      this.setState({ExId: user.ExId});
      this.getDestCodes(user.ExId);

    }
    setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
  }

  getDestCodes = async(exId)=>{
    let userExId = exId;

    const valAjax = {
      funcName: 'GetAtarim',
      point: 'data',
      exId: userExId
    };

    try {
      const data = await this.props.ajax(valAjax);

      if(data.result=='success'){

        this.setState({destCodes: data.DestCodes})
      }
    } catch(err) {
      console.log('connection error order');
    }
  }


  setInputState = (param, val) =>{
    this.setState({[param]:val})
  }

  setPreload=()=>{
    this.setState({preload: true});
  }
  unsetPreload=()=>{
    this.setState({preload: false});
  }

  uploadImg = async(data)=>{
		this.setPreload();
    let fileName = this.state.ExId + '_' + data.fileName
		let valAjax = {
			'funcName': 'UploadImg',
      'point': 'data',
			'fileName': fileName,
			'img': data.img,
			'folder': data.folder
		};

    try {
      const data = await this.props.ajax(valAjax);
      this.setState({imgUrl: fileName});
      this.unsetPreload();
    } catch(err) {
      console.log('connection error GetSales');
      this.setState({preload:false});
    }


	}


  sendReport = async () => {



    if(this.state.Name!='' && this.state.Phone!='' &&this.state.Mail!='' && this.state.Topic!='' &&this.state.Comment!='' && this.state.destCodeChosen){
      this.setPreload();
      let user;
      let userExId;
      localStorage.user ? user = JSON.parse(localStorage.user) : null;
      if(user){
        userExId = user.ExId;
      }
      let params;
      params = {
        Phone: this.state.Phone,
        Mail: this.state.Mail,
        Name: this.state.Name,
        Topic: this.state.Topic,
        Comment: this.state.Comment,
        imgUrl: this.state.imgUrl,
        userExId: userExId,
        destCodeChosen:this.state.destCodeChosen
      }

      params = JSON.stringify(params);

      const valAjax = {
        funcName: 'WriteReport',
        point: 'data',
        params: params
      };

      try {
        const data = await this.props.ajax(valAjax);

        this.unsetPreload();

        if (data.result == "success" && data.confirmation) {
          this.props.history.push('/successPage/' + data.confirmation + "/2");
        } else {
          this.orderError();
        }
      } catch(err) {
        console.log('connection error order');
        this.unsetPreload();

      }
    }else{
      this.emptyData();
    }

  }


  orderError = () => {
    this.setState({preload:false});
    SweetAlert({
      title: 'שליחת קריאה נכשלה',
      text: 'אנו צרו קשר עם מוקד התמיכה',
      type: 'error',
      showConfirmButton: true
    }).then(function(res) {
      if (res.value) {
        location.reload();
      }
    }.bind(this)).catch(SweetAlert.noop);
  }


  emptyData(){
    SweetAlert({
      title: 'פרטים חסרים',
      text: 'אנא מלא את כל השדות',
      type: 'info',
      timer: 4000,
      showConfirmButton: false,
    });
  }

  selectChosen = async (element) => {

    this.setState({destCodeChosen:element.Code, openSelect:false})

  }

	render(){


		return (
			<div className="report">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        : null}
        <div className="report-container">
          <div className="report-main">
            <div className="wrapper report-sub-cont">
              <div className="sup-wrapper">
                <h1>{"טופס קריאת שירות"}</h1>
                <div className="inputs-cont">
                  <div className="inputs-subcont">

                    {this.state.destCodes && this.state.destCodes.length ?
                      <div className={this.state.openSelect ? "select active padding" : "select padding"}>
                        <div onClick={this.state.openSelect ? () => this.setState({openSelect:false}) : () => this.setState({openSelect:true})} className="headind">
                          <p>{this.state.destCodeChosen ? this.state.destCodeChosen : 'בחר אתר'}</p>
                          <div className="img">
                            <img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
                          </div>
                        </div>
                        <div className={this.state.openSelect ? "masc active" : "masc"}>
                          <ul>
                            {this.state.destCodes.map((ele,ind) => {
                              return(
                                <li key={ind}>
                                  <div className="mask-li-cls" onClick={() => this.selectChosen(ele)}>
                                    <span>{ele.Code + ' | ' +ele.CODEDES}</span>
                                    <div className="img">
                                      <img src={globalFileServer + 'icons/back-select.svg'} alt=""/>
                                    </div>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    :null}

                    <div className="input-div">
                      <div className="input-div-cont">
                        <input
                          type="text"
                          value={this.state.Name ? this.state.Name : ""}
                          placeholder="שם מלא"
                          onChange={(e) => this.setInputState("Name", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-div half first">
                      <div className="input-div-cont">
                        <input
                          type="text"
                          value={this.state.Mail ? this.state.Mail : ""}
                          placeholder="כתובת מייל"
                          onChange={(e) => this.setInputState("Mail", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-div  half">
                      <div className="input-div-cont">
                        <input
                          type="text"
                          value={this.state.Phone ? this.state.Phone : ""}
                          placeholder="מספר טלפון"
                          onChange={(e) => this.setInputState("Phone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="input-div">
                      <div className="input-div-cont">
                        <input
                          type="text"
                          value={this.state.Topic ? this.state.Topic : ""}
                          placeholder="נושא הפנייה"
                          onChange={(e) => this.setInputState("Topic", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-div">
                      <div className="input-div-cont">
                        <textarea
                          placeholder=""
                          type="text"
                          value={this.state.Comment ? this.state.Comment : ""}
                          placeholder={"טקסט חופשי" }
                          onChange={(e) => this.setInputState('Comment', e.target.value)}
                          id="Msg"
                        />
                      </div>
                    </div>
                    <div className="main-img-cont flex-container">
                      <div className="input-div col-lg-5">
                        <div className="input-div-cont">
                          <div className="upload-btn-cont">
                            <div className="upload-btn-subcont">
                              <img src={globalFileServer + 'icons/upload.svg'} />
                              <p>הוסף תמונה</p>
                              <div className="attach">
              									<MyCropper
              										aspectRatio={16/16} {...this}
              										folder="reports"
              									/>
              								</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {this.state.imgUrl!="" ?
                        <div className="input-div col-lg-7">
                          <div className="del-cont">
                            <img className="delete-img"
                              onClick={()=> this.setState({imgUrl:""})}
                              src={globalFileServer + 'icons/delete.svg'}
                            />
                          </div>
                          <div className="input-div-cont uploaded-img-cont">
                            <img className="uploaded-img exists" src={globalFileServer + 'reports/'+this.state.imgUrl} />
                          </div>
                        </div>
                      :
                      <div className="input-div col-lg-7">
                        <div className="input-div-cont uploaded-img-cont">
                          <img className="uploaded-img" src={globalFileServer + 'placeholder.jpg'} />
                        </div>
                      </div>
                    }
                    </div>
                  </div>
                  <div className="send-btn-main">
                    <div onClick={()=>this.sendReport()} className="send-btn-subcont">
                        <p>שלח קריאה</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            <div className="send-btn-main-mob">
              <div onClick={()=>this.sendReport()} className="send-btn-subcont">
                  <p>שלח קריאה</p>
              </div>
            </div>
          </div>
        </div>


			</div>
		)
	}
}
