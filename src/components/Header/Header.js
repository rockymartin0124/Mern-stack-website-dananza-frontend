import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions, sellerActions, buyerActions } from '../../store/actions';
import { withRouter } from "react-router-dom";
import avatarDefault from '../../res/img/default_avatar.png';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

import "../../res/bootstrap/css/bootstrap.min.css"
import "../../res/font-awesome/css/font-awesome.min.css"
import "../../res/css/components.min.css"
import "../../res/css/global.css"
import "../../res/css/header.css"
import "../../res/css/header_search.css"
import "../../res/css/layout.min.css"
// import "../../res/css/drop_menu.css"

import $ from "jquery";

import logoUrl from '../../res/img/logo.png';
import { apiConfig } from '../../store/config';
const uploadRoot = apiConfig.uploadRoot;

class Header extends React.Component{
  state = {
    headerType: "",
    show_search: true,
    user_type: "buyer",
    has_seller_acct: false,
    openAlert: false,
    alertmsg: "",
    alertType: "",
    searchinput: "",
    new_buyer_msg: false,
    new_seller_msg: false
    
  };
  toggleflag = 0;
  goMyAdzaPage = false;
  constructor(props) {
    super(props);

    this.validateToken = this.validateToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillReceiveProps( nextProps ){
    window.jQuery = $;
    window.$ = $;
    global.jQuery = $;
    
    const bootstrap = require('bootstrap');
    const { loggedIn, type, user, profile, user_type } = nextProps;

    if (this.goMyAdzaPage == true && nextProps.adzaId != undefined) {
      this.props.history.push("/seller_page?"+nextProps.adzaId);
      this.goMyAdzaPage = false;
    }

    if (nextProps.new_seller_msg)
      this.setState({new_seller_msg:nextProps.new_seller_msg});
    if (nextProps.new_buyer_msg)
      this.setState({new_seller_msg:nextProps.new_buyer_msg});

    if (nextProps.alert != this.props.alert)
    {
      var alertType = "";
      if (nextProps.alert.type == 'alert-success')
        alertType = "success";
      else if (nextProps.alert.type == 'alert-danger')
        alertType = "error";
      else if (nextProps.alert.type == 'alert-danger')
        alertType = "info";
      this.setState({openAlert:true,alertmsg:nextProps.alert.message,alertType});
    }

    if( profile !== undefined ){
      this.setState({has_seller_acct: profile.has_seller_acct}) 
    }

    this.setState({headerType: nextProps.type}) 

      // Handle Search Box on Header
    if( window.location.pathname === '/' || window.location.pathname === '/signup' )
       this.setState({ show_search: false});
    else
       this.setState({ show_search: true }); 

    if( user_type === 'seller' )
      this.setState({ user_type: "seller" }) 
    else
      this.setState({ user_type: "buyer" }) 
    
    // Handle Header Type for Buyer and Seller
    if( loggedIn !== undefined )
    {
      if(type === "seller" || this.state.user_type === "seller")
      {
        this.setState({ headerType: "seller"});
      }
      else
      {
        this.setState({ headerType: "buyer"});
      }
    }
    if ( !loggedIn )
    {
      this.setState({ headerType: "static"});
    }

    this.validateToken(nextProps);
  }

  componentDidMount() {
    this.setState({headerType: this.props.type});
  };

  componentWillMount() {
    if (this.props.loggedIn == true) {
      this.props.dispatch(buyerActions.getBuyerProfile());
    }
  }

  componentDidUpdate(prevProps,prevState,prevContext){
    if(prevState.headerType !== "seller" && prevState.headerType !== "buyer" && prevState.headerType !== "static"){
      $('.header_search .mobile_navbar_toggler').on('click', function() 
      {
        if( $('.nav_mobile_menu').css('display') == 'none' ) 
        {
          $('.mobile_navbar_toggler').removeClass('navbar_toggler_open');
          $('.mobile_navbar_toggler').addClass('navbar_toggler_close');
        }
        else 
        {
          $('.mobile_navbar_toggler').removeClass('navbar_toggler_close');
          $('.mobile_navbar_toggler').addClass('navbar_toggler_open');
        }
        $('.nav_mobile_menu').slideToggle(200);
      });
    }
    $('.header_section .mobile_navbar_toggler').on('click', function() 
    {
      if( $('.nav_mobile_menu').css('display') == 'none' ) 
      {
        $('.mobile_navbar_toggler').removeClass('navbar_toggler_open');
        $('.mobile_navbar_toggler').addClass('navbar_toggler_close');
      }
      else 
      {
        $('.mobile_navbar_toggler').removeClass('navbar_toggler_close');
        $('.mobile_navbar_toggler').addClass('navbar_toggler_open');
      }
      $('.nav_mobile_menu').slideToggle(200);
    });
  }

  logout()
  {
    this.setState({has_seller_acct:false});
    this.props.dispatch(userActions.logout());
  }

  showSellerProfile()
  {
    const { dispatch } = this.props;
    this.goMyAdzaPage = true;
    dispatch(sellerActions.moveMySellerPage());
  }

  validateToken(nextProps)
  {
    const { loggedIn, type } = nextProps;

    if( (!loggedIn || loggedIn == "undefined") 
        && window.location.pathname != '/' 
        && window.location.pathname != '/about'
        && window.location.pathname != '/help'
        && window.location.pathname != '/cart'
        && window.location.pathname != '/checkout'
        && window.location.pathname != '/uploadfiles'
        && window.location.pathname != '/signup'
        && window.location.pathname != '/results'
        && window.location.pathname != '/seller_page'
      )
    {  
        this.props.history.push('/');
    }
  }

  switchToSeller(){
    const { dispatch } = this.props;
    dispatch( userActions.switchToSeller() );

    this.props.history.push('/seller_dashboard');
  }
  switchToBuyer(){
    const { dispatch } = this.props;
    dispatch( userActions.switchToBuyer() );

    this.props.history.push('/buyer_landing');
  }
  handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openAlert: false });
  };
  onChangeSearch(e){
    this.setState({searchinput:e.target.value});
  }
  onSearch(){
    this.props.history.push('/results?'+this.state.searchinput);
  }

  onError(e){
    e.target.src = avatarDefault;
  }
  /*
    header types:
      static : for general pages such as About, Help & Support
      homepage : for homepage
      seller : for seller pages
      buyer : for buyer pages
  */
  renderSwitchHeader(){

    const {profile,user} = this.props;

    let BuyerAvatar, SellerAvatar;
    let alert;
    const {new_seller_msg,new_buyer_msg} = this.state;

    if (user && user.user_info) {
      BuyerAvatar = <img className="profile" src={uploadRoot+"/buyer_avatar/"+user.user_info.id+".png?"+new Date()} onError={this.onError}/>

      SellerAvatar = <img className="profile" src={uploadRoot+"/adza_avatar/"+user.user_info.id+".png?"+new Date()} onError={this.onError}/>
    }

    alert = (<Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            className={this.state.alertType+" snackAlert"}
            open={this.state.openAlert}
            onClose={this.handleCloseSnack}
            message={this.state.alertmsg}
            autoHideDuration={6000}
            style={{'z-index': '100000'}}
            action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseSnack}
            >
              <CloseIcon />
            </IconButton>
          ]}
          />);
    if( this.state.headerType == 'seller' ) // Seller Pages
    {
        return (
          <div className="header_search seller_header">
          {alert}
            <div className="nav_bar">
              <div className="logo">
                <Link to="/"><img src={logoUrl}  alt=""/></Link>
              </div>
              { this.state.show_search  > 0 &&
              <div className="input-icon">
                <i className="fa fa-search input"></i>
                <input type="text" className="form-control search-input" value={this.state.searchinput} onChange={(e)=>this.onChangeSearch(e)} placeholder="Where do you want to see your ad?"/>
                <button onClick={this.onSearch.bind(this)} className="btn green search-but">Search</button>
              </div>
              }
              <div className="nav_menu">
                <ul className="nav_menu_list">
                  <li>
                    <a onClick={this.showSellerProfile.bind(this)}>Adza Page</a>
                  </li>
                  <li>
                    <Link to="/seller_orders">Campaign</Link>
                  </li>
                  <li>
                    <Link to="/seller_messages"><img className={new_seller_msg?"":"hidden"} src={require("../../res/img/notice-message.png")} style={{margin:'0px 4px 12px'}} alt=""/>Messages</Link>
                  </li>
                  <li className="dropdown dropdown-user">
                    <a href="javascript:;" className="dropdown-toggle seller_toggle" 
                        data-toggle="dropdown" 
                        data-hover="dropdown" 
                        data-close-others="false"
                    >
                      {SellerAvatar}
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-default seller ">
                        <li>
                            <a onClick={this.showSellerProfile.bind(this)}>
                                My Profile 
                            </a>
                        </li>
                        <li>
                            <Link to="/seller_dashboard">
                                  My Dashboard 
                            </Link>
                        </li>
                        <li>
                            <Link to="/account_setting_account">
                                  Account Settings
                            </Link>
                        </li>
                        <li class="divider"> </li>
                        <li>
                            <Link to="/">
                                  Login to Other Accounts<img  className="menu_icon" src={require("../../res/img/drop_menu_icon_user.png")}/>
                            </Link>
                        </li>
                        <li class="other_act_img">
                            <a className="other_links" href="#">
                             <img src={require("../../res/img/drop_menu_item1.png")} alt=""/>
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item2.png")} alt=""/>                                
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item3.png")} alt=""/>                                
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item4.png")} alt=""/>
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item5.png")} alt=""/>
                            </a>
                            <div class="more">+2</div>
                        </li>
                        <li>
                            <a href="#" onClick={this.switchToBuyer.bind(this)}>
                                Switch to Buyer <img src={require("../../res/img/drop_menu_icon_swt.png")}  alt=""/>
                            </a>
                        </li>
                        <li>
                            <Link to="/help">
                                  Help <img src={require("../../res/img/drop_menu_icon_help.png")}  alt=""/>
                             </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={ this.logout }>
                                  Log Out<img src={require("../../res/img/drop_menu_icon_logout.png")}  alt=""/>
                            </Link>
                        </li>
                    </ul>
                  </li>
                </ul>
                <button id="navbar_toggler" className="navbar_toggler_open mobile_navbar_toggler" type="button">
                  <span className="navbar_toggler_icon"></span>
                </button>
              </div>
              <div className="nav_mobile_menu" style={{display:"none"}}>
                <ul className="nav_mobile_list">
                  { this.state.show_search  > 0 &&
                  <li>
                    <div className="input-icon">
                      <i className="fa fa-search input"></i>
                      <input type="text" className="form-control search-input" value={this.state.searchinput} onChange={(e)=>this.onChangeSearch(e)} placeholder="Where do you want to see your ad?" />
                      <button onClick={this.onSearch.bind(this)} className="btn green search-but">Search</button>
                    </div>
                  </li>
                  }
                  <li>
                    <a onClick={this.showSellerProfile.bind(this)}>Adza Page</a>
                  </li>
                  <li>
                    <Link to="/seller_orders">Campaign</Link>
                  </li>
                  <li>
                    <Link to="/seller_messages"><img className={new_seller_msg?"":"hidden"} src={require("../../res/img/notice-message.png")} style={{margin:'0px 4px 12px'}} alt=""/>Messages</Link>
                  </li>
                  <li className="dropdown dropdown-user">
                    <a href="javascript:;" className="dropdown-toggle seller_toggle" 
                        data-toggle="dropdown" 
                        data-hover="dropdown" 
                        data-close-others="false"
                    >
                      <img className="img-circle seller_toggle" src={require("../../res/img/drop_menu_profile.png")} alt=""/>
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-default seller ">
                        <li>
                            <a onClick={this.showSellerProfile.bind(this)}>My Profile</a>
                        </li>
                        <li>
                            <Link to="/seller_dashboard">
                                My Dashboard 
                            </Link>
                        </li>
                        <li>
                            <Link to="/account_setting_account">
                                Account Settings
                            </Link>
                        </li>
                        <li class="divider"> </li>
                        <li>
                            <Link to="/">
                                Login to Other Accounts<img  className="menu_icon" src={require("../../res/img/drop_menu_icon_user.png")} alt=""/>
                            </Link>
                        </li>
                        <li class="other_act_img">
                            <a className="other_links" href="#">
                             <img src={require("../../res/img/drop_menu_item1.png")} alt=""/>
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item2.png")} alt=""/>                                
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item3.png")} alt=""/>                                
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item4.png")} alt=""/>
                            </a>
                            <a className="other_links" href="#">
                              <img src={require("../../res/img/drop_menu_item5.png")} alt=""/>
                            </a>
                            <div class="more">+2</div>
                        </li>
                        <li>
                            <a href="#" onClick={this.switchToBuyer.bind(this)}>
                                Switch to Buyer <img src={require("../../res/img/drop_menu_icon_swt.png")}  alt=""/>
                            </a>
                        </li>
                        <li>
                            <Link to="/help">
                                  Help <img src={require("../../res/img/drop_menu_icon_help.png")}  alt=""/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={ this.logout }>
                                  Log Out<img src={require("../../res/img/drop_menu_icon_logout.png")}  alt=""/>
                            </Link>
                        </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        );
    }
    else if( this.state.headerType == 'buyer' ) // Buyer Pages
    {
        return ( 
          <div className="header_search buyer_header">
          {alert}
            <div className="nav_bar">
              <div className="logo">
                <Link to="/"><img src={logoUrl}/></Link>
              </div>
              { this.state.show_search  > 0 &&
              <div className="input-icon">
                <i className="fa fa-search input"></i>
                <input type="text" className="form-control search-input" value={this.state.searchinput} onChange={(e)=>this.onChangeSearch(e)} placeholder="Where do you want to see your ad?" />
                <button onClick={this.onSearch.bind(this)} className="btn green search-but">Search</button>
              </div>
              }
              <div className="nav_menu">
                <ul className="nav_menu_list">
                  <li>
                    <Link to="/buyer_saved">Saved</Link>
                  </li>
                  <li>
                    <Link to="/buyer_campaigns">Campaigns</Link>
                  </li>
                  <li>
                    <Link to="/buyer_messages"><img className={new_buyer_msg?"":"hidden"} src={require("../../res/img/notice-message.png")} style={{margin:'0px 4px 12px'}} alt=""/>Messages</Link>
                  </li>
                  <li>
                    <Link to="/cart"><i className="fa fa-shopping-cart"></i>Cart</Link>
                  </li>
                  <li className="dropdown dropdown-user">
                    <a href="javascript:;"
                       className="dropdown-toggle"
                       data-toggle="dropdown"
                       data-hover="dropdown"
                       data-close-others="false">
                        {BuyerAvatar}
                        <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-default seller">
                        <li>
                            <Link to="/buyer_profile">My Profile </Link>
                        </li>
                        <li>
                            <Link to="/buyer_landing">My Dashboard </Link>
                        </li>
                        <li>
                            <Link to="/account_setting_account">Account Setting</Link>
                        </li>
                        <li className="divider"> </li>
                        { this.state.has_seller_acct === true &&
                        <li>
                            <a onClick={this.switchToSeller.bind(this)}>
                                Switch to Seller
                                <img src={require("../../res/img/switch.png")} alt=""/>
                            </a>
                        </li>
                        }
                        <li>
                            <Link to="/help">
                                Help 
                                <img src={require("../../res/img/help.png")} alt=""/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={ this.logout }>
                              logout
                                <img src={require("../../res/img/logout.png")} alt=""/>
                            </Link>
                        </li>
                    </ul>
                  </li>
                </ul>
                <button id="navbar_toggler" className="navbar_toggler_open mobile_navbar_toggler" type="button">
                  <span className="navbar_toggler_icon"></span>
                </button>
              </div>
              <div className="nav_mobile_menu" style={{display:'none'}}>
                <ul className="nav_mobile_list">
                  { this.state.show_search  > 0 &&
                  <li>
                    <div className="input-icon">
                      <i className="fa fa-search input"></i>
                      <input type="text" className="form-control search-input" value={this.state.searchinput} onChange={(e)=>this.onChangeSearch(e)} placeholder="Where do you want to see your ad?" />
                      <button onClick={this.onSearch.bind(this)} className="btn green search-but">Search</button>
                    </div>
                  </li>
                  }
                  <li>
                    <Link to="/buyer_saved">Saved</Link>
                  </li>
                  <li>
                    <Link to="/buyer_campaigns">Campaigns</Link>
                  </li>
                  <li>
                    <Link to="/buyer_messages"><img className={new_buyer_msg?"":"hidden"} src={require("../../res/img/notice-message.png")} style={{margin:'0px 4px 12px'}} alt=""/>Messages</Link>
                  </li>
                  <li>
                    <Link to="/cart"><i className="fa fa-shopping-cart"></i>Cart</Link>
                  </li>
                  <li className="dropdown dropdown-user">
                    <a href="javascript:;"
                       className="dropdown-toggle"
                       data-toggle="dropdown"
                       data-hover="dropdown"
                       data-close-others="false">
                        <img className="img-circle" src={require("../../res/img/logged_user.png")} alt=""/>
                        <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-default seller">
                        <li>
                            <Link to="/buyer_profile">My Profile </Link>
                        </li>
                        <li>
                            <Link to="/buyer_landing">My Dashboard </Link>
                        </li>
                        <li>
                            <Link to="/account_setting_account">Account Setting</Link>
                        </li>
                        <li className="divider"> </li>
                        { this.state.has_seller_acct === true &&
                        <li>
                            <Link to="/seller_dashboard">
                                Switch to Seller
                                <img src={require("../../res/img/switch.png")}  alt=""/>
                            </Link>
                        </li>
                        }
                        <li>
                            <Link to="/help">
                                Help 
                                <img src={require("../../res/img/help.png")}  alt=""/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                              Log Out
                                <img src={require("../../res/img/logout.png")}  alt=""/>
                            </Link>
                        </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
    else if( this.state.headerType == 'homepage' ) // Homepage
    {
        return (
          <div className="header_section">
          {alert}
            <div className="nav_bar">
              <div className="logo">
                <Link to="/"><img src={logoUrl} alt=""/></Link>
              </div>
              <div className="nav_menu">
                <button id="navbar_toggler" className="navbar_toggler_open mobile_navbar_toggler" type="button">
                  <span className="navbar_toggler_icon"></span>
                </button>
                <ul className="nav_menu_list">
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <a data-toggle="modal" data-target="#myModal">Sign Up</a>
                    
                  </li>
                  <li>
                    <a data-toggle="modal" data-target="#login">Log In</a>
                  </li>
                  <li className="menu_last_li">
                    <Link to="/signup" className="btn bg-yellow btn-small">Become an Adza</Link>
                  </li>
                </ul>
              </div>
            </div>   
            <div className="nav_mobile_menu" style={{display:'none'}}>
              <div className="nav_bar">
                <div className="logo">
                  <Link to="/"><img src={logoUrl} alt=""/></Link>
                </div>
                <div className="nav_menu">
                  <button id="navbar_toggler" className="navbar_toggler_open mobile_navbar_toggler" type="button">
                    <span className="navbar_toggler_icon"></span>
                  </button>
                </div>
              </div>
              <ul className="nav_mobile_list">
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <a data-toggle="modal" data-target="#myModal">Sign Up</a>
                  
                </li>
                <li>
                  <a data-toggle="modal" data-target="#login">Log In</a>
                </li>
                <li className="menu_last_li">
                    <Link to="/signup" className="btn bg-yellow btn-small">Become an Adza</Link>
                </li>
              </ul>
            </div>
          </div>
        );
    }
    else // Static Pages
    {
      return ( 
        <div className="header_search">
        {alert}
            <div className="nav_bar">
                <div className="logo">
                    <Link to="/"><img src={logoUrl} alt=""/></Link>
                </div>
                { this.state.show_search  > 0 &&
                <div className="input-icon">
                    <i className="fa fa-search input"></i>
                    <input type="text" className="form-control search-input" value={this.state.searchinput} onChange={(e)=>this.onChangeSearch(e)} placeholder="Where do you want to see your ad?" />
                    <button onClick={this.onSearch.bind(this)} className="btn bg-blue search-but color-white">Search</button>
                </div>
                }
                <div className="nav_menu">
                    <ul className="nav_menu_list">
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                          <a data-toggle="modal" data-target="#myModal">Sign Up</a>
                        </li>
                        <li>
                          <a data-toggle="modal" data-target="#login">Log In</a>
                        </li>
                        <li className="menu_last_li">
                            <Link to="/signup" className="menu_adza">Become an Adza</Link>
                        </li>
                    </ul>
                    <button id="navbar_toggler" className="navbar_toggler_open mobile_navbar_toggler" type="button">
                      <span className="navbar_toggler_icon"></span>
                    </button>
                </div>
                <div className="nav_mobile_menu" style={{display:'none'}}>
              <ul className="nav_mobile_list">
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                  <a data-toggle="modal" data-target="#myModal">Sign Up</a>
                </li>
                <li>
                  <a data-toggle="modal" data-target="#login">Log In</a>
                </li>
                <li className="menu_last_li">
                  <Link to="/signup" className="btn bg-yellow btn-small">Become an Adza</Link>
                </li>
              </ul>
            </div>
            </div>
        </div>
      );
    }
  }

  render(){
    return (
      <div>
        
        { this.renderSwitchHeader() }
      </div>
    );
  }
};

const mapStateToProps = state => {
  const { adzaId, goMyAdzaPage} = state.seller;
  const { loggedIn, user, user_type } = state.authentication;
  const { profile } = state.buyer;
  const alert = state.alert;
  const {new_seller_msg,new_buyer_msg} = state.message;

  return {
    user,
    loggedIn,
    adzaId,
    user_type,
    profile,
    goMyAdzaPage,
    alert,
    new_seller_msg,
    new_buyer_msg
  };
};

const mapDispatchToProps = dispatch =>
{
  return { 
    dispatch,
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Header));

// export default withStyles(styles)(Header);
