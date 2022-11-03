import React from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { buyerActions } from '../store/actions';
import { sellerActions } from '../store/actions';

import SellerSidebar from "../components/Sidebar/SellerSidebar";
import Knob from 'react-canvas-knob';

import { BarChart } from 'react-charts-d3';

import "../res/css/Seller_Dashboard_Analytics.css"

class SellerAnalytics extends React.Component{

  state={
    'headerType': "seller",
    'chartData' : [],
    price: 0,
    ordercount: 0,
    acceptOrder: 0,
    maxitem: null,
    adzacount: 0,
    weekprice: [0,0,0,0,0]
  }

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "Seller Analytics"
    this.props.dispatch(sellerActions.getSellerOrders());
  }

  componentWillReceiveProps(props){
    if (props.seller_orders != undefined)
    {
      var ordercount = props.seller_orders.length;
      var acceptOrder = 0;
      var memory = [-1];
      var max = 0, maxitem = null;
      var price = 0;
      var adzacount = 0;
      var weekprice = [0,0,0,0];
      for (var item of props.seller_orders)
      {
        adzacount = 0;
        var today = new Date();
        var asthetime = new Date(item.Order.order_date);
        if (item.Order.order_status == 'finished'
          && today.getFullYear()==asthetime.getFullYear()
          && today.getMonth()==asthetime.getMonth())
        {
          price += item.Listing.price;
          var week = parseInt(asthetime.getDate()/7);
          weekprice[week>3?3:week] += item.Listing.price;
        }
        if (item.Order.order_status == 'finished')
          acceptOrder++;

        if (memory[item.Listing.id] == undefined)
          memory[item.Listing.id] = 0;
        memory[item.Listing.id] ++;

        if (max < memory[item.Listing.id]) {
          maxitem = item.Listing;
          max = memory[item.Listing.id];
        }
        if (item.Adza_Profile.profile_description != "")
          adzacount ++;
        if (item.Adza_Profile.image_gallery != [])
          adzacount ++;
        if (item.Adza_Profile.audience_male_percent != 0)
          adzacount ++;
        if (item.Adza_Profile.audience_age_min != 0)
          adzacount ++;
        if (item.Adza_Profile.audience_age_max != 60)
          adzacount ++;
        if (item.Adza_Profile.audience_locations != [])
          adzacount ++;
        if (item.Adza_Profile.audience_interests != [])
          adzacount ++;
        if (item.Adza_Profile.profile_location != "")
          adzacount ++;

      }

      if(maxitem)
      {
        maxitem.count = max;
      }
      
      this.setState({price,maxitem,acceptOrder:parseInt(acceptOrder*100/ordercount),ordercount,adzacount:parseInt(adzacount*100/8), weekprice});
    }
  }
  showFollows(number)
  {
    if (number >= 1000)
    {
      var str = "" + Math.floor(number/1000) + 'k';

      if (number % 1000)
        str+='+';
      return str;
    }
    return number;
  }

  render(){
    var month = new Date().toString().substr(4,3);

    const chartData = [
      { key: 'Sales', 
        values: [ 
          { x: month+' 1~7', y: this.state.weekprice[0] }, 
          { x: month+' 8~14', y: this.state.weekprice[1] },
          { x: month+' 15~21', y: this.state.weekprice[2] },
          { x: month+' 22~31', y: this.state.weekprice[3] },
        ] }
    ];

    const axisConfig = {showXAxis: true, showXAxisLabel: false, showYAxis : true, showYAxisLabel: false, xLabel:"", yLabel: ""};

    return (
      <div className="dashboard_seller">
        <div className="page-content seller_analytics">
          <SellerSidebar navitem={"analytics"}/>
          <div className="page-result-wrapper">
            <div className="page-result">
              <div className="col-sm-12">
                <label className="title">
                  Overview Analytics
                  <a className="right btn-export">
                    Export&nbsp;&nbsp;
                    <img src={require('../res/img/export.png')}/>
                  </a>
                </label>
              </div>
              <div className="page-result-content">
                <div className="row">
                  <div className="col-sm-6 whiteback">
                    <h1>${this.state.price}</h1>
                    Total Earned this Month
                  </div>
                  <div className="col-sm-6 whiteback">
                    <h1>{this.state.ordercount}</h1>
                    Orders Created
                  </div>
                </div>
                <div className="row">
                  <div className="dial col-sm-3">
                    <Knob
                      readOnly
                      value={this.state.acceptOrder}
                      fgColor={'#2ab7c9'}
                      bgColor={'#ffffff'}
                      className="knob"
                      displayprevious="true"
                      width="100"
                      height="100"
                      thickness={0.12}
                      displayInput={false}
                      displayCustom={()=>(<div class='knobedit'><input value={(this.state.acceptOrder ? this.state.acceptOrder : 0)+"%"}/></div>)}
                    />              
                    <h6>Order Accepted</h6>
                  </div>
                  <div className="dial col-sm-3">
                    <Knob
                      readOnly
                      value={75}
                      fgColor={'#2ab7c9'}
                      bgColor={'#ffffff'}
                      className="knob"
                      displayprevious="true"
                      width="100"
                      height="100"
                      thickness={0.12}
                      displayInput={false}
                      displayCustom={()=>(<div class='knobedit'><input value={'75%'}/></div>)}
                    />
                    <h6>Response Rate</h6>
                  </div>
                  <div className="dial col-sm-3">
                    <Knob
                      readOnly
                      value={98}
                      fgColor={'#2ab7c9'}
                      bgColor={'#ffffff'}
                      className="knob"
                      displayprevious="true"
                      width="100"
                      height="100"
                      thickness={0.12}
                      displayInput={false}
                      displayCustom={()=>(<div class='knobedit'><input value={'98%'}/></div>)}
                    />
                    <h6>Delivered on Time</h6>
                  </div>
                  <div className="dial col-sm-3">
                    <Knob
                      readOnly
                      value={5.0}
                      max={5.0}
                      fgColor={'#2ab7c9'}
                      bgColor={'#ffffff'}
                      className="knob"
                      displayprevious="true"
                      width="100"
                      height="100"
                      thickness={0.12}
                      displayInput={false}
                      displayCustom={()=>(<div class='knobedit'><input value={'5.0'}/><i className='fa fa-star fa-rate'></i></div>)}
                    />
                    <h6>Rating</h6>
                  </div>
                </div>
                {
                  this.state.maxitem==null?"":
                  <div className="row">
                    <label className="subtitle">
                      Most Popular Package
                    </label>
                  </div>
                }
                {
                  this.state.maxitem==null?"":
                  <div className="row d-block">
                    <div className="col-sm-12 page-result-content-info">
                      <img src={require('../res/img/sidebar_cart.png')}/>
                      <span className="info-label">{this.state.maxitem.count} orders</span>
                      <img src={require('../res/img/eye.png')}/>
                      <span className="info-label">230 views</span>
                    </div>
                    <div className="col-sm-12">
                      <div className="instagram">
                        <div className="instagram-ico">
                          <img src={require("../res/img/"+this.state.maxitem.media_type+"_sq.png")} />
                          &nbsp;&nbsp; 
                          <span className="info-label">{this.state.maxitem.title}</span>
                        </div>
                        <div className="instagram-part">
                          <div className="part">
                            <img src={require('../res/img/dollar.png')}/>
                            <span className="info-label">{this.state.maxitem.price}</span>
                          </div>
                          <div className="part">
                            <img src={require('../res/img/user.png')}/>
                            &nbsp;&nbsp;
                            <span className="info-label">{this.showFollows(this.state.maxitem.Channel.follows)}</span>
                          </div>
                          <div className="part">
                            <i className="fa fa-star color-yellow"></i>
                            &nbsp; 
                            <span className="star-info info-label"> 5.0(17)</span>
                          </div>
                          <div className="part">
                            <a href="#">
                              View Package
                              &nbsp;
                              <i className="fa fa-long-arrow-right info-label"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                <div className="row">
                  <label className="subtitle">
                    Engagement
                  </label>
                </div>
                <div className="row d-flex enagement-info">
                  <div className="col-sm-4">
                    <div className="number">130</div>
                    <div className="comment">Reviews</div>
                  </div>
                  <div className="col-sm-4">
                    <div className="number">0</div>
                    <div className="comment">Adds to Cart</div>
                  </div>
                  <div className="col-sm-4">
                    <div className="number">70</div>
                    <div className="comment">Not Rated</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-5 enagement-dial">
                    <div className="col-sm-6">
                      <div className="dial">
                        <Knob
                          readOnly
                          value={85}
                          max={100}
                          fgColor={'#2ab7c9'}
                          bgColor={'#ffffff'}
                          className="knob"
                          displayprevious="true"
                          width="100"
                          height="100"
                          thickness={0.12}
                          displayInput={false}
                          displayCustom={()=>(<div class='knobedit'><input value={'85%'}/></div>)}
                        />
                        <h6>Profile Interaction Rate</h6>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="dial">
                        <Knob
                          readOnly
                          value={30}
                          max={100}
                          fgColor={'#fac917'}
                          bgColor={'#2ab7c9'}
                          className="knob"
                          clockwise={false}
                          displayprevious="true"
                          width="100"
                          height="100"
                          thickness={0.12}
                          displayInput={false}
                          displayCustom={()=>(<div class='knobedit'><input value={'30%'}/></div>)}
                        />
                        <h6>Convertion Rate</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-7 enagement-process">
                    <div className="progbar-title">Profile Completeness</div>
                    <div className="progress progbar-custom">
                        <div className="progress-bar progress-bar-warning enagement-progress" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{'width': this.state.adzacount+'%'}}>
                        </div>
                        <div className="progress-percent">{this.state.adzacount}%</div>
                    </div>
                    <div className="complete-profile">
                      <a className="more-button f-14">
                        Complete Profile &nbsp; <i className="fa fa-long-arrow-right info-label"></i>
                      </a>
                     </div>
                    <div className="progbar-title">Repeat Buyer Rate</div>
                    <div className="progress progbar-custom">

                        <div className="progress-bar progress-bar-warning enagement-progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{'width': '75%'}}>
                        </div>
                        <div className="progress-percent">75%</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <label className="subtitle">
                      Sales
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 whiteback">
                    <BarChart 
                      data={chartData} 
                      axisConfig={axisConfig}
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
)(withRouter(SellerAnalytics));