import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { bindActionCreators } from "redux";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { buyerActions } from '../store/actions';
import { sellerActions } from '../store/actions';
import moment from 'moment';
import DatePicker from "react-datepicker";

import BuyerSidebar from "../components/Sidebar/BuyerSidebar";

import "../res/css/layout.min.css"
import "../res/css/BuyerLanding.css"

class BuyerLanding extends React.Component{

  state={
          'headerType': "buyer",
          campaign: {},
          orderhistories:[],
          savedAdza: [],
          openAlert:true,
          flag: false
        };

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType );
    this.props.dispatch(buyerActions.getLatestCampaign());
    this.props.dispatch(buyerActions.fetchSavedAdza())
  }

  componentWillReceiveProps(nextprops) 
  {
    const { latest_campaign, latest_history, cleaned, savedAdza } = nextprops;

    this.setState({ orderhistories: latest_history, campaign: latest_campaign })

    if( latest_campaign && this.state.flag == false)
    {
      this.setState({flag:true});
      latest_campaign.Campaign_Listings.map(
        (item, index) => 
          (
            item.Order ?
              this.props.dispatch(sellerActions.getLatestOrderHistory (item.Order.id)) : ''
          )
      )
    }

    //create new cart
    if(cleaned)
    {
      this.props.dispatch(buyerActions.createNewCart());
    }

    this.setState({ orderhistories: latest_history.slice(0), campaign: latest_campaign, savedAdza: savedAdza })
  }

  componentDidMount(){
    document.title = "Buyer Dashboard Landing"
  }

  removeAdza( AdzaProfileId ){
    this.setState({ openAlert: true });
  }

  render(){
    var { campaign, orderhistories } = this.state;
    const { savedAdza } = this.state;
    var adza_list = [];
    if( savedAdza !== undefined )
      if( savedAdza.success == true && savedAdza.adzas !== undefined )
        adza_list = savedAdza.adzas
 
    return (
      <div className="buyer_landing">
        <div className="page-container">
          <div className="page-content">
            <BuyerSidebar />
            <div className="page-main">
              <div className="page-main-header">
                <span className="headline-first">
                  Latest Campaign
                </span>
                <span className="headline-second pull-right">
                  <Link to="/buyer_campaigns">See All Campaigns <i className="fa fa-long-arrow-right"></i></Link>
                </span>
              </div>
              <hr className="divider-line" />
              {
                campaign && campaign.id ? 
                  (
                    <div className="page-main-content row">
                      <div className="panel">
                        <div className="panel-title">
                          <span className="first">{ campaign && campaign.campaign_name ? campaign.campaign_name : '' }</span>
                          <span className="second">
                            <Link to={{ pathname: '/buyer_messages', adzaInfo: campaign }}>
                              <img src={require("../res/img/messages.png")} alt=""/>
                                Message
                            </Link>
                          </span>
                        </div>
                        <div className="panel-body">  
                          {
                            campaign && campaign.Campaign_Listings && orderhistories.length == campaign.Campaign_Listings.length 
                              ? campaign.Campaign_Listings.map (
                                  (item, l_indexdiv) =>
                                    (
                                      <div>
                                        <div style={{"width": "100%", "text-align": "center", "font-size": "20px"}}>{item.Listing.title}</div>
                                        <div className="campaign-timeline">
                                          <div className={ (orderhistories[l_indexdiv][0].order_status === "accept" ? "active" : '') + " step first"}>
                                            <div className="step-button">
                                              <hr className="left" />
                                              <hr className="right" />
                                              <a className="circle">
                                                <img src={require('../res/img/check.png')} alt=""/>
                                              </a>
                                            </div>
                                            <div className="step-label">Order Date</div>
                                            <div className="step-label">{ orderhistories.length ? moment(orderhistories[l_indexdiv][0].update_time).format('DD/MM'):''}</div>
                                          </div>
                                          <div className={ (orderhistories[l_indexdiv][1] && orderhistories[l_indexdiv][1].order_status === "accept" ? "active" : '') + " step"}>
                                            <div className="step-button">
                                              <a className="circle">
                                                <img src={require('../res/img/check.png')} alt=""/>
                                              </a>
                                              <hr className="left" />
                                              <hr className="right" />
                                            </div>
                                            <div className="step-label">Media Uploaded</div>
                                            <div className="step-label">{ orderhistories.length && orderhistories[l_indexdiv][1] ? moment(orderhistories[l_indexdiv][1].update_time).format('DD/MM'):''}</div>
                                          </div>
                                          <div className={ (orderhistories[l_indexdiv][2] && orderhistories[l_indexdiv][2].order_status === "accept" ? "active" : '') + " step"}>
                                            <div className="step-button">
                                              <a className="circle">
                                                <img src={require('../res/img/check.png')} alt=""/>
                                              </a>
                                              <hr className="left" />
                                              <hr className="right" />
                                            </div>
                                            <div className="step-label">Order Accepted</div>
                                            <div className="step-label">{ orderhistories.length && orderhistories[l_indexdiv][2] ? moment(orderhistories[l_indexdiv][2].update_time).format('DD/MM'):''}</div>
                                          </div>
                                          <div className={ (orderhistories[l_indexdiv][3] && orderhistories[l_indexdiv][3].order_status === "accept" ? "active" : '') + " step"}>
                                            <div className="step-button">
                                              <a className="circle">
                                                <img src={require('../res/img/check.png')} alt=""/>
                                              </a>
                                              <hr className="left" />
                                              <hr className="right" />
                                            </div>
                                            <div className="step-label">Ad Launched</div>
                                            <div className="step-label">{ orderhistories.length && orderhistories[l_indexdiv][3] ? moment(orderhistories[l_indexdiv][3].update_time).format('DD/MM'):''}</div>
                                          </div>
                                          <div className={ (orderhistories[l_indexdiv][4] && orderhistories[l_indexdiv][4].order_status === "accept" ? "active" : '') + " step last"}>
                                            <div className="step-button">
                                              <a className="circle">
                                                <img src={require('../res/img/check.png')} alt=""/>
                                              </a>
                                              <hr className="left" />
                                              <hr className="right" />
                                            </div>
                                            <div className="step-label">Buyer Approved</div>
                                            <div className="step-label">{ orderhistories.length && orderhistories[l_indexdiv][4] ? moment(orderhistories[l_indexdiv][4].update_time).format('DD/MM'):''}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )                
                              ) : ''
                          }     
                          <div className="message-table table-responsive">
                            <table className="table">
                              <thead>
                                <tr style={{ 'backgroundColor': '#f1f6f9'}}>
                                  <th><span>Adza</span></th>
                                  <th>Medium</th>
                                  <th style={{"padding-left": "25px"}}>Schedule Date</th>
                                  <th>Amount</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                    {
                                      campaign && campaign.Campaign_Listings ? campaign.Campaign_Listings.map(
                                        (item, index) => 
                                        (
                                          <tr>
                                                <td>
                                                  <img src={require("../res/img/" + item.Listing.media_type + "_sq.png")} alt=""/>
                                                  <Link className="color-dark" to={'/seller_page?'+item.AdzaProfileId}>{ item.Listing.Channel.username }</Link>
                                                </td>
                                                <td> { item.Listing.media_type } </td>
                                                <td className="add_date">
                                                  <DatePicker
                                                        className="btn btn-default"
                                                        selected={moment(item.Listing.insert_date, 'DD-MM-YYYY').toDate()}
                                                        onChange={(date,event)=>{this.onChangeStartDate(date,event,0)}}
                                                        placeholderText="Choose Post Date"
                                                        dateFormat="dd/MM/YYYY"
                                                      />
                                                </td>
                                                <td style={{'text-align': 'center'}}> { item.Listing.price } </td>
                                                <td>
                                                  <Link className="btn btn-lg preview-media pull-right" 
                                                        to={"/neworder_buyer?"+(item.Order ? item.Order.id : 0)}>
                                                    <img src={require("../res/img/review.png")}/>
                                                    Review Post
                                                  </Link>
                                                </td>
                                            </tr>
                                        )
                                    ): null
                                    }
                              </tbody>
                            </table>
                          </div>
                          <div className="cancel">
                            <a href="#"><img src={require("../res/img/remove.png")} alt=""/> Cancel Ad</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  : <div className="no_campaign"> You haven't any Campaign...</div>
              }
              <div className="page-main-header">
                <span className="headline-first">
                  Saved Adzas
                </span>
                <span className="headline-second pull-right">
                  <Link to="/buyer_saved">See All Saved Adzas <i className="fa fa-long-arrow-right"></i></Link>
                </span>
              </div>
              <hr className="divider-line" />
              <div className="adzas row">
              { adza_list.map( adza =>(
                <div className="col-md-4">
                  <div className="item active">
                    <div className="item-header">
                      <div className="title">
                        <Link to={ "/seller_profile/" + adza.AdzaProfileId }>{adza.Adza_Profile.User ? adza.Adza_Profile.User.business_name : ''}</Link>
                      </div>
                      <div className="sites">
                        <img src={require("../res/img/instagram.png")} alt=""/>
                        <img src={require("../res/img/facebook.png")} alt=""/>
                        <img src={require("../res/img/youtube.png")} alt=""/>
                      </div>
                      <div className="types">
                        <a className="btn btn-default btn-type btn-food">Food</a>
                        <a className="btn btn-default btn-type btn-topchef">TopChef</a>
                        <a className="btn btn-default btn-type btn-millenials">Millenials</a>
                        <div className="hide-end"></div>
                      </div>
                    </div>
                    <div className="item-image">
                      <img src={require("../res/img/item1.png")} alt=""/>
                    </div>
                    <div className="item-footer">
                      <div className="reach">
                        <i className="fa fa-user"></i>
                        <span> 60k+</span> 
                      </div>
                      <div className="rating">
                        <i className="fa fa-star"></i>
                        <span> 5.0(17)</span> 
                      </div>
                      <div className="price">
                        <span className="small"> Starting at </span>
                        <span className="value"> $100 </span>
                        <a onClick={this.removeAdza.bind(this, adza.AdzaProfileId)}><img src={require("../res/img/delete.png")} alt=""/></a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { latest_campaign, cleaned, savedAdza } = state.buyer;
  const { latest_history } = state.seller;
  return {
    latest_campaign,
    latest_history,
    cleaned,
    savedAdza
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
)(withRouter(BuyerLanding));
