import React from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { buyerActions } from '../store/actions';
import { sellerActions } from '../store/actions';


import SellerSidebar from "../components/Sidebar/SellerSidebar";

import "../res/css/Seller_Dashboard_Calendar.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { Link } from 'react-router-dom';
import avatarDefault from '../res/img/default_avatar.png';
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class BigCalendarEvent extends React.Component {
  
  constructor(props) {
    super(props);
  }
  onError(e){
    e.target.src = avatarDefault;
  }
  render(){
    console.log(this.props);
    return (
      <span>
        {
          Array.isArray(this.props.event.resource)?
          this.props.event.resource.map(
            (userimage) => {
              var avatar;
              avatar = <img src={uploadRoot + "/buyer_avatar/"+userimage+".png?"+new Date()} onError={this.onError}/>
              return (
                <Link to="/seller_orders">
                  {avatar}
                </Link>);
            }
          ):''
        }
      </span>
    );
  }
}

const BigCalendarNavigation = (handles)=>(props)=>{
  return (<BigCalendarNavigate handles={handles} props={props}/>);
}

class BigCalendarNavigate extends React.Component {
  
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div className="title">
        <button className="btn btn-circle"
          onClick={()=>{this.props.handles.navigateHandle('PREV')}}> &lt; </button>
        <button className="btn btn-circle"
          onClick={()=>{this.props.handles.navigateHandle('NEXT')}}> &gt; </button>
        <span>{this.props.props.label}</span>
        <div className="btn-group calendar-btn-group" data-toggle="buttons" id="pages">
          <label className="btn btn-default" onClick={()=>{this.props.handles.calendarViewHandle('day')}}>
            <input type="radio" className="toggle"/> Day
          </label>
          <label className="btn btn-default" onClick={()=>{this.props.handles.calendarViewHandle('week')}}>
            <input type="radio" className="toggle"/> Week
          </label>
          <label className="btn btn-default active" onClick={()=>{this.props.handles.calendarViewHandle('month')}}>
            <input type="radio" className="toggle"/> Month
          </label>
        </div>
      </div>
    );
  }
}

class SellerCalendar extends React.Component{

  state={'headerType': "seller",
        EventsList:[
                {title:"myEvent",start:new Date("May 23, 2019 11:13:00"),end:new Date("May 23, 2019 11:13:00"),resource:['user','user1']},
                {title:"myEvent",start:new Date("May 24, 2019 11:13:00"),end:new Date("May 25, 2019 11:13:00"),resource:['user','user1']},
                {title:"myEvent",start:new Date("May 14, 2019 11:13:00"),end:new Date("May 16, 2019 11:13:00"),resource:['user','user1']},
                {title:"myEvent",start:new Date("May 1, 2019 11:13:00"),end:new Date("May 4, 2019 11:13:00"),resource:['user','user1']}
        ],
        todaySchedule:[],
        showDetail:false};
  localizer = BigCalendar.momentLocalizer(moment);

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
    this.navigateHandler = this.navigateHandler.bind(this);
    this.calendarViewHandler = this.calendarViewHandler.bind(this);
  }

  componentDidMount(){
    document.title = "Seller Calendar"
    this.props.dispatch(sellerActions.getSellerOrders());
  }

  componentWillReceiveProps(props){
    if (props.seller_orders != undefined) {
      var EventsList = [];
      this.state.todaySchedule = [];
      for (var listing of props.seller_orders) {
        var temp = new Date(listing.add_time);
        var today = new Date();
        var memory;
        if(!EventsList.some((item,index)=>{return item.start.toLocaleDateString()==temp.toLocaleDateString()?(memory=index,true):false}))
        {
          EventsList.push({title:"myEvent",start:temp,end:temp,allDay:true,resource:[listing.Order.Buyer_Profile.UserId]});
          if (today.toLocaleDateString() == temp.toLocaleDateString())
            this.state.todaySchedule.push(listing);
        }else{
          if (EventsList[memory].resource.indexOf(listing.Order.Buyer_Profile.UserId) == -1) {
            EventsList[memory].resource.push(listing.Order.Buyer_Profile.UserId);
            this.state.todaySchedule.push(listing);
          }
        }
      }
      this.setState({EventsList,todaySchedule:this.state.todaySchedule});
    }
  }

  navigateHandler(action, date){
    this.refs.big.handleNavigate(action,date);
  }

  calendarViewHandler(view){
    this.refs.big.handleViewChange(view);
  }
  onError(e){
    e.target.src = avatarDefault;
  }
  showAvatar(userimage){
    var avatar;
    avatar = <img src={uploadRoot + "/buyer_avatar/"+userimage+".png?"+new Date()} onError={this.onError}/>
    return avatar;
  }
  render(){
    const {todaySchedule} = this.state;

    return (
    	<div className="dashboard_seller">
	    	<div className="page-content seller_calendar">
  				<SellerSidebar navitem={"calendar"}/>
          <div className="page-result-wrapper">
    				<div className="page-result">
              <div className="col-sm-12">
                <label className="subtitle">
                  Today, {new Date().toDateString()}
                </label>
              </div>
              <div className="page-result-content">
                {
                  todaySchedule.map(
                    (listing,index)=>
                    (
                      index && !this.state.showDetail ? "" :
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="upcoming-box">
                            <div className="user-profile">
                              {this.showAvatar(listing.Order.Buyer_Profile.UserId)}
                            </div>
                            <div className="content">
                              <div className="username">{listing.Order.Buyer_Profile.User.business_name}</div>
                              <div className="detail">
                                <div>
                                  <img src={require("../res/img/"+listing.Listing.media_type+"_sq.png")} />
                                  <span>{listing.Listing.title}</span>
                                </div>
                                <div className="date">
                                  <span>Date:&nbsp;&nbsp;</span>
                                  <span className="darkgrey">{new Date(listing.add_time).toUTCString().split(" GMT")[0]}</span>
                                </div>
                              </div>
                              <div className="row actions">
                                <div className="col-sm-6">
                                  <Link to={{ pathname: '/seller_messages', UserId: listing.Order.Buyer_Profile.UserId }} className="btn btn-yellow">
                                    <img src={require("../res/img/message.png")} />
                                    Message Buyer
                                  </Link>
                                </div>
                                <div className="col-sm-6">
                                  <Link to="/seller_orders" className="btn btn-yellow">
                                    <img src={require("../res/img/view.png")} />
                                    View Order
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                }
                {
                  todaySchedule.length<2?"":
                  <div className="row">
                    <div className="col-sm-12">
                      <button className="btn btn-default trans-select" onClick={()=>this.setState({showDetail:true})}>
                        {todaySchedule.length-1} More...
                        <div>
                          <img src={require("../res/img/portlet-collapse-icon.png")}/>
                        </div>
                      </button>
                    </div>
                  </div>
                } 
                <div className="row">
                  <div className="col-sm-12" style={{ 'height': '675px'}}>
                      <BigCalendar
                            selectable={false}
                            ref={"big"}
                            localizer={this.localizer}
                            events={this.state.EventsList}
                            views={['day','week','month']}
                            startAccessor="start"
                            components={{toolbar:BigCalendarNavigation({
                              navigateHandle:this.navigateHandler,
                              calendarViewHandle:this.calendarViewHandler}),
                              eventWrapper:BigCalendarEvent}}
                            endAccessor="end"
                          />
                  </div>
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
    const { user } = state.authentication;
    const { seller_orders } = state.seller;

  return {
    user,
    seller_orders
  };
};

const mapDispatchToProps = dispatch => {
  return {dispatch};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SellerCalendar));