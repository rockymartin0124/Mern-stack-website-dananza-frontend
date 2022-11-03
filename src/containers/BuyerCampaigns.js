import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import $ from "jquery";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { buyerActions } from '../store/actions';
import { sellerActions } from '../store/actions';
import moment from 'moment';
import DatePicker from "react-datepicker";

import BuyerSidebar from "../components/Sidebar/BuyerSidebar";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import "../res/css/Dananza_Search.css"
import "../res/css/BuyerCampaigns.css"

class BuyerCampaigns extends React.Component{

  state={
    'headerType': "buyer",
    'campaign_status': 'All',
    allCampaigns: [],
    filteredCampaigns: [],
    orderhistories:[],
    filter: '',
    flag : false,
  }

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )

    this.props.dispatch(buyerActions.getAllCampaigns());
  }

  componentWillReceiveProps( nextprops ) {
    const { campaigns, camp_index, latest_history} = nextprops;
    let orderhistories = this.state.orderhistories.slice(0);
    if (camp_index != undefined) {
      orderhistories[camp_index] = latest_history;
    }
    
    if( campaigns !== undefined ){
      this.setState({ allCampaigns: campaigns, 
                      filteredCampaigns: campaigns.filter(camp => camp.campaign_status == 'open'), 
                      orderhistories });
    }

    if(campaigns && this.state.flag == false)
    {
      this.setState({flag:true});
      campaigns.map(
        (item, index) => item.Campaign_Listings.map(
          (listing, idx) => (
            listing.Order ? this.props.dispatch(sellerActions.getLatestOrderHistory (listing.Order.id, index)) : ''
          ) 
        )
      )
    }
  }

  onChangeRelevance = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidUpdate(){
    document.title = "Buyer Campaigns"

    var index     = 1;
    var sliderItemCount = $(".slider-item").length;

    if(sliderItemCount == index) {
      $(".indicator .next").addClass('disabled');
    }

    if(index == 1) {
      $(".indicator .previous").addClass('disabled');
    }

    $(window).resize(function(){
      if( $(".page-sidebar").css('display') == 'none' )
        $(".slider-item:first").css('margin-left', 'calc(((( -100vw )*0.74445) - 15px)*'+(index-1)+')');
      else
        $(".slider-item:first").css('margin-left', 'calc(((( -100vw + 330px )*0.74445) - 15px)*'+(index-1)+')');
    });

    $(".next").click(function () {
      var itemWidth   = parseInt($(".slider-item").css('width'));
      if(sliderItemCount == index+1) {
        $(".indicator .next").addClass('disabled');
      }
      else{
        $(".indicator .next").removeClass('disabled');  
      }
      $(".indicator .previous").removeClass('disabled');  

      index++;
      if( $(".page-sidebar").css('display') == 'none' )
        $(".slider-item:first").css('margin-left', 'calc(((( -100vw )*0.74445) - 15px)*'+(index-1)+')');
      else
        $(".slider-item:first").css('margin-left', 'calc(((( -100vw + 330px )*0.74445) - 15px)*'+(index-1)+')');
    });

    $(".previous").click(function () {
      var itemWidth   = parseInt($(".slider-item").css('width'));
      if(index == 2) {
        $(".indicator .previous").addClass('disabled');
      }
      else{
        $(".indicator .previous").removeClass('disabled');  
      }
      $(".indicator .next").removeClass('disabled');  
    
      index--;
      if( $(".page-sidebar").css('display') == 'none' )
        $(".slider-item:first").css('margin-left', 'calc(((( -100vw )*0.74445) - 30px)*'+(index-1)+')');
      else
        $(".slider-item:first").css('margin-left', 'calc(((( -100vw + 330px )*0.74445) - 30px)*'+(index-1)+')');
    });
  }

  filterCampaign( e )
  {
    var temp = [];

    if(e.target.value === 'allcampiagns')
        temp = this.state.allCampaigs;
    else
        temp = this.state.allCampaigns.filter(camp => camp.campaign_status == e.target.value)

    this.setState({ campaign_status: e.target.value, filteredCampaigns: temp });
  }

  render(){

    var { orderhistories } = this.state;
    var { campaigns } = this.props;

    //completed campaigns;
    var completedCampaigns = campaigns ? campaigns.filter(camp => camp.campaign_status === 'open') : [];

    return (
      <div className="buyer_landing buyer_campaign">
        <div className="page-container">
           <div className="page-content">
              <BuyerSidebar navitem={"campaigns"}/>
              <div className="page-main">
                <div className="page-main-header">
                  <span className="headline-first">
                    Campaigns
                  </span>
                  <div className="pull-right headline-second campaing_selector">
                    Campaign Status: 
                    <Select
                      value={this.state.campaign_status}
                      onChange={this.filterCampaign.bind(this)}
                      inputProps={{
                        name: 'campaign',
                        id: 'campaign-selector',
                      }}
                    >
                      <MenuItem value={'allcampiagns'}>All Campaigns</MenuItem>
                      <MenuItem value={'open'}>Order Date</MenuItem>
                      <MenuItem value={'upload'}>Media Uploaded</MenuItem>
                      <MenuItem value={'accepted'}>Order Accepted</MenuItem>
                      <MenuItem value={'launched'}>Ad Launched</MenuItem>
                      <MenuItem value={'approved'}>Buyer Approved</MenuItem>
                    </Select>
                  </div>
                </div>
                <hr className="divider-line" />
                {
                  // this.state.allCampaigns.length == orderhistories.length ? (
                  orderhistories != undefined && this.state.filteredCampaigns && orderhistories.length > 0 ? (
                    <div>
                      <div className="third-title">Pending Campaigns</div>
                      <div className="main-slider">
                        {
                          this.state.filteredCampaigns ? this.state.filteredCampaigns.map(
                            (item, index) =>(

                              <div className="slider-item">
                                <div className="panel-title">
                                  <span className="first">{ item.campaign_name }</span>
                                  <span className="second">  
                                    <Link to={{ pathname: '/buyer_messages', adzaInfo: item }} className="color-dark">
                                      <i className="fa fa-comment-o"></i> Message
                                    </Link>
                                  </span>
                                </div>
                                <div className="panel-body">
                                    {
                                      orderhistories[index] && orderhistories[index].length == item.Campaign_Listings.length ? item.Campaign_Listings.map (
                                        (listing, listingIdx) =>
                                          (
                                            <div>
                                              <div style={{"width": "100%", "text-align": "center", "font-size": "20px"}}>{listing.Listing.title}</div>
                                              <div className="campaign-timeline">
                                                <div className={ (orderhistories[index][listingIdx][0].order_status === "accept" ? "active" : '') + " step first"}>
                                                  <div className="step-button">
                                                    <hr className="left" />
                                                    <hr className="right" />
                                                    <a className="circle">
                                                      <img src={require('../res/img/check.png')} alt=""/>
                                                    </a>
                                                  </div>
                                                  <div className="step-label">Order Date</div>
                                                  <div className="step-label">{ orderhistories.length ? moment(orderhistories[index][listingIdx][0].update_time).format('DD/MM'):''}</div>
                                                </div>
                                                <div className={ (orderhistories[index][listingIdx][1] && orderhistories[index][listingIdx][1].order_status === "accept" ? "active" : '') + " step"}>
                                                  <div className="step-button">
                                                    <a className="circle">
                                                      <img src={require('../res/img/check.png')} alt=""/>
                                                    </a>
                                                    <hr className="left" />
                                                    <hr className="right" />
                                                  </div>
                                                  <div className="step-label">Media Uploaded</div>
                                                  <div className="step-label">{ orderhistories.length && orderhistories[index][listingIdx][1] ? moment(orderhistories[index][listingIdx][1].update_time).format('DD/MM'):''}</div>
                                                </div>
                                                <div className={ (orderhistories[index][listingIdx][2] && orderhistories[index][listingIdx][2].order_status === "accept" ? "active" : '') + " step"}>
                                                  <div className="step-button">
                                                    <a className="circle">
                                                      <img src={require('../res/img/check.png')} alt=""/>
                                                    </a>
                                                    <hr className="left" />
                                                    <hr className="right" />
                                                  </div>
                                                  <div className="step-label">Order Accepted</div>
                                                  <div className="step-label">{ orderhistories.length && orderhistories[index][listingIdx][2] ? moment(orderhistories[index][listingIdx][2].update_time).format('DD/MM'):''}</div>
                                                </div>
                                                <div className={ (orderhistories[index][listingIdx][3] && orderhistories[index][listingIdx][3].order_status === "accept" ? "active" : '') + " step"}>
                                                  <div className="step-button">
                                                    <a className="circle">
                                                      <img src={require('../res/img/check.png')} alt=""/>
                                                    </a>
                                                    <hr className="left" />
                                                    <hr className="right" />
                                                  </div>
                                                  <div className="step-label">Ad Launched</div>
                                                  <div className="step-label">{ orderhistories.length && orderhistories[index][listingIdx][3] ? moment(orderhistories[index][listingIdx][3].update_time).format('DD/MM'):''}</div>
                                                </div>
                                                <div className={ (orderhistories[index][listingIdx][4] && orderhistories[index][listingIdx][4].order_status === "accept" ? "active" : '') + " step last"}>
                                                  <div className="step-button">
                                                    <a className="circle">
                                                      <img src={require('../res/img/check.png')} alt=""/>
                                                    </a>
                                                    <hr className="left" />
                                                    <hr className="right" />
                                                  </div>
                                                  <div className="step-label">Buyer Approved</div>
                                                  <div className="step-label">{ orderhistories.length && orderhistories[index][listingIdx][4] ? moment(orderhistories[index][listingIdx][4].update_time).format('DD/MM'):''}</div>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                         
                                        )                
                                      : ''
                                    } 
                                  <div className="message-table">
                                    <table className="table">
                                      <thead>
                                        <tr style={{'backgroundColor': '#f1f6f9'}}>
                                          <th><span className="">adza</span></th>
                                          <th>Medium</th>
                                          <th>Schedule Date</th>
                                          <th>Amount</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                      {
                                        item.Campaign_Listings.length > 0 ? item.Campaign_Listings.map(
                                          (l_items, l_index) =>(
                                            <tr style={{'height':'73px'}}>
                                              <td>
                                                <img 
                                                  src={require("../res/img/" + l_items.Listing.media_type + "_sq.png")} alt=""/>
                                                  <Link className="color-dark" to={'/seller_page?'+l_items.AdzaProfileId}>{ l_items.Listing.Channel.username }</Link>
                                              </td>
                                              <td>{ l_items.Listing.media_type }</td>
                                              <td>{ l_items.Listing.insert_date.substring(0, 10) }</td>
                                              <td className="price">{ l_items.Listing.price }</td>
                                              <td>
                                                <Link className="btn btn-lg preview-media pull-right" 
                                                      to={"/neworder_buyer?"+(l_items.Order ? l_items.Order.id : 0)}>
                                                  <img src={require("../res/img/review.png")}/>Review Post
                                                </Link>

                                              </td>
                                            </tr>
                                          )
                                        ) : (
                                              this.state.allCampaigns[0].Campaign_Listings.map(
                                                (i, n) => 
                                                (
                                                  <tr style={{'height':'73px'}}>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                  </tr>
                                                )                                               
                                            )
                                        )
                                      }
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="cancel">
                                    <a href="#"><img src={require("../res/img/remove.png")} alt=""/> Cancel Ad</a>
                                  </div>
                                </div>
                              </div>
                            )) : ''
                        }
                      </div>
                      <div className="indicator">
                        <a className="next"><i className="fa fa-angle-right"></i></a> 
                        <a className="previous"><i className="fa fa-angle-left"></i></a>
                      </div>
                      <hr className="divider-line"/>
                    </div>
                  ) 
                  : 
                  <div className="no_campaign"> You haven't any Campaign...</div>
                }
                <div className="third-title">Completed Campaigns</div>
                  <div className="page-result-content">
                  {
                    completedCampaigns.length > 0 ? 
                      completedCampaigns.map(
                        (item, index) => 
                        (
                          item.Campaign_Listings.length > 0 ?
                            <div className="campaign">
                              <img src={require("../res/img/order1.png")}  alt=""/>
                              <div className="campaign-content">
                                <div className="content-header">
                                  <span className="header-left">
                                    {
                                        <img src={require("../res/img/" + item.Campaign_Listings[0].Listing.media_type + "_sq.png")}  alt=""/>
                                    }
                                      <span>Ad Campaign</span>
                                      <a>axel92</a>
                                  </span>
                                  <span className="header-right">
                                    <span className="price">${ item.campaign_price }</span>
                                    <Link to="/seller_messages"><img src={require("../res/img/message.png")}  alt=""/>Message</Link>
                                  </span>
                                </div>
                                <div className="content-body">
                                  <div className="campaign-timeline">
                                    <div className="step first active">
                                      <div className="step-button">
                                        <a className="circle">
                                          <img src={require('../res/img/check.png')} alt=""/>
                                        </a>
                                        <hr className="left" />
                                        <hr className="right" />
                                      </div>
                                      <div className="step-label">Order Date</div>
                                      <div className="step-label">
                                        {
                                          item.Campaign_Listings[0].Order && item.Campaign_Listings[0].Order.Order_Histories ? 
                                            moment(item.Campaign_Listings[0].Order.Order_Histories[0].update_time).format('DD/MM')
                                            : ''
                                        }
                                      </div>
                                    </div>
                                    <div className="step active">
                                      <div className="step-button">
                                        <a className="circle">
                                          <img src={require('../res/img/check.png')} alt=""/>
                                        </a>
                                        <hr className="left" />
                                        <hr className="right" />
                                      </div>
                                      <div className="step-label">Media Uploaded</div>
                                      <div className="step-label">
                                        {
                                          item.Campaign_Listings[0].Order && item.Campaign_Listings[0].Order.Order_Histories ? 
                                            moment(item.Campaign_Listings[0].Order.Order_Histories[0].update_time).format('DD/MM')
                                            : ''
                                        }
                                      </div>
                                    </div>
                                    <div className="step active">
                                      <div className="step-button">
                                        <a className="circle">
                                          <img src={require('../res/img/check.png')} alt=""/>
                                        </a>
                                        <hr className="left" />
                                        <hr className="right" />
                                      </div>
                                      <div className="step-label">Order Accepted</div>
                                        <div className="step-label">
                                          {
                                            item.Campaign_Listings[0].Order && item.Campaign_Listings[0].Order.Order_Histories ? 
                                              moment(item.Campaign_Listings[0].Order.Order_Histories[0].update_time).format('DD/MM')
                                              : ''
                                          }
                                        </div>
                                    </div>
                                    <div className="step active">
                                      <div className="step-button">
                                        <a className="circle">
                                          <img src={require('../res/img/check.png')} alt=""/>
                                        </a>
                                        <hr className="left" />
                                        <hr className="right" />
                                      </div>
                                      <div className="step-label">Ad Launched</div>
                                        <div className="step-label">
                                          {
                                            item.Campaign_Listings[0].Order && item.Campaign_Listings[0].Order.Order_Histories ? 
                                              moment(item.Campaign_Listings[0].Order.Order_Histories[0].update_time).format('DD/MM')
                                              : ''
                                          }
                                        </div>
                                    </div>
                                    <div className="step last active">
                                      <div className="step-button">
                                        <a className="circle">
                                          <img src={require('../res/img/check.png')} alt=""/>
                                        </a>
                                        <hr className="left" />
                                        <hr className="right" />
                                      </div>
                                      <div className="step-label">Buyer Approved</div>
                                        <div className="step-label">
                                          {
                                            item.Campaign_Listings[0].Order && item.Campaign_Listings[0].Order.Order_Histories ? 
                                              moment(item.Campaign_Listings[0].Order.Order_Histories[0].update_time).format('DD/MM')
                                              : ''
                                          }
                                        </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="content-footer">
                                  <button className="btn btn-default btn-transparent btn-radius">
                                  <img src={require("../res/img/eye.png")}  alt=""/>
                                    View This Ad
                                  </button>
                                </div>
                              </div>
                            </div>
                          : ''
                        )
                      )
                    : 
                    <div className="no_campaign"> You haven't any Completed Campaign...</div>
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
  const { campaigns } = state.buyer;
  const { latest_history, camp_index } = state.seller;

  return {
    campaigns,
    latest_history,
    camp_index
  };  
};

const mapDispatchToProps = dispatch => {
  return {
     dispatch, 
  }
  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BuyerCampaigns));
