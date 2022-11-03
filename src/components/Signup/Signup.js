import React from "react";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { userActions, messageActions } from '../../store/actions';

import 'icheck/skins/all.css';
import {Checkbox} from 'react-icheck';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import "../../res/bootstrap/css/bootstrap.min.css"
import "../../res/font-awesome/css/font-awesome.min.css"
import "../../res/css/components.min.css"
import "../../res/css/global.css"
import "../../res/css/header.css"
import "../../res/css/header_search.css"
import "../../res/css/layout.min.css"
import "../../res/css/Signup.css"
import "../../res/css/Confirm.css";

import "../../res/css/login.min.css";

class Signup extends React.Component{
    state = 
    {
      "mode": "menu",
      agreed: false
    };
    register = false;
    constructor(props) {
      super(props);

      this.state = {
          user: {
              firstName: '',
              lastName: '',
              businessName: '',
              email: '',
              password: '',
              cfm_password: ''
          },
          submitted: false
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    changeModeEmail(){
      this.setState({mode:"email"});
    }
    changeModeMenu(){
      this.setState({mode:"menu"});
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) 
    {
        event.preventDefault();
  
        this.setState({ submitted: true });
        const { user } = this.state;
        const { dispatch } = this.props;
        if (user.firstName 
            && user.lastName 
            && user.email 
            && user.password 
            && user.businessName 
            && user.password === user.cfm_password 
          ) 
        {
          dispatch(userActions.register(user));
        }
    }

    responseFacebook(response){
      console.log(response);
      const { dispatch } = this.props;
      if( response.error === undefined ){
        var user = {
                firstName: '',
                lastName: '',
                businessName: response.name,
                email: response.email,
                type: 'facebook'
            }
        dispatch(userActions.register(user));
        dispatch(userActions.login(response.email, "", true));
      }
    };

    responseGoogle(response){
      console.log(response);
      const { dispatch } = this.props;

      if( response.profileObj !== undefined ){
        var user = {
              firstName: response.profileObj.givenName,
              lastName: response.profileObj.familyName,
              businessName: response.profileObj.name,
              email: response.profileObj.email,
              type: 'google'
            }
        dispatch(userActions.register(user));
        //dispatch(userActions.login(response.profileObj.email, "", true));
      }
    };

    componentWillReceiveProps(nextprops) {
      const { registered, loggedIn } = nextprops;
      const { user_login, user } = nextprops;

      if(registered && user_login !== undefined )
      {
        if( user_login.type !== undefined )
          this.props.dispatch(userActions.login(user_login.email, "", true));
        else
          this.props.dispatch(userActions.login(user_login.email, user_login.password));
      }

      if ( nextprops.profile != undefined && loggedIn && !this.register)
      {
        this.register = true;
        this.props.dispatch(messageActions.createSocket(user.user_info.id));
      }
    }

    getAgreed(e)
    {  
      this.setState({ agreed: !e.target.checked})
    }

    render(){
      const { registered, alert } = this.props;
      const { user, submitted } = this.state;
      const google_clientID = process.env.REACT_APP_GOOGLE_CLIENTID;
      const facebook_appID = process.env.REACT_APP_FACEBOOK_APPID;

      if(this.state.mode != "email"){
        return (
          <div className="modal-dialog AuthModal">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h4 className="modal-title">Join Dananza</h4>
              </div>
              <div className="modal-body">
                  <div className="facebook-part col-md-12">
                    <button className="facebook position-relative" type="button" data-dismiss="modal">
                        <i className="fa fa-facebook-square facebook-custom"></i>
                        <span>Sign Up with Facebook</span>
                    </button>
                    <FacebookLogin
                    appId={facebook_appID}
                    autoLoad={true}
                    fields="name,email,picture"
                    callback={this.responseFacebook.bind(this)} />
                  </div>
                  <div className="google-part col-md-12">
                    <button className="google position-relative" type="button" data-dismiss="modal">
                      <img src={require("../../res/img/google+.png")} alt=""/>
                      <span>Sign Up with Google</span>
                    </button>
                    <GoogleLogin
                      clientId={google_clientID}
                      buttonText="Login"
                      onSuccess={this.responseGoogle.bind(this)}
                      onFailure={this.responseGoogle.bind(this)}
                      cookiePolicy={'single_host_origin'}
                    />
                  </div>
                <div className="border-line col-md-12">
                  <span className="thin-line col-md-5"></span>
                  <span className="or">or</span>
                  <span className="thin-line col-md-5"></span>
                </div>
                  <div className="email-part col-md-12">
                      <button className="email position-relative" type="button" onClick={()=>{this.changeModeEmail();}}>
                          <i className="fa fa-envelope-o email-custom"></i>
                          <span>Sign Up By Email</span>
                      </button>
                  </div>
                <div className="footer-line col-md-12">
                  <div className="footer-container col-md-12">
                    <span className="label">Already a Member? <a className="signin" id="signin" data-toggle="modal" data-target="#login" data-dismiss="modal"> Sign In</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      else{
        return (
          <div className="modal-dialog email-signup">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h4 className="modal-title">Join Dananza</h4>
              </div>
              <div className="modal-body">
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={"col-md-12" + (submitted && !user.businessName ? ' has-error' : '')}>
                      <input className="form-control" type="text" placeholder="Business Name" name="businessName" value={user.businessName} onChange={this.handleChange}/>
                      <img className="show-icon" src={require('../../res/img/briefcase.png')} alt=""/>
                    </div>

                    <div className={"col-md-6" + (submitted && !user.firstName ? ' has-error' : '')}>
                      <input className="form-control" type="text" placeholder="First Name" name="firstName" value={user.firstName} onChange={this.handleChange}/>
                       <img className="show-icon" src={require('../../res/img/person_grey.png')} alt=""/>
                    </div>
                    <div className={"col-md-6" + (submitted && !user.lastName ? ' has-error' : '')}>
                      <input className="form-control" type="text" placeholder="Last Name" name="lastName" value={user.lastName} onChange={this.handleChange}/>
                      <img className="show-icon" src={require('../../res/img/person_grey.png')} alt=""/>
                    </div>

                    <div className={"col-md-12" + (submitted && !user.email ? ' has-error' : '')}>
                      <input className="form-control" type="email" placeholder="Enter your Email" name="email" value={user.email} onChange={this.handleChange}/>
                      <img className="show-icon" src={require('../../res/img/envelope.png')} alt=""/>
                    </div>

                    <div className={"col-md-6" + (submitted && !user.password ? ' has-error' : '')}>
                      <input className="form-control" type="password" placeholder="Your Password" name="password" value={user.password} onChange={this.handleChange}/>
                      <img className="show-icon" src={require('../../res/img/key.png')} alt=""/>
                    </div>
                    <div className={"col-md-6" + (submitted && !user.cfm_password ? ' has-error' : '')}>
                      <input className="form-control" type="password" placeholder="Confirm Password" name="cfm_password" value={user.cfm_password} onChange={this.handleChange}/>
                      <img className="show-icon" src={require('../../res/img/key.png')} alt=""/>
                    </div>

                    <div className="align-center col-md-12">
                      <button className="form-button" 
                              disabled={   !user.password 
                                        || !user.email 
                                        || !user.firstName 
                                        || !user.lastName 
                                        || !user.businessName 
                                        || user.password != user.cfm_password
                                        || !this.state.agreed
                                      }
                      >
                        Join
                      </button>
                    </div>
                </form>
                <div className="agree">
                  <Checkbox
                    checkboxClass="icheckbox_square-ltblue"
                    increaseArea="20%"
                    label=""
                    className="icheck"
                    onChange={this.getAgreed.bind(this)}
                    checked={this.state.agreed}
                  />
                  <span>
                    By signing up you, agree with Dananza’s&nbsp;
                  </span>
                  <Link>
                    Terms & Conditions
                  </Link>
                </div>
                <div className="footerline">
                  <hr/>
                </div>
                <div className="footer">
                  <a onClick={this.changeModeMenu.bind(this)} style={{'margin': '0 -50px 0 15px', 'float': 'left'}}>
                    <i className="fa fa-arrow-left" ></i>
                    Back
                  </a>
                  Already a Member?&nbsp;
                  <a data-toggle="modal" data-target="#login" data-dismiss="modal">
                    Sign In
                  </a>
                </div>              
              </div>
            </div>
          </div>
        );
      }
    }
};

function mapStateToProps(state) {
    const { registered, loggedIn, user, user_login } = state.authentication;
    const { alert } = state;
    const { profile } = state.buyer;

    return {
        registered,
        loggedIn,
        alert,
        profile,
        user,
        user_login
    };
}

export default connect(
  mapStateToProps
)(withRouter(Signup));