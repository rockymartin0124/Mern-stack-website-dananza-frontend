import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import ReactTags from "react-tag-autocomplete";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { buyerActions } from '../store/actions';
import { alertActions } from '../store/actions';

import BuyerSidebar from "../components/Sidebar/BuyerSidebar";
import 'icheck/skins/all.css';
import {Checkbox, Radio, RadioGroup} from 'react-icheck';

import "../res/icheck/skins/ltblue.css"
import "../res/css/components/tag.css"
import "../res/css/BuyerProfile.css"

import Avatar from 'react-avatar-edit'
import avatarDefault from '../res/img/default_avatar.png';
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class BuyerProfile extends React.Component{

  state = {
            has_seller_acct: false,
            profile_description: '',
            job_type: '',
            locations: [],
            linkedAccounts:{},
            accounts: [],
            updated: {}
          }
          
  constructor(props) {
    super(props);
    props.changeHeaderType("buyer");

    this.props.dispatch(buyerActions.getBuyerProfile());

    // Avatar
    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
  }

  componentWillReceiveProps (nextprops) {

    const { profile } = nextprops;
    if(profile)
    {
      this.setState ({
        ...nextprops.profile,
      });
    }
  }

  handleJobType(e) {
    this.setState({ job_type: e.target.value });
  }

  handleSubmit() {
    const { dispatch } = this.props;

    this.state.profile_photo = null;
    if(this.state.preview != null)
      this.state.profile_photo = this.state.preview;

    this.state.preview = null;
    dispatch(buyerActions.updateBuyerProfile(this.state));
  }

  getDescriptionValue (e) {
    this.setState({ profile_description: e.target.value })
  }
  
  handleLocationDelete (i) {
    const locations = this.state.locations.slice(0)
    locations.splice(i, 1)
    this.setState({ locations })
  }
 
  handleLocationAddition (location) {
    const locations = [].concat(this.state.locations, location)
    if( locations.length > 5 )
      return;
    
    if( !this.state.locations.some(item => location.name === item.name ))
      this.setState({ locations: [...this.state.locations, location]})
  }

  componentDidMount(){
    document.title = "Buyer Profile"
  }

  addAccount(){
    this.setState({
      accounts:[...this.state.accounts,
                {  mediatype:'', linkedaccount:'', websites:'', username:'' } ]
    });
  }

  removeAccount(key){
    var accounts = this.state.accounts.slice(0);
    accounts.splice(key,1);
    this.setState({accounts});
  }

  getValue(index, item, event){
    var accounts = this.state.accounts.slice(0);
    accounts[index][item] = event.target.value;
    this.setState({accounts});
  }

  // Avatar
  onClose() {
    this.setState({preview: null})
  }
  
  onCrop(preview) {
    this.setState({preview})
  }
 
  onBeforeFileLoad(elem) {
    if(elem.target.files[0].size > 131072){
      this.props.dispatch(alertActions.error("Oops! Max image size is 128k."));
      elem.target.value = "";
    };
  }

  handleLinked(e) {
    this.setState({ linkedAccounts: {...this.state.linkedAccounts, [e.target.name]: e.target.value } })
  }

  onError(e){
    e.target.src = avatarDefault;
  }

  render(){
    const { profile, user } = this.props;
    let preview_image = "";

    preview_image =  <img src={uploadRoot+"/buyer_avatar/"+user.user_info.id+".png?"+new Date()} onError={this.onError}/>;
    
    if ( this.state.preview ) {
        preview_image =  <img src={this.state.preview} alt="Preview" />
    } 

    return (
      <div className="buyer_landing buyer_profile">
        <div className="page-container">
           <div className="page-content">
              <BuyerSidebar navitem={"edit_profile"}/>
              <div className="page-main">
                <div className="page-main-header">
                  <span className="headline-first">
                    Edit Your Profile Page
                  </span>
                  <span className="headline-second pull-right">
                    <Link to="/buyer_profile">View Profile Page <i className="fa fa-long-arrow-right"></i></Link>
                  </span>
                </div>
                <hr className="divider-line" />
                <div className="page-main-content pd-bottom row">
                <form role="form" className="form-horizontal">
                  <div className="form-body" ref="formbody">
                    <div className="formcontrol row">
                      <label className="col-md-2 controllabel"> Profile photo</label>
                      <div className="col-md-10 controlcontent">
                        <div className="avatar_preview">
                          { preview_image }
                        </div>
                        <Avatar
                          width={390}
                          height={295}
                          onCrop={this.onCrop}
                          onClose={this.onClose}
                          onBeforeFileLoad={this.onBeforeFileLoad}
                          src={this.state.avatar_src}
                        />
                      </div>
                    </div>
                    <div className="formcontrol row">
                      <label className="col-md-2 controllabel">
                        Describe<br/>
                        Yourself/Your<br/>
                        Company in a few<br/>
                        words
                      </label>
                      <div className="col-md-10 controlcontent">
                        <textarea 
                          className="form-control btn-radius" 
                          placeholder="Hi there!" rows="5" style={{'height':'120px'}} 
                          value={ this.state.profile_description }
                          onChange={ this.getDescriptionValue.bind(this) }
                        >
                        </textarea>
                      </div>
                    </div>
                    <div className="formcontrol row">
                      <label className="col-md-2 controllabel">
                        What do you do?
                      </label>
                      <div className="col-md-10 controlcontent">
                        <div className="mt-radio-list">
                            <RadioGroup className="mt-radio-list" name="radio" 
                                        value={this.state.job_type} 
                                        onChange={ this.handleJobType.bind(this) }>
                                <Radio
                                  value="Business Owner"
                                  radioClass="iradio_minimal-blue"
                                  increaseArea="20%"
                                  label="Business Owner"
                                />
                                <Radio
                                  value="Freelancer"
                                  radioClass="iradio_minimal-blue"
                                  increaseArea="20%"
                                  label="Freelancer"
                                   defaultChecked
                                />
                                <Radio
                                  value="Employee"
                                  radioClass="iradio_minimal-blue"
                                  increaseArea="20%"
                                  label="Employee"
                                />
                                <Radio
                                  value="Agency"
                                  radioClass="iradio_minimal-blue"
                                  increaseArea="20%"
                                  label="Agency"
                                />
                            </RadioGroup>
                        </div>
                      </div>
                    </div>
                    <div className="formcontrol row">
                      <label className="col-md-2 controllabel">
                        
                      </label>
                      <div className="col-md-10 controlcontent">
                        <p>Which industry does the workplace/business belong to?</p>
                      </div>
                    </div>
                    <div className="formcontrol row">
                      <label className="col-md-2 controllabel">
                        
                      </label>
                      <div className="col-md-10 controlcontent">
                        <input type="text" className="form-control btn-radius" 
                               placeholder="ex: Ad Agency"
                               value={ this.state.job_type }/>
                      </div>
                    </div>
                    <div className="formcontrol row">
                      <label className="col-md-2 controllabel">
                        Location
                      </label>
                      <div className="col-md-10 controlcontent">
                        <div className="input-icon">
                          <ReactTags
                            inputAttributes={{ maxLength: 15, class: "form-control btn-radius"}}
                            placeholder="Miami, Florida"
                            allowNew={true}
                            addOnBlur={true}
                            autofocus={false}
                            tags={ this.state.locations ? this.state.locations : ''}
                            suggestions={this.state.suggestions}
                            handleDelete={this.handleLocationDelete.bind(this)}
                            handleAddition={this.handleLocationAddition.bind(this)}
                            classNames = {{root:"inner-tag react-tags"}} />
                            <img src={require("../res/img/minami.png")} className="placeholder-img" alt=""/>
                        </div>
                      </div>
                    </div>
                    <div className="account">
                      <div className="formcontrol row">
                        <label className="col-md-2 controllabel">
                          Linked Accounts
                        </label>
                        <div className="col-md-10 controlcontent">
                          <div className="input-icon">
                            <img src={require("../res/img/play.png")} className="placeholder-img" alt=""/>
                            <input type="text" className="form-control btn-radius" 
                                   placeholder="Choose Media Type"
                                   name="MediaType"
                                   value={ this.state.linkedAccounts ? this.state.linkedAccounts.MediaType : '' }
                                   onChange={ this.handleLinked.bind(this) }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="formcontrol row">
                        <label className="col-md-2 controllabel">
                          
                        </label>
                        <div className="col-md-10 controlcontent">
                          <div className="input-icon">
                            <img src={require("../res/img/username.png")} className="placeholder-img"/>
                            <input type="text" className="form-control btn-radius" 
                                   placeholder="Username"
                                   name="Username"
                                   value={ this.state.linkedAccounts ? this.state.linkedAccounts.Username : '' }
                                   onChange={ this.handleLinked.bind(this) }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="formcontrol row">
                        <label className="col-md-2 controllabel">
                          
                        </label>
                        <div className="col-md-10 controlcontent">
                          <div className="input-icon">
                            <img src={require("../res/img/link.png")} className="placeholder-img" alt=""/>
                            <input  type="text" className="form-control btn-radius" 
                                    placeholder="Linked Account"
                                    name="linkedAcct"
                                    value={ this.state.linkedAccounts ? this.state.linkedAccounts.linkedAcct : '' }
                                    onChange={ this.handleLinked.bind(this) }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="formcontrol row">
                        <label className="col-md-2 controllabel">
                          Websites
                        </label>
                        <div className="col-md-10 controlcontent">
                          <div className="input-icon">
                            <img src={require("../res/img/link.png")} className="placeholder-img" alt=""/>
                            <input type="text" className="form-control btn-radius" 
                                   placeholder="https://itsmichaelaseyra.com"
                                   name="Website"
                                   value={ this.state.linkedAccounts ? this.state.linkedAccounts.Website : '' }
                                   onChange={ this.handleLinked.bind(this) }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div aria-live='polite' aria-relevant='additions removals'>
                    {
                      this.state.accounts.map(
                      (items,index)=>(
                            <div className="account">
                              <div className="formcontrol row">
                                <label className="col-md-2 controllabel">
                                  Linked Accounts{index}
                                </label>
                                <div className="col-md-10 controlcontent">
                                  <div className="input-icon">
                                    <img src={require("../res/img/play.png")} className="placeholder-img" alt=""/>
                                    <input value={this.state.accounts[index].mediatype} onChange={(text)=>{this.getValue(index,'mediatype',text);}} type="text" className="form-control btn-radius" placeholder="Choose Media Type"/>
                                  </div>
                                </div>
                              </div>
                              <div className="formcontrol row">
                                <label className="col-md-2 controllabel">
                                  
                                </label>
                                <div className="col-md-10 controlcontent">
                                  <div className="input-icon">
                                    <img src={require("../res/img/username.png")} className="placeholder-img" alt=""/>
                                    <input value={this.state.accounts[index].username} onChange={(text)=>{this.getValue(index,'username',text);}} type="text" className="form-control btn-radius" placeholder="Username"/>
                                  </div>
                                </div>
                              </div>
                              <div className="formcontrol row">
                                <label className="col-md-2 controllabel">
                                  
                                </label>
                                <div className="col-md-10 controlcontent">
                                  <div className="input-icon">
                                    <img src={require("../res/img/link.png")} className="placeholder-img" alt=""/>
                                    <input value={this.state.accounts[index].linkedaccount} onChange={(text)=>{this.getValue(index,'linkedaccount',text);}} type="text" className="form-control btn-radius" placeholder="Linked Account"/>
                                  </div>
                                </div>
                              </div>
                              <div className="formcontrol row">
                                <label className="col-md-2 controllabel">
                                  Websites
                                </label>
                                <div className="col-md-10 controlcontent">
                                  <div className="input-icon">
                                    <img src={require("../res/img/link.png")} className="placeholder-img" alt=""/>
                                    <input value={this.state.accounts[index].websites} onChange={(text)=>{this.getValue(index,'websites',text);}} type="text" className="form-control btn-radius" placeholder="https://itsmichaelaseyra.com"/>
                                  </div>
                                </div>
                              </div>
                              <div className="formcontrol row">
                                <label className="col-md-2 controllabel">
                                  
                                </label>
                                <div className="col-md-10 controlcontent actions">
                                  <a className="btn dark btn-outline btn-radius btn-cancel"
                                          onClick={this.removeAccount.bind(this,index)}>
                                    Cancel
                                  </a>
                                </div>
                              </div>
                            </div>
                      ))
                    }
                    </div>
                  </div>
                </form>
                <p><a className="add-website" onClick={this.addAccount.bind(this)}>+ Add Another Account</a></p>
              </div>
              <div className="action_group">
                <button className="btn btn-blue left"><img src={require("../res/img/eye_white.png")} alt=""/> Preview</button>
                <button className="btn btn-yellow right" onClick={this.handleSubmit.bind(this)}><img src={require("../res/img/check_black.png")} alt=""/> Save</button>
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
  const { profile, updated } = state.buyer
  return {
    user,
    profile,
    updated
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
)(withRouter(BuyerProfile));
