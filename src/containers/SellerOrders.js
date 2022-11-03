import React from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { buyerActions } from '../store/actions';
import { sellerActions } from '../store/actions';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import moment from 'moment';

import SellerSidebar from "../components/Sidebar/SellerSidebar";
import { Link } from 'react-router-dom';

import "../res/css/Seller_Dashboard_Order.css"
import "../res/css/components/select.css"
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class SellerOrders extends React.Component{

  state={'headerType': "seller",
      "orderby":0,
      "orders":[],
      "orderhistories":[],
      "showResult":[],
      "page": 1,
      "itemPerPage": 3,
      "pages": [],
      "flag": false}

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "Seller Orders"
  }

  componentWillMount(){
    this.props.dispatch(sellerActions.getSellerOrders());
  }

  componentWillReceiveProps(props){
    if (props.seller_orders != undefined && this.state.flag == false) {
      this.setState({flag:true});
      for(var i = 0 ; i < props.seller_orders.length ; i++)
      {
        this.props.dispatch(sellerActions.getLatestOrderHistory(props.seller_orders[i].Order.id,i));
      }
      this.setState({ orders:props.seller_orders.slice(0) });
    }
    if (props.camp_index != undefined && props.latest_history) {
      this.state.orderhistories[props.camp_index] = props.latest_history.slice(0).pop();
      this.setState({ orderhistories: this.state.orderhistories });
    }
    
    if (props.seller_orders != undefined
      && this.state.flag == true
      && props.latest_history != undefined
      && props.seller_orders.length == props.latest_history.length)
    {
      const {orderhistories} = this.state;
      const {seller_orders} = props;
      let showResult = [[],[],[],[],[],[]];
      var item;
      for (var index = 0; index < seller_orders.length; ++index) {
        item = seller_orders[index];
        showResult[orderhistories[index].length].push({item,orderhistories:orderhistories[index]});
      }
      let pages = [];
      for (var i = 0; i < Math.ceil(seller_orders.length/this.state.itemPerPage) ; i++)
        pages.push(i+1);
      this.setState({showResult,pages});
    }
  }

  onChangeSelect = event => {
    this.setState({'orderby': event.target.value });
    let {showResult} = this.state;
    let pages = [];
    for (var i = 0; i < Math.ceil(showResult[event.target.value].length/this.state.itemPerPage) ; i++)
        pages.push(i+1);
    this.setState({pages,page:1});
  };

  isShowThisClass(count,length){
    const {page, itemPerPage} = this.state;
    let start = parseInt(count / itemPerPage);
    let end = parseInt((count+length-1) / itemPerPage)
    if (length == 0)
      return false;
    if (start<=(page-1) && end>=(page-1))
      return true;
    return false;
  }

  render(){
    const {pages, page, itemPerPage, orderby} = this.state;
    let count = 0;
    return (
      <div className="dashboard_seller">
        <div className="page-content seller_order">
            <SellerSidebar navitem={"orders"}/>
            <div className="page-result-wrapper">
              <div className="page-result">
                <label className="title">Overview Analytics</label>
                <div className="order-by material-select">
                  <span className="grey">Order Status:</span>
                  <FormControl>
                    <Select value={this.state.orderby}
                        onChange={this.onChangeSelect}
                        inputProps={{
                          name: 'material',
                          id: 'material-simple',
                        }}>
                      <MenuItem value={0}>All Orders</MenuItem>
                      <MenuItem value={1}>Waiting for Media Upload</MenuItem>
                      <MenuItem value={2}>Needs Your Approval</MenuItem>
                      <MenuItem value={3}>Ready for Launch</MenuItem>
                      <MenuItem value={4}>Waiting for Buyer Approval</MenuItem>
                      <MenuItem value={5}>Completed Orders</MenuItem>
                    </Select>
                  </FormControl>
                  <Link to="/neworder_seller" className="add-channel">+ Add Order</Link>
                </div>
                <div className="page-result-content">
                  {
                    this.state.showResult.map(
                      (orders,index)=>(
                        (orderby!=index && orderby!=0)?"":
                        <div>
                        {
                          !this.isShowThisClass(count,orders.length)?"":
                          index==1?<label className="subtitle">Waiting for Media Upload</label>:
                          index==2?<label className="subtitle">Needs Your Approval</label>:
                          index==3?<label className="subtitle">Ready for Launch</label>:
                          index==4?<label className="subtitle">Waiting for Buyer Approval</label>:
                          index==5?<label className="subtitle">Completed Orders</label>:""
                        }
                        {
                          orders.map((order,ordInd)=>{
                            return parseInt(count++ / itemPerPage)==page-1?
                            (
                              <div className={"order "+(index<5?"active":"")}>
                                <img src={require("../res/img/order1.png")} />
                                <div className="order-content">
                                  <div className="content-header">
                                    <span className="header-left">
                                      <img src={require("../res/img/"+order.item.Listing.media_type+"_sq.png")} />
                                      <span>{order.item.Listing.title}</span>
                                      <Link to={{ pathname: '/seller_messages', UserId: order.item.Order.Buyer_Profile.UserId }}>{order.item.Order.Buyer_Profile.User.business_name}</Link>
                                    </span>
                                    <span className="header-right">
                                      <span className="price">${order.item.Listing.price}</span>
                                      <Link to="/seller_messages"><img src={require("../res/img/message.png")} />Message</Link>
                                    </span>
                                  </div>
                                  <div className="content-body">
                                    <div className="order-timeline">
                                      <div className={ (order.orderhistories[0].order_status === "accept" ? "active" : '') + " step first"}>
                                        <div className="step-button">
                                          <hr className="left" />
                                          <hr className="right" />
                                          <a className="circle">
                                            <img src={require('../res/img/check.png')} alt=""/>
                                          </a>
                                        </div>
                                        <div className="step-label">Order Date</div>
                                        <div className="step-label">{ order.orderhistories[0] ? moment(order.orderhistories[0].update_time).format('DD/MM'):''}</div>
                                      </div>
                                      <div className={ (order.orderhistories[1] && order.orderhistories[1].order_status === "accept" ? "active" : '') + " step"}>
                                        <div className="step-button">
                                          <a className="circle">
                                            <img src={require('../res/img/check.png')} alt=""/>
                                          </a>
                                          <hr className="left" />
                                          <hr className="right" />
                                        </div>
                                        <div className="step-label">Media Uploaded</div>
                                        <div className="step-label">{ order.orderhistories[1] ? moment(order.orderhistories[1].update_time).format('DD/MM'):''}</div>
                                      </div>
                                      <div className={ (order.orderhistories[2] && order.orderhistories[2].order_status === "accept" ? "active" : '') + " step"}>
                                        <div className="step-button">
                                          <a className="circle">
                                            <img src={require('../res/img/check.png')} alt=""/>
                                          </a>
                                          <hr className="left" />
                                          <hr className="right" />
                                        </div>
                                        <div className="step-label">Order Accepted</div>
                                        <div className="step-label">{ order.orderhistories[2] ? moment(order.orderhistories[2].update_time).format('DD/MM'):''}</div>
                                      </div>
                                      <div className={ (order.orderhistories[3] && order.orderhistories[3].order_status === "accept" ? "active" : '') + " step"}>
                                        <div className="step-button">
                                          <a className="circle">
                                            <img src={require('../res/img/check.png')} alt=""/>
                                          </a>
                                          <hr className="left" />
                                          <hr className="right" />
                                        </div>
                                        <div className="step-label">Ad Launched</div>
                                        <div className="step-label">{ order.orderhistories[3] ? moment(order.orderhistories[3].update_time).format('DD/MM'):''}</div>
                                      </div>
                                      <div className={ (order.orderhistories[4] && order.orderhistories[4].order_status === "accept" ? "active" : '') + " step last"}>
                                        <div className="step-button">
                                          <a className="circle">
                                            <img src={require('../res/img/check.png')} alt=""/>
                                          </a>
                                          <hr className="left" />
                                          <hr className="right" />
                                        </div>
                                        <div className="step-label">Buyer Approved</div>
                                        <div className="step-label">{ order.orderhistories[4] ? moment(order.orderhistories[4].update_time).format('DD/MM'):''}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="content-footer">
                                    <Link to={"/neworder_seller?"+order.item.Order.id}
                                        className={"btn btn-default btn-radius " + (index==5?"btn-transparent":"btn-yellow")}>
                                      {
                                        function(){
                                          switch (index) {
                                            case 2:
                                              return (
                                                <span>
                                                  <img src={require("../res/img/review.png")} />
                                                  Review Media
                                                </span>
                                              );
                                            case 3:
                                              return (
                                                <span>
                                                  <img src={require("../res/img/launch.png")} />
                                                  Launch Ad
                                                </span>
                                              );
                                            case 4:
                                              return (
                                                <span>
                                                  <img src={require("../res/img/clock.png")} />
                                                  Check Status
                                                </span>
                                              );
                                            default:
                                              return (
                                                <span>
                                                  <img src={require("../res/img/eye.png")} />
                                                  View This Ad
                                                </span>
                                              );
                                          }
                                        }()
                                      }
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ):"";
                          }
                        )
                        }
                        </div>
                      )
                    )
                  }
                  {pages.length>1?(
                    <div className="pagination">
                      <a className={"btn btn-default "+(page == 1 ?"disabled":"")}
                        onClick={()=>{ this.setState({page:page-1}) }}> {'<'} </a>
                      <div className="btn-group" data-toggle="buttons" id="pages">
                        {
                          pages.map(
                            (item,index) =>
                            {
                              let bef = Math.min(4,page-1),
                                aft = Math.min(4,pages.length - page);
                              const before = Math.max(bef, 8-aft), after =Math.max(aft, 8-bef);

                              if((item < page-before) || (item > page+after))
                                return "";
                              return (
                                <label className={"btn btn-default "+(item == page?"active":"")}
                                  onClick={()=>{ this.setState({page:item}) }}>
                                                  <input type="radio" className="toggle"/>
                                                  {item}
                                                </label>
                                              );
                            }
                          )
                        }
                      </div>
                      <a className={"btn btn-default "+(page >= pages.length ?"disabled":"")}
                        onClick={()=>{ this.setState({page:page+1}) }}> {'>'} </a>
                    </div>
                    ):""
                  }
                </div>
                
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {seller_orders} = state.seller;
  const { latest_history, camp_index } = state.seller;
  return {
    seller_orders,
    latest_history,
    camp_index
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SellerOrders));

