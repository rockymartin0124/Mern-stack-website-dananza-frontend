import React from "react";
import classNames from "classnames";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";
import Knob from 'react-canvas-knob';

import "../../res/css/AccountSettingSidebar.css"

const drawerWidth = 240;

const AccountSettingSidebar = props => {
  const { open, classes, navitem } = props;
  return (
        <div className="page-sidebar">
          <div className="section">
            <div className="btn-group" data-toggle="buttons" id="pages">
              <Link to="/account_setting_account">
                <label className={navitem=="account"?"btn btn-default active":"btn btn-default"}>
                  <img src={require('../../res/img/sidebar_user.png')} alt=""/>
                  <input type="radio" className="toggle"/> Account
                </label>
              </Link>
              <Link to="/account_setting_security">
                <label className={navitem=="security"?"btn btn-default active":"btn btn-default"}>
                  <img src={require('../../res/img/sidebar_security.png')} alt=""/>
                  <input type="radio" className="toggle"/> Security
                </label>
              </Link>
              <Link to="/account_setting_billing">
                <label className={navitem=="billing"?"btn btn-default active":"btn btn-default"}>
                  <img src={require('../../res/img/sidebar_billing.png')} alt=""/>
                  <input type="radio" className="toggle"/> Billing
                </label>
              </Link>
          </div>
        </div>
      </div>
  );
};

export default (AccountSettingSidebar);
