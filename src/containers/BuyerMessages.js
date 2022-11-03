import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { buyerActions, userActions, messageActions } from '../store/actions';
import { sellerActions } from '../store/actions';

import $ from "jquery";
import BuyerSidebar from "../components/Sidebar/BuyerSidebar";
import avatarDefault from '../res/img/default_avatar.png';

import "../res/css/BuyerMessages.css"
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class BuyerMessages extends React.Component{

  state =
  {
    'headerType': "buyer",
    contact: [],
    message: [],
    currentAdza: {},
    currentMsg: "",
    flag: false,
    curindex:0,
    wrap:false
  }

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount() {
    document.title = "Buyer Messages"
  }

  componentWillMount() {
    if(this.props.location.UserId)
    {
      this.props.dispatch(messageActions.createContact('buyer', this.props.location.UserId))
    }
    else
    {
      this.props.dispatch(messageActions.getContact('buyer'));
      this.setState({flag:true});
    }
  }

  componentWillReceiveProps ( nextprops ) {
    const { init_contact, info, messages, new_buyer_msg } = nextprops;

    if(init_contact && !this.state.flag){
      this.props.dispatch(messageActions.getContact('buyer'));
      this.setState({flag:true});
    }

    if (messages) {
      this.setState({message:messages});
    }

    if(info && this.state.flag == true)
    {
      this.setState({ contact: info});
      if (new_buyer_msg == true) {
        this.props.dispatch(messageActions.readBuyerMessage());
      }
      if (info.length) {
        this.setState({currentAdza: info[this.state.curindex]})
      }else{
        this.setState({currentAdza: {}})
      }
    }
  }
  dealMail(adza){
    if (adza.Messages.length) {
      return adza.Messages[adza.Messages.length-1].message_text;
    }
    return "";
  }

  dealTime(adza){
    if (!adza.Messages.length)
      return "";
    var now = new Date();
    var diff = now - new Date(adza.Messages[adza.Messages.length-1].message_time);
    var div = Math.floor(diff / 31536000000);
    if (div) {
      return div + " year(s) ago";
    }
    div = Math.floor(diff / 2678400000);
    if (div) {
      return div + " month(s) ago";
    }
    div = Math.floor(diff / 604800000);
    if (div) {
      return div + " week(s) ago";
    }
    div = Math.floor(diff / 86400000);
    if (div) {
      return div + " day(s) ago";
    }
    div = Math.floor(diff / 3600000);
    if (div) {
      return div + " hour(s) ago";
    }
    div = Math.floor(diff / 60000);
    if (div) {
      return div + " minute(s) ago";
    }
    return "Now";
  }

  showSender(prev,now){
    if(prev.s_type !== now.s_type){
      var {currentAdza} = this.state;
      var user = (now.s_type=="buyer"?currentAdza.Buyer_Profile.User:currentAdza.Adza_Profile.User);
      var image = (now.s_type=="buyer"?"/buyer_avatar/":"/adza_avatar/");
      return (
        <div className="sender">
          <img className="profile" src={uploadRoot+image+user.id+".png?"+new Date()} onError={this.onError} alt=""/>
          <span className="f-16"> {user.f_name + " " + user.l_name} </span>
        </div>
      );
    }
  }

  showDate(prev,next,now){
    var dif;
    now.time = new Date(now.message_time);
    next.time = new Date(next.message_time);
    dif = next.time - now.time;
    if(prev.s_type !== now.s_type || Math.floor(dif / 60000)){
      var str = "";

      if (now.time.getHours()>12) {
        str = (now.time.getHours()-12)+":"+now.time.getMinutes()+" PM";
      }
      else if (now.time.getHours()<12) {
        str = now.time.getHours()+":"+now.time.getMinutes()+" AM";
      }
      else{
        str = now.time.getHours()+":"+now.time.getMinutes()+" PM";
      }
      return (
        <div className="date">
          {str}
        </div>
      );
    }
  }

  showMail(item,index){
    if(item)
    {
      var prev = this.state.currentAdza.Messages[index-1];
      var next = this.state.currentAdza.Messages[index+1];
      if(prev==undefined)
        prev = {
                s_type: "",
                message_time: item.message_time,
                message_text: ""
              };
      if (next == undefined) {
        next = {
                s_type: "",
                message_time: new Date(0).toString(),
                message_text: ""
              };
      }
      return (
        <div className="history" key={index}>
          {this.showSender(prev,item)}
          <div className="history-content">
            <div className="content-row">
              <div className="text">
                <div className="paragraph">
                  {item.message_text}
                </div>
              </div>
              {this.showDate(prev,next,item)}
            </div>
          </div>
        </div>
      );
    }
  }

  fetchMsg( _adza, index){
    this.setState({currentAdza: _adza, curindex: index})
  }

  sendMessage(){
    this.refs.messageinput.value="";
    if(this.state.currentAdza.Adza_Profile && this.state.currentMsg!="")
    {
      messageActions.sendBuyerMessage(
        this.state.currentMsg,
        this.state.currentAdza.Adza_Profile.UserId
      );
      this.setState({currentMsg:""});
    }
  }

  getMessage(e){
    if (e.keyCode == 13 && e.ctrlKey == true) {
      this.sendMessage();
      this.setState({wrap:false});
      return;
    }
    
    this.setState({ currentMsg: e.currentTarget.value });
    $("#temp").html(e.currentTarget.value);

    if (e.currentTarget.value.indexOf('\n') != -1) {
      this.setState({wrap:true});
    }
    else if ($("#temp").width() > $("#messageinput").width() ) {
      this.setState({wrap:true});
    }else{
      this.setState({wrap:false});
    }
  }

  onError(e){
    e.target.src = avatarDefault;
  }

  showAvatar(id){
    return <img src={uploadRoot+"/adza_avatar/"+id+".png?"+new Date()} onError={this.onError}/>
  }

  deleteContact(adza){
    this.props.dispatch(messageActions.deleteContact("buyer",adza.Adza_Profile.UserId,this.state.curindex));
    this.setState({curindex:0});
  }

  render(){
    const {currentAdza} = this.state;
    return (
      <div className="buyer_landing buyer_messages">
        <div className="page-container">
          <div className="page-content">
            <BuyerSidebar navitem={"messages"}/>
            <div className="page-main message-main">
              <div className="page-panel">
                <div className="user-search">
                  <input className="form-control" type="text" placeholder="Search" />
                  <i className="fa fa-search"></i>
                </div>
                <div className={"btn-group "+(this.state.wrap?"wrap":"")} data-toggle="buttons" id="pages">
                  {
                     this.state.contact && this.state.contact.length ? this.state.contact.map(
                      (seller, index)=>(
                        <label className={"btn "+(index==this.state.curindex?"active":"")} onClick={this.fetchMsg.bind(this, seller, index)} key={index}>
                          {this.showAvatar(seller.Adza_Profile.UserId)}
                          <div className="detail">
                            <div className="f-16"> { seller.Adza_Profile.User.f_name + ' ' + seller.Adza_Profile.User.l_name } </div>
                            <div className="f-13 darkgrey"> { this.dealMail( seller) }</div>
                            <div className="f-11 lightgrey"> { this.dealTime( seller) } </div>
                          </div>
                          <input type="radio" className="toggle"/>
                        </label>
                      )
                    ): ''
                  }
                </div>
              </div>
              <div className="page-message">
                  <div className="user-profile">
                    {currentAdza.Adza_Profile?
                      <span>
                        <div className="profile-image">
                          <img src={uploadRoot+"/adza_avatar/"+currentAdza.Adza_Profile.UserId+".png?"+new Date()} onError={this.onError} alt=""/>
                        </div>
                        <div className="profile-detail">
                          <div className="f-16"> {currentAdza.Adza_Profile.User.f_name+" "+currentAdza.Adza_Profile.User.l_name} </div>
                          <div className="rating">
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <i className="fa fa-star"></i>
                            <span className="rating-num">&nbsp; 5.0</span>
                            <span className="review-num">&nbsp; (17 Reviews)</span>
                          </div>
                        </div>
                        <div className="action">
                          <Link to={"/seller_page?"+currentAdza.Adza_Profile.id} className="btn btn-yellow">View Profile</Link>
                          <a href="#" onClick={this.deleteContact.bind(this,currentAdza)}>
                            <img src={require("../res/img/delete.png")} alt=""/>
                          </a>
                        </div>
                      </span> :""
                    }
                  </div>
                <div className="date darkgrey">
                  {
                    new Date().toDateString()//Friday, February 22, 2019
                  }
                </div>
                <div className="message-content">
                  {
                    currentAdza.Messages?currentAdza.Messages.map(
                      (item,index)=>(this.showMail(item,index))
                    ):""
                  }
                </div>
                <div className={"send-message "+(this.state.wrap?"wrap":"")}>
                  <i className="fa fa-paperclip lightgrey pin-icon"></i>
                  <div className="wrapper">
                    <textarea id="messageinput" className="form-control" type="text" onKeyUp={ this.getMessage.bind(this)} ref="messageinput"/>
                    <div className="temp" id="temp"></div>
                    <i className="fa fa-smile-o lightgrey"></i>
                  </div>
                  <button className="btn btn-yellow" onClick={ this.sendMessage.bind(this)}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { info, init_contact, messages, new_buyer_msg } = state.message;

  return {
    info,
    init_contact,
    messages,
    new_buyer_msg
  }
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyerMessages);
