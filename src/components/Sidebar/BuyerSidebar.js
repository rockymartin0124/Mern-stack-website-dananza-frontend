import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import avatarDefault from '../../res/img/default_avatar.png';

import "../../res/css/BuyerSidebar.css"
import { apiConfig } from '../../store/config';
const uploadRoot = apiConfig.uploadRoot;

const drawerWidth = 240;


const BuyerSidebar = props => {
  const { open, classes, navitem } = props;
  let avatar;

  let onError = function(e){
    e.target.src = avatarDefault;
  }
  
  if (props.user == undefined) {
    return "";
  }
  avatar = <img className="profile" src={uploadRoot+"/buyer_avatar/"+props.user.user_info.id+".png?"+new Date()} onError={onError}/>
 
  return (
    <div className="page-sidebar buyer-sidebar">
        <div className="section target-tree">
          <div className="image">
            {avatar}
            <h1 className="buyer-name">{props.user.user_info.f_name + " " + props.user.user_info.l_name}</h1>
            <h5 className="buyer-mail">{props.user.user_info.business_name}</h5>
          </div>
        </div>
        <div className="section">
          <div className="btn-group" data-toggle="buttons" id="pages">
            <Link to="/buyer_profile">
               <label className={navitem=="edit_profile"?"btn btn-default active":"btn btn-default"}>
                <img className="nav-icon" src={require("../../res/img/person.png")} alt=""/>
                  <input type="radio" className="toggle" /> Profile Page
              </label>
            </Link>
            <Link to="/buyer_saved">
               <label className={navitem=="saved"?"btn btn-default active":"btn btn-default"}>
                <img className="nav-icon" src={require("../../res/img/saved.png")} alt=""/>
                  <input type="radio" className="toggle" /> Saved
              </label>
            </Link>  
            <Link to="/buyer_campaigns">   
               <label className={navitem=="campaigns"?"btn btn-default active":"btn btn-default"}>
                <img className="nav-icon" src={require("../../res/img/campaigns.png")} alt=""/>
                  <input type="radio" className="toggle" /> Campaigns
              </label>
            </Link>  
            <Link to="/buyer_messages">
               <label className={navitem=="messages"?"btn btn-default active":"btn btn-default"}>
                <img className="nav-icon" src={require("../../res/img/messages.png")} alt=""/>
                  <input type="radio" className="toggle" /> Messages
              </label>
            </Link>
            </div>
        </div>
      </div>
    
  );
};

const mapStateToProps = state => {
  const { user } = state.authentication;

  return { user };
};

const mapDispatchToProps = dispatch => {
  return {dispatch};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BuyerSidebar));
