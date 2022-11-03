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
import DatePicker from "react-datepicker";
import $ from "jquery";

import { sellerActions } from '../store/actions';
import { userActions } from '../store/actions';

import AccountSettingSidebar from "../components/Sidebar/AccountSettingSidebar";

import 'icheck/skins/all.css';
import {Radio} from 'react-icheck';

import "react-datepicker/dist/react-datepicker.css";
import "../res/css/AccountSetting_Billing.css"
import "../res/icheck/skins/ltblue.css"
import "../res/css/nouislider.css"
import "../res/css/components/tag.css"
import "../res/css/components/slider.css"
import "../res/css/components/select.css"

class AccountSettingBilling extends React.Component{

  state={
    'headerType': "buyer",
    visa: true,
    paypal: false,
    startDate: "",
    'billing':{
      fullname:"",
      businessName: ""
    }
  }

  constructor(props)
  {
    super(props);
    props.changeHeaderType( this.state.headerType )
    this.state.sellerprofile = props.sellerprofile;
  }

  componentDidMount()
  {
    document.title = "AccountSetting_Billing";
  }

  changePayment(index){
    var tmp = {visa:false, paypal:false};
    tmp[index] = true;
    this.setState({...tmp});
  }

  onChangeStartDate(date,event,i) {
    this.setState({
      startDate: date
    });
  };

  componentWillReceiveProps(nextprops)
  {
    console.log(nextprops);
    if (nextprops.items != undefined) {
      this.setState({billing:{...this.state.billing,
        ...nextprops.items.info,
        fullname:nextprops.items.info.f_name+" "+nextprops.items.info.l_name,
        businessName:nextprops.items.info.business_name }});
    }
  }

  componentWillMount()
  {
    const {dispatch} = this.props;
    dispatch(userActions.getAll());
  }

  onChangeEdit(name,event)
  {
    this.setState({billing:{...this.state.billing,[name]:event.target.value}});
  }

  onSubmit()
  {
    const {dispatch} = this.props;
    this.state.billing.firstName = this.state.billing.fullname.split(' ')[0];
    this.state.billing.lastName = this.state.billing.fullname.split(' ')[1];
    dispatch(userActions.updateUserInfo(this.state.billing));  
  }

