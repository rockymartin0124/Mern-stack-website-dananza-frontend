import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';
import SellerSidebar from "../components/Sidebar/SellerSidebar";
import avatarDefault from '../res/img/default_avatar.png';
import { buyerActions, userActions, messageActions } from '../store/actions';
import { sellerActions } from '../store/actions';

import $ from "jquery";
import "../res/css/Seller_Dashboard_Messages.css"
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class SellerMessages extends React.Component{

  state =
  {
    'headerType': "seller",
    contact: [],
    message: [],
    currentBuyer: {},
    currentMsg: "",
    flag: false,
    curindex:0,
    wrap:false
  }

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "Seller Messages"
  }

  componentWillMount() {
    if(this.props.location.UserId)
    {
      this.props.dispatch(messageActions.createContact('seller', this.props.location.UserId))
    }
    else
    {
      this.props.dispatch(messageActions.getContact('seller'));
      this.setState({flag:true});
    }
  }

  componentWillReceiveProps ( nextprops ) {
    const { init_contact, info, messages, new_seller_msg } = nextprops;

    if(init_contact && !this.state.flag){
      this.props.dispatch(messageActions.getContact('seller'));
      this.setState({flag:true});
    }

    if (messages) {
      this.setState({message:messages});
    }

    if(info && this.state.flag == true)
    {
      this.setState({ contact: info})
      if (new_seller_msg == true) {
        this.props.dispatch(messageActions.readSellerMessage());
      }
      if (info.length) {
        this.setState({currentBuyer: info[this.state.curindex]})
      }else{
        this.setState({currentBuyer: {}})
      }
    }
  }
  dealMail(buyer){
    if (buyer.Messages.length) {
      return buyer.Messages[buyer.Messages.length-1].message_text;
    }
    return "";
  }

  dealTime(buyer){
    if (!buyer.Messages.length)
      return "";
    var now = new Date();
    var diff = now - new Date(buyer.Messages[buyer.Messages.length-1].message_time);
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
      var {currentBuyer} = this.state;
      var user = (now.s_type=="buyer"?currentBuyer.Buyer_Profile.User:currentBuyer.Adza_Profile.User);
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
    if(item )
    {
      var prev = this.state.currentBuyer.Messages[index-1];
      var next = this.state.currentBuyer.Messages[index+1];
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

  fetchMsg( buyer, index){
    this.setState({currentBuyer: buyer, curindex: index})
  }

  sendMessage(){
    this.refs.messageinput.value="";
    if(this.state.currentBuyer.Buyer_Profile && this.state.currentMsg!="")
    {
      messageActions.sendSellerMessage(
        this.state.currentMsg,
        this.state.currentBuyer.Buyer_Profile.UserId
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
    return <img src={uploadRoot+"/buyer_avatar/"+id+".png?"+new Date()} onError={this.onError}/>
  }

  deleteContact(buyer){
    this.props.dispatch(messageActions.deleteContact("seller",buyer.Buyer_Profile.UserId,this.state.curindex));
    this.setState({curindex:0});
  }

  render(){
    const {currentBuyer} = this.state;
    return (
    	<div className="dashboard_seller">
	    	<div className="page-content seller_message">
  				<SellerSidebar navitem={"message"}/>
          <div className="page-result-wrapper">
    				<div className="page-result">
              <div className="page-panel">
                <div className="user-search">
                  <input className="form-control" type="text" placeholder="Search" />
                  <i className="fa fa-search"></i>
                </div>
                <div className={"btn-group "+(this.state.wrap?"wrap":"")} data-toggle="buttons" id="pages">
                  {
                     this.state.contact && this.state.contact.length ? this.state.contact.map(
                      (buyer, index)=>(
                        <label className={"btn "+(index==this.state.curindex?"active":"")} onClick={this.fetchMsg.bind(this, buyer, index)} key={index}>
                          {this.showAvatar(buyer.Buyer_Profile.UserId)}
                          <div className="detail">
                            <div className="f-16"> { buyer.Buyer_Profile.User.f_name + ' ' + buyer.Buyer_Profile.User.l_name } </div>
                            <div className="f-13 darkgrey"> { this.dealMail( buyer) }</div>
                            <div className="f-11 lightgrey"> { this.dealTime( buyer) } </div>
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
                    {currentBuyer.Buyer_Profile?
                      <span>
                        <img className="profile-photo" onError={this.onError} src={uploadRoot+"/buyer_avatar/"+currentBuyer.Buyer_Profile.UserId+".png?"+new Date()} alt=""/>
                        <span className="f-16"> {currentBuyer.Buyer_Profile.User.f_name+" "+currentBuyer.Buyer_Profile.User.l_name} </span>
                        <div className="action">
                          <Link to={""/*"/seller_page?"+currentBuyer.Buyer_Profile.id*/} className="btn btn-yellow">View Profile</Link>
                          <a href="#" onClick={this.deleteContact.bind(this,currentBuyer)}>
                            <img src={require("../res/img/delete.png") } alt=""/>
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
                    currentBuyer.Messages?currentBuyer.Messages.map(
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
  const { info, init_contact, messages, new_seller_msg } = state.message;

  return {
    info,
    init_contact,
    messages,
    new_seller_msg
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
)(SellerMessages);
