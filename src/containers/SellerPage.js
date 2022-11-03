import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { sellerActions } from '../store/actions';
import { buyerActions } from '../store/actions';

import "react-datepicker/dist/react-datepicker.css";
import "../res/css/infoflowPage.css"
import "../res/css/sellers.css"
import $ from "jquery";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import avatarDefault from '../res/img/default_avatar.png';
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class Sellers extends React.Component{
  state={
        "startDate":[],
        "headerType":"buyer",
        "sellerprofile":{}};

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType );
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.state.sellerprofile = {...props.sellerprofile,Channels:[]};
  }

  componentDidMount(){
    document.title = "Sellers"
  }

  componentWillMount()
  {
    const { dispatch } = this.props;
    let path = this.props.location.search.split('?');

    if(path[1])
      dispatch(sellerActions.getAllProfile(parseInt(path[1])));
    else if (this.props.user == undefined) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(props)
  {
    if (props.location.search !== this.props.location.search) {
      const { dispatch } = this.props;
      let path = props.location.search.split('?');

      if(path[1])
        dispatch(sellerActions.getAllProfile(parseInt(path[1])));
    }

    if (props.sellerinfo !== undefined)
    {
      var profile_photo;
      
      profile_photo = uploadRoot+"/adza_avatar/"+props.sellerinfo.UserId+".png?"+new Date();
      if (props.buyer_sellerview === false)
      { 
        if (props.sellerprofile.profile_photo) {
          profile_photo = props.sellerprofile.profile_photo;
        }
        
        this.setState({sellerprofile:{...props.sellerinfo,...props.sellerprofile,profile_photo}});
      }
      else
      {
        this.setState({sellerprofile:{...props.sellerinfo,profile_photo}});
      }
    }
  }

  onChangeStartDate(date,event,i) {
    var temp = this.state.startDate.slice(0);
    console.log(event);
    temp[i] = date;
    this.setState({
      startDate: [...temp]
    });
  };

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

  slideTab(index){
    for(var i = 0;$("#panel_"+i).length; i++){
      if(index !== i)
        $("#panel_"+i).slideUp();
    }
    $("#panel_"+index).slideToggle();
  }

  addToCart( _listingId, _sellerId ) {
    var localcart = localStorage.getItem('cart');
    var cur_cart_id = this.props.current_cart ? this.props.current_cart.id : localcart.id;
    this.props.dispatch(buyerActions.addListingToCart(cur_cart_id, _listingId, _sellerId));
  }

  onError(e){
    e.target.src = avatarDefault;
  }

  render(){
    var {audience_age_max,
        audience_age_min,
        audience_interests,
        audience_locations,
        audience_male_percent,
        image_gallery,
        profile_description,
        profile_location,
        profile_photo,Channels,User,UserId} = this.state.sellerprofile;
    var str = "";
    let preview_image;

    preview_image = <img className="profile" src={profile_photo} alt="" onError={this.onError}/>

    return (
      <div className="dashboard_seller">
        <div className="sellers container">
          <div className="row">
            <div className="sidebar col-md-3">
              <div className="section target_tree">
                <div className="image">
                  { preview_image }
                  <div className="tree">{User?User.f_name + ' ' + User.l_name:""}</div>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <span className="reviews_star"> 5.0 (17 Reviews)</span>
                    <div className="official">
                      { profile_description }
                    </div>
                    <div className="msg">
                      <Link to={this.props.buyer_sellerview==false?"/seller_messages":{ pathname: '/buyer_messages', UserId }} className="message_link">Message</Link>
                    </div>
                  <div className="divider"></div>
                </div>
              </div>
              <div className="from_avg">
                <div className="from">
                  <img class="channel_img" src={require("../res/img/map_maker.png")} alt=""/>From
                  <span className="value">{profile_location}</span>
                </div>
                <div className="avg">
                  <img class="channel_img" src={require("../res/img/clock.png")} alt=""/>Avg. Response Time
                  <span className="value">8 hrs</span>
                </div>
              </div>
              <div className="channels">
                <img class="channel_img" src={require("../res/img/play.png")} alt=""/>Channels
                <span className="social_icons">
                  {
                    Channels.map(
                      (item)=><img src={require("../res/img/"+item.media_type+".png")} alt=""/>
                    )
                  }
                </span>
              </div>
              <div className="audience">
                <h4><i className="fa fa-user"></i> Audience Attributes</h4>
                <div className="info row">
                  <div className="felid col-md-4">
                    Age
                  </div>
                  <div className="value col-md-6">
                    {audience_age_min}-{audience_age_max} yrs old
                  </div>
                </div>
                <div className="info row">
                  <div className="felid col-md-4">
                    Gender
                  </div>
                  <div className="value col-md-6">
                    Men {audience_male_percent}%<br/> 
                    Female {100-audience_male_percent}%
                  </div>
                </div>
                <div className="info row">
                  <div className="felid col-md-4">
                    Location
                  </div>
                  <div className="value col-md-6">
                    {
                      audience_locations.map(
                        (item) => (
                          <div>{item.name}</div>
                        )
                      )
                    }
                  </div>
                </div>
                <div className="info row">
                  <div className="felid col-md-4">
                    Interests
                  </div>
                  <div className="value col-md-6">
                    {
                      audience_interests.map(
                        (item,index) => {
                          str += (index?', ':' ') + item.name;
                        }
                      )
                    }
                    {str}
                  </div>
                </div>
              </div>
            </div>
            <div className="sellers_content col-md-9">
              <div className="row slider">
                <Carousel showThumbs={false}>
                  {
                    image_gallery.map(
                      (item)=>(
                        <div className="image-galleryitem">
                          {
                            function(){
                              var image;
                              image = <img src={uploadRoot+"/image_gallery/"+UserId+"/"+item} alt=""/>
                              return image;
                            }()
                          }
                        </div>
                      )
                    )
                  }
                </Carousel>
              </div>

              <div className="row listings">
                <div className="portlet-title">
                            <div className="caption">
                                Listings 
                            </div>
                            <div className="tools">
                                <a href="javascript:;" className="collapse" data-original-title="" title=""> </a>
                                <a href="#portlet-config" data-toggle="modal" className="config" data-original-title="" title=""> </a>
                                <a href="javascript:;" className="reload" data-original-title="" title=""> </a>
                                <a href="javascript:;" className="remove" data-original-title="" title=""> </a>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="panel-group" id="accordion3">
                              {
                                Channels.map(
                                  (item,index) => (
                                    <div className="panel panel-default">
                                      <div className="panel-heading">
                                          <h4 className="panel-title">
                                            <a className="accordion-toggle collapsed" onClick={this.slideTab.bind(this,index)}>
                                                <img className="tab-mediatype" src={require("../res/img/"+item.media_type+"_sq.png")}  alt=""/>
                                                <span className="mediatype-name">{item.media_type}</span>
                                                <span>
                                                  {item.username}
                                                  <i className="fa fa-angle-up"></i>
                                                </span>
                                              </a>
                                          </h4>
                                      </div>
                                      <div id={"panel_"+index} className="panel-collapse collapse" aria-expanded="false">
                                          <div className="panel-body">
                                            <div className="body_header">
                                              <div className="header_posts">
                                                <div className="col-sm-3">
                                                  <i className="fa fa-user"></i>Followers
                                                </div>
                                                <div className="col-sm-3">  
                                                  <i className="fa fa-user"></i>Engagement Rate
                                                </div>
                                                <div className="col-sm-3">
                                                  <i className="fa fa-commenting"></i>Avg Comments
                                                </div>
                                                <div className="col-sm-3">
                                                  <i className="fa fa-clone"></i>Posts per Week
                                                </div>
                                              </div>
                                              <div className="header_posts_value">
                                                <div className="col-sm-3">
                                                  {this.showFollows(item.follows)}
                                                </div>
                                                <div className="col-sm-3">
                                                  2.95%
                                                </div>
                                                <div className="col-sm-3">
                                                  30
                                                </div>
                                                <div className="col-sm-3">
                                                  2.95%
                                                </div>
                                              </div>
                                            </div>
                                              <div className="body_content">
                                                {
                                                  item.Listings.map(
                                                    (list,index) => (
                                                      <div className="item post row">
                                                        <div className="col-sm-4">
                                                          <img className="adlist-media" src={require("../res/img/"+list.media_type+"_sq.png")}  alt=""/>
                                                          {list.title}
                                                        </div>
                                                        <div className="col-sm-4 datetime">
                                                             <i className="fa fa-calendar"></i> 
                                                             <DatePicker
                                                               className="btn btn-default"
                                                               selected={this.state.startDate[1]}
                                                               onChange={(date,event)=>{this.onChangeStartDate(date,event,1)}}
                                                               placeholderText="Choose Post Date"
                                                               dateFormat="YYYY-MM-dd"
                                                             />
                                                          </div>
                                                        <div className="col-sm-4 action">
                                                          <Link to="/cart" onClick={this.addToCart.bind(this, list.id, list.AdzaProfileId)}>
                                                              ${list.price} <i className="fa fa-cart-plus"></i>
                                                          </Link>
                                                        </div>
                                                      </div>
                                                    )
                                                  )
                                                }
                                              </div>
                                          </div>
                                      </div>
                                    </div>
                                  )
                                )
                              }
                            </div>
                        </div>
                    </div>
                    <div className="row reviews">
                      <div className="caption">
                        Reviews
                        <span className="mark_star"><i className="fa fa-star"></i>  5.0</span> <span className="reviews_star">(17 Reviews)</span>
                      </div>
                      <div className="review_lists">
                        <div className="person">
                          <img src={require("../res/img/review_thum1.png")}  alt=""/>
                          maximsalveson
                          <i className="fa fa-star"></i> 5.0
                        </div>
                        <div className="content">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo!
                        </div>
                        <div className="divider"></div>

                        <div className="person">
                          <img src={require("../res/img/review_thum1.png")}  alt=""/> maximsalveson
                          <i className="fa fa-star"></i> 5.0
                        </div>
                        <div className="content">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo!
                        </div>
                        <div className="divider"></div>

                        <div className="person">
                          <img src={require("../res/img/review_thum1.png")}  alt=""/> maximsalveson
                          <i className="fa fa-star"></i> 5.0
                        </div>
                        <div className="content">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo!
                        </div>
                        <div className="divider"></div>
                        <div className="seemore">
                          <button>See More <i className="fa fa-angle-down"></i></button>
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
    const { sellerprofile, sellerinfo, buyer_sellerview, AdzaprofileId } = state.seller;
    const { current_cart } = state.buyer;

  return {
    user,
    sellerprofile,
    sellerinfo,
    buyer_sellerview,
    AdzaprofileId,
    current_cart
  };
};

const mapDispatchToProps = dispatch => {
  return {dispatch};
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sellers);
