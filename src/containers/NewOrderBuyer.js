import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import { sellerActions } from '../store/actions';
import avatarDefault from '../res/img/default_avatar.png';

import "../res/css/NewOrderBuyer.css"
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;


class NewOrderBuyer extends React.Component{

  state={'headerType': "static",
         'orderHistory':null,
         'orderId':0,
         'ratingVal':1,
         preview: null}
  resultEnd = false;
  lasttime = new Date();

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "NewOrder_Buyer"
  }

  componentWillMount(){
    const { dispatch } = this.props;
    var orderId = parseInt(this.props.location.search.split("?")[1]);
    if(orderId){
      this.setState({orderId});
      dispatch(sellerActions.getOrderHistory(orderId));
    }
  }

  componentWillReceiveProps(props){
    if (props.orderHistory != undefined) {
      this.setState({orderHistory:props.orderHistory});
    }
  }

  onError(e){
    e.target.src = avatarDefault;
  }

  showSellerSender(){
    var image;
    const order = this.state.orderHistory;
    try{
      image = <img className="avatar" src={uploadRoot+"/adza_avatar/"+order.Campaign_Listing.Adza_Profile.UserId+".png?"+new Date()} onError={this.onError}/>
    }catch{
      image = <img className="avatar" src={avatarDefault}/>
    }
    return (
      <div className="wrapper">
        {image}
        <span className="username">{order.Campaign_Listing.Adza_Profile.User.business_name}</span>
      </div>
    );
  }

  showBuyerSender(){
    var image;
    const order = this.state.orderHistory;
    try{
      image = <img className="avatar" src={uploadRoot+"/buyer_avatar/"+order.Buyer_Profile.UserId+".png?"+new Date()} onError={this.onError}/>
    }catch{
      image = <img className="avatar" src={avatarDefault}/>
    }
    return (
      <div className="wrapper">
        {image}
        <span className="username">{order.Buyer_Profile.User.business_name}</span>
      </div>
    );
  }

  onMediaUpload(order){
    order.order_status = 'accept';
    order.order_attachment = {image:this.refs.file.files[0]};
    order.order_comment = this.refs.comment.value;

    const { dispatch } = this.props;
    dispatch(sellerActions.updateOrderHistory(order));
    dispatch(sellerActions.addOrderHistory(this.state.orderId, 'orderaccept', 'pending'));
  }

  onBuyerApprove(order){
    order.order_status = 'accept';
    const { dispatch } = this.props;
    dispatch(sellerActions.updateOrderHistory(order));
    dispatch(sellerActions.addOrderHistory(this.state.orderId, 'ratingsellergiven', 'pending'));
    dispatch(sellerActions.addOrderHistory(this.state.orderId, 'ratingbuyergiven', 'pending'));
  }

  onBuyerDisapprove(order){
    order.order_comment = this.refs.comment.value;
    order.order_status = 'reject';
    const { dispatch } = this.props;
    dispatch(sellerActions.updateOrderHistory(order));
    dispatch(sellerActions.addOrderHistory(this.state.orderId, 'adlaunch', 'relaunch_pending'));
  }

  onSubmitFeedback(order){
    order.order_comment = this.refs.comment.value;
    order.order_attachment = {"rating":this.state.ratingVal};
    order.order_status = 'accept';
    const { dispatch } = this.props;
    dispatch(sellerActions.updateOrderHistory(order));
  }

  onChangeMedia(e){
    var preview = this.refs.preview;
    var file = e.target.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        self.setState({preview: e.target.result});
    };

    // read the image file as a data URL.
    reader.readAsDataURL(file);

  }

  showOrder(order)
  {
    if(order.order_type == 'order') {
      return (
        <div className="message buyer">
          <div className="sender">
            {this.showBuyerSender(order)}
          </div>
          <div className="message-wrapper">
            <div className="message-content">
              <div className="date">
                {new Date(order.update_time).toLocaleString()}
              </div>
              <div className="message-box">
                <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                <div className="para">
                  Order Placed: {order.order_attachment.listingname}&nbsp;${order.order_attachment.price}
                </div>
                <div className="para">
                  Post Date: {new Date(order.update_time).toDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  showMediaUpload(order)
  {
    if(order.order_type == 'mediaupload'){
      if (order.order_status == 'accept') {
        return (
          <div className="message buyer">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    {order.order_comment}
                  </div>
                  <div className="attachment">
                    <img src={uploadRoot+"/media_upload/"+order.order_attachment.image}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if (order.order_status == 'pending') {
        const {preview} = this.state;
        return (
          <div className="message buyer upload">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  Pending
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    <input ref="comment" className="message-response special" placeholder="Send your message with your response"/>
                  </div>
                  <div className="attachment">
                    <input type="file" onChange={this.onChangeMedia.bind(this)} ref="file"/>
                    <div className={"wrapper "+(preview?"noborder":"")}>
                      <img className="preview" src={preview?preview:""} alt="" ref="preview"/>
                    </div>
                  </div>
                  <div className="action">
                    <button className="btn btn-accept" onClick={this.onMediaUpload.bind(this,order)}>Accept</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
    }
  }

  showOrderAccept(order)
  {
    if(order.order_type == 'orderaccept'){
      if(order.order_status == 'pending'){
        return (
          <div className="message seller action pending">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    If the seller doesn't approve or reject your ad within 5 days, the order will be automatically rejected.
                  </div>
                  <div className="action">
                     <label class="btn state-awaiting">Awaiting Seller Approval</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
      else if (order.order_status == 'accept') {
        return (
          <div className="message seller action">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    {order.order_comment}
                  </div>
                  <div className="action">
                    <label className="btn state-accepted">
                      Accepted
                      <i className="fa fa-thumbs-up"></i>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
    }
  }

  showAdLaunch(order)
  {
    if(order.order_type == 'adlaunch') {
      if(order.order_status == 'pending'){
        return(
          <div className="message seller action pending">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="action">
                    <label className="btn state-launching">
                      Launch Scheduled for {new Date(this.state.orderHistory.Campaign_Listing.add_time).toDateString()}
                      <i className="fa fa-calendar"></i>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
      else if (order.order_status == 'accept') {
        return (
          <div className="message seller action">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="link">
                    <img src={require("../res/img/link.png")}/>
                    <Link to={order.order_comment}>{order.order_comment}</Link>
                  </div>
                  <div className="action">
                    <label className="btn state-launched">
                      Ad Launched
                      <i className="fa fa-rocket"></i>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
      else if (order.order_status == 'relaunch_pending') {
        return (
          <div className="message seller action pending">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="action">
                    <label className="btn state-launching">
                      Awaiting Ad Relaunch
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
    }
  }

  showBuyerApprove(order)
  {
    if(order.order_type == 'buyerapprove') {
      if (order.order_status == 'pending') {
        return (
          <div className="message buyer action">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  Pending
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="action">
                    <button className="btn btn-accept" onClick={this.onBuyerApprove.bind(this,order)}>
                      Yes<i className="fa fa-smile-o"></i>
                    </button>
                    <button className="btn btn-reject" onClick={this.onBuyerDisapprove.bind(this,order)}>
                      No<i className="fa fa-frown-o"></i>
                    </button>
                  </div>
                  <div className="para">
                    Did the Adza's post meet your expectation?
                    <input className="message-response" ref="comment" placeholder="Type the reason, when you disapprove."/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if (order.order_status == 'accept') {
        return (
          <div className="message buyer action">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="action">
                    <label className="btn state-approved">
                      Yes
                      <i className="fa fa-smile-o"></i>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if (order.order_status == 'reject') {
        return (
          <div className="message buyer action">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="action">
                    <label className="btn state-rejected">
                      No
                      <i className="fa fa-frown-o"></i>
                    </label>
                  </div>
                  <div className="para">
                    {order.order_comment}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  showRatingSellerGiven(order)
  {
    if(order.order_type == 'ratingsellergiven') {
      const temp = [1,2,3,4,5];
      if(order.order_status == 'pending'){
        return (
          <div className="message buyer rating">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    {
                      temp.map(
                        (item,index)=>(
                          <a onClick={()=>{this.setState({ratingVal:item})}}>
                            <i className={"fa fa-star"+(index<parseInt(this.state.ratingVal)?"":"-o")}></i>
                          </a>
                        )
                      )
                    }
                  </div>
                  <div className="para">
                    Leave feedback on your order (optional)
                    <textarea className="message-response" ref="comment"/>
                  </div>
                  <div className="action">
                    <button className="btn btn-submit" onClick={this.onSubmitFeedback.bind(this,order)}> Submit </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else if(order.order_status == 'accept'){
        return (
          <div className="message buyer rating">
            <div className="sender">
              {this.showBuyerSender(order)}
            </div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    {
                      temp.map(
                        (item,index)=>(
                          <i className={"fa fa-star"+(index<parseInt(this.state.ratingVal)?"":"-o")}></i>
                        )
                      )
                    }
                  </div>
                  <div className="para">
                    {order.order_comment}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  showRatingBuyerGiven(order)
  {
    if(order.order_type == 'ratingbuyergiven') {
      if(order.order_status == "accept"){
        const temp = [1,2,3,4,5];
        this.lasttime = new Date(order.update_time);
        this.resultEnd = true;
        return (
          <div className="message seller rating">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  {new Date(order.update_time).toLocaleString()}
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    {
                      temp.map(
                        (item,index)=>(
                          <i className={"fa fa-star"+(index<parseInt(order.order_attachment.rating)?"":"-o")}></i>
                        )
                      )
                    }
                  </div>
                  <div className="para">
                    {order.order_comment}
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
      else if(order.order_status == "pending"){
        const temp = [1,2,3,4,5];
        this.lasttime = new Date(order.update_time);
        return (
          <div className="message seller rating">
            <div className="sender"></div>
            <div className="message-wrapper">
              <div className="message-content">
                <div className="date">
                  Pending
                </div>
                <div className="message-box">
                  <img className="arrow_send" src={require("../res/img/arrow_send.png")}/>
                  <img className="arrow_receive" src={require("../res/img/arrow_receive.png")}/>
                  <div className="para">
                    Seller has not left feedback yet.
                  </div>
                </div>
              </div>
            </div>
            <div className="sender">
              {this.showSellerSender(order)}
            </div>
          </div>
        );
      }
    }
  }

  showOrderResult()
  {
    if(this.resultEnd == true){
      return (
        <div className="result">
          This order was completed on {this.lasttime.toLocaleDateString()}
        </div>
      );
    }
  }


  render(){
    const self = this;
    var camp = this.props.location.orderInfo;
    const {orderHistory} = this.state;
    return (
      <div className="order-dashboard">
        <div className="page-content order-buyer">
          {
            !orderHistory?"":
              <div className="page-header">
                <label className="title">{orderHistory.Campaign_Listing.Campaign.campaign_name}</label>
                <div className="subtitle">
                  {orderHistory.Campaign_Listing.Listing.title}&nbsp;from&nbsp;
                  <Link to="buyer_messages">{orderHistory.Campaign_Listing.Adza_Profile.User.business_name}</Link></div>
              </div>
          }
          {
            !this.state.orderHistory?"":
            this.state.orderHistory.Order_Histories.map(
              (order) => (
                <div>
                  {this.showOrder(order)}
                  {this.showMediaUpload(order)}
                  {this.showOrderAccept(order)}
                  {this.showAdLaunch(order)}
                  {this.showBuyerApprove(order)}
                  {this.showRatingSellerGiven(order)}
                  {this.showRatingBuyerGiven(order)}
                </div>
              )
            )
          }
          {this.showOrderResult()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {orderHistory} = state.seller;
  return {
    orderHistory
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewOrderBuyer);
