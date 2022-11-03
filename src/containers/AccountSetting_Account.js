import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Nouislider from 'react-nouislider';
import ReactTags from "react-tag-autocomplete";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Collapse} from 'react-bootstrap'
import $ from "jquery";

import { sellerActions } from '../store/actions';
import { userActions } from '../store/actions';

import AccountSettingSidebar from "../components/Sidebar/AccountSettingSidebar";

import "../res/css/AccountSetting_Account.css"
import "../res/icheck/skins/ltblue.css"
import "../res/css/nouislider.css"
import "../res/css/components/tag.css"
import "../res/css/components/slider.css"
import "../res/css/components/select.css"

class AccountSettingAccount extends React.Component{

  state={
    'headerType': "buyer",
    'account':{
      fullname:"",
      email: "",
      onlinestatus: "Be Online on Login"
    },
    'leave_reason': ''
  }

  constructor(props)
  {
    super(props);
    props.changeHeaderType( this.state.headerType )
    this.state.sellerprofile = props.sellerprofile;
  }

  componentDidMount()
  {
    document.title = "AccountSetting_Account";
  }

  componentWillReceiveProps(nextprops)
  {
    console.log(nextprops);
    if (nextprops.items != undefined) {
      this.setState({account:{...this.state.account,
        ...nextprops.items.info,
        fullname:nextprops.items.info.f_name+" "+nextprops.items.info.l_name}});
    }
  }

  componentWillMount()
  {
    const {dispatch} = this.props;
    dispatch(userActions.getAll());
  }

  onChangeEdit(name,event)
  {
    this.setState({account:{...this.state.account,[name]:event.target.value}});
  }

  changeLeaveReason(e)
  {
    var temp = e.target.value
    console.log('camp status = ', temp, e.target.value);
    this.setState({ leave_reason: e.target.value });  
  }

  onSubmit(event)
  {
    event.preventDefault();
    const {dispatch} = this.props;
    this.state.account.firstName = this.state.account.fullname.split(' ')[0];
    this.state.account.lastName = this.state.account.fullname.split(' ')[1];
    dispatch(userActions.updateUserInfo(this.state.account));  
  }

  render(){
    const {fullname,email,onlinestatus} = this.state.account;
    return (
    	<div className="account_setting">
	    	<div className="page-content account_tab">
				<AccountSettingSidebar navitem={"account"}/>
				<div className="page-result-wrapper">
					<div className="page-result">
            <div className="title">
              Account
              <div className="goto">
                <span className="unneccessary">Want to update your public profile?&nbsp;</span>
                <Link to="/buyer_profile"> Go to My Profile <i className="fa fa-long-arrow-right"></i></Link>
              </div>
            </div>
            <hr/>
            <form className="form" onSubmit={(event)=>{this.onSubmit(event)}}>
              <div className="row">
                <div className="col-sm-3 control-label">
                  Full Name
                </div>
                <div className="col-sm-9">
                  <input className="form-control" value={fullname} onChange={(e)=>this.onChangeEdit("fullname",e)}/>
                  <img className="show-icon" src={require('../res/img/username.png')} alt=""/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 control-label">
                  Email
                </div>
                <div className="col-sm-9">
                  <input type="email" className="form-control" value={email} onChange={(e)=>this.onChangeEdit("email",e)}/>
                  <img className="show-icon" src={require('../res/img/envelope2.png')} alt=""/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 control-label">
                  Online Status
                  <img className="notice" src={require('../res/img/notice-message.png')} alt=""/>
                </div>
                <div className="col-sm-9 material-select">
                  <FormControl>
                    <Select
                      value={'Be Online on Login'}
                      inputProps={{
                        name: 'material',
                        id: 'material-simple',
                      }}
                    >
                      <MenuItem value={'Be Online on Login'}>
                        <img className="select-icon" src={require('../res/img/online.png')}  alt=""/>
                        Be Online on Login
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row action">
                <div className="col-sm-12">
                  <button className="btn btn-blue right">Save</button>
                </div>
              </div>
            </form>
            <hr/>
            <div className="form row">
              <div className="col-sm-3 control-label">
                Deactivate Account
              </div>
              <div className="col-sm-9 text-content">
                <label className="quiz">
                  What is going to happen when you deactivate your account?
                </label>
                <ul>
                  <li>Your profile and Ads won’t show in Dananza anymore</li>
                  <li>All active orders will be cancelled</li>
                  <li>Reactivate your account within 30 days after deactivating. Your account will be deleted after 30 </li>
                </ul>
              </div>
            </div>
            <div className="form row">
              <div className="col-sm-3 control-label">
                Why Do You Have to Say Goodbye?
              </div>
              <div className="col-sm-9 material-select">
                <FormControl>
                  <Select
                    value={this.state.leave_reason}
                    onChange={this.changeLeaveReason.bind(this)}
                    inputProps={{
                      name: 'material',
                      id: 'material-simple',
                    }}
                    placeholder="Choose a reason"
                  >
                    <MenuItem value={'personal'}>
                      Having a personal Problem.
                    </MenuItem>
                    <MenuItem value={'dontlike'}>
                      I don't like.
                    </MenuItem>
                  </Select>
                </FormControl>
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
  	const { items } = state.users;

	return {
		items
	};
};

const mapDispatchToProps = dispatch => {
  return {dispatch};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountSettingAccount));