  render(){
    const {fullname, businessName} = this.state.billing;
    return (
    	<div className="account_setting">
	    	<div className="page-content billing_tab">
				<AccountSettingSidebar navitem={"billing"}/>
				<div className="page-result-wrapper">
					<div className="page-result">
            <div className="title">
              Billing Information
              <div className="goto">
                <span className="unneccessary">The information below will be shown on your invoices</span>
              </div>
            </div>
            <hr/>
            <div className="form">
              <div className="row">
                <div className="col-sm-3 control-label">
                  Company Name
                </div>
                <div className="col-sm-9">
                  <input className="form-control" value={businessName} onChange={(e)=>this.onChangeEdit("businessName",e)}/>
                  <img className="show-icon" src={require('../res/img/briefcase.png')} alt=""/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 control-label">
                  Full Name
                </div>
                <div className="col-sm-9">
                  <input className="form-control" value={fullname} onChange={(e)=>this.onChangeEdit("fullname",e)}/>
                  <img className="show-icon" src={require('../res/img/person.png')} alt=""/>
                </div>
              </div>
            </div>
            <hr/>
            <div className="form">
              <div className="row">
                <div className="col-sm-3 control-label">
                  Country
                </div>
                <div className="col-sm-9 material-select">
                  <FormControl>
                    <Select
                      placeholder="Choose a reason"
                      value="United States"
                      inputProps={{
                        name: 'material',
                        id: 'material-simple'
                      }}
                    >
                      <MenuItem value={'United States'}>
                        United States
                      </MenuItem>
                      <MenuItem value={'United Kingdom'}>
                        United Kingdom
                      </MenuItem>
                      <MenuItem value={'Germany'}>
                        Germany
                      </MenuItem>
                      <MenuItem value={'Australia'}>
                        Australia
                      </MenuItem>
                      <MenuItem value={'Canada'}>
                        Canada
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 control-label">
                  Address
                </div>
                <div className="col-sm-9">
                  <input className="form-control no-padding" value="a11 Argonne Street, Norristown, DE 19403 "/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 control-label">
                  City
                </div>
                <div className="col-sm-9">
                  <input className="form-control no-padding" value="Camden"/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 control-label">
                  Zip Code
                </div>
                <div className="col-sm-9">
                  <input className="form-control no-padding" value="19934"/>
                </div>
              </div>
            </div>
            <div className="modePayment">
              <div className="title">
                Mode of Payment
              </div>
              <hr/>
              <div className="form">
                <div className="visa">
                  <div className="brand row">
                    <div className="col-sm-12">
                      <Radio  
                        label="Debit/Credit Card"
                        labelClassName="radiolabel"
                        value="visa"
                        radioClass="iradio_minimal-red"
                        increaseArea="20%"
                        checked={this.state.visa}
                        onChange={()=>{this.changePayment('visa');}}
                      />
                      <div className="brand-icon">
                        <img src={require("../res/img/visa_brand.png")} />
                        <img src={require("../res/img/mastercard.png")}/>
                        <img src={require("../res/img/amex.png")}/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 control-label">
                      Card Number
                    </div>
                    <div className="col-sm-9">
                      <input className="form-control card-number" value="****************123"/>
                      <img className="show-icon card-brand" src={require("../res/img/visa_brand.png")} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 control-label">
                      Expiration Date
                    </div>
                    <div className="col-sm-9">
                      <DatePicker
                         className="form-control no-padding"
                         selected={this.state.startDate}
                         onChange={(date,event)=>{this.onChangeStartDate(date,event,1)}}
                         placeholderText="MM/YY"
                         dateFormat="MM/YY"
                      />
                    </div>
                  </div>
                  <hr/>
                  <div className="row">
                    <div className="col-sm-3 control-label">
                      Country
                    </div>
                    <div className="col-sm-9 material-select">
                      <FormControl>
                        <Select
                          placeholder="Choose a reason"
                          value="United States"
                          inputProps={{
                            name: 'material',
                            id: 'material-simple'
                          }}
                        >
                          <MenuItem value={'United States'}>
                            United States
                          </MenuItem>
                          <MenuItem value={'United Kingdom'}>
                            United Kingdom
                          </MenuItem>
                          <MenuItem value={'Germany'}>
                            Germany
                          </MenuItem>
                          <MenuItem value={'Australia'}>
                            Australia
                          </MenuItem>
                          <MenuItem value={'Canada'}>
                            Canada
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 control-label">
                      Address
                    </div>
                    <div className="col-sm-9">
                      <input className="form-control no-padding" value="a11 Argonne Street, Norristown, DE 19403 "/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 control-label">
                      City
                    </div>
                    <div className="col-sm-9">
                      <input className="form-control no-padding" value="Camden"/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 control-label">
                      Zip Code
                    </div>
                    <div className="col-sm-9">
                      <input className="form-control no-padding" value="19934"/>
                    </div>
                  </div>
                </div>
                <div className="paypal">
                  <div className="brand">
                    <Radio
                      name="payment_option"
                      value="paypal"
                      radioClass="iradio_minimal-red"
                      increaseArea="20%"
                      checked={this.state.paypal}
                      onChange={()=>{this.changePayment('paypal');}}
                    />
                    <img src={require("../res/img/paypal_brand.png")}/>
                    <div className="brand-icon action">
                      <button className="btn btn-blue right" disabled={!this.state.paypal}>Connect to Paypal</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr/>
            <div className="row action">
              <div className="col-sm-12">
                <button className="btn btn-blue right" onClick={this.onSubmit.bind(this)}>Save</button>
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
)(withRouter(AccountSettingBilling));
