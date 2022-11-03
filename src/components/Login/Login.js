import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { userActions, buyerActions } from '../../store/actions';
import $ from 'jquery';

import "../../res/bootstrap/css/bootstrap.min.css"
import "../../res/font-awesome/css/font-awesome.min.css"
import "../../res/css/components.min.css"
import "../../res/css/global.css"
import "../../res/css/header.css"
import "../../res/css/header_search.css"
import "../../res/css/layout.min.css"
import "../../res/css/login.min.css";

class Login extends React.Component{
    login = false;
    constructor(props) {
      super(props);
      this.routeChange = this.routeChange.bind(this);

      this.state = {
          email: '',
          password: '',
          submitted: false
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    routeChange()
    {
      this.login = true;
    }

    componentWillReceiveProps(nextprops)
    {
      var current_path = window.location.pathname;

      if (nextprops.profile != undefined && this.login == true && current_path != "/cart" && !nextprops.guest )
      {
        this.login = false;
        if(nextprops.profile.has_seller_acct == true)
          this.props.history.push("/seller_dashboard");
        else
          this.props.history.push("/buyer_landing");
      }
      else if(current_path == "/cart" && !this.redirect && nextprops.guest)
      {
        this.redirect = true;
        this.props.history.push("/cart");
      }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { email, password } = this.state;
        const { dispatch } = this.props;

        if (email && password) {
            dispatch(userActions.login(email, password));
        }
    }

    componentDidUpdate()
    {
      const { loggedIn } = this.props;
      
      if(loggedIn)
      {
        $('.fade').click();
        if(this.state.submitted)
        {
          this.routeChange();
          this.setState({ submitted: false });
        }
      }
    }

    render(){
      const { loggingIn, loggedIn, alert } = this.props;
      const { email, password, submitted } = this.state;
      return (
        <div className="modal-dialog AuthModal">
          <div className="modal-content modal-content-custom">
            <div className="modal-header modal-header-custom">
              <h4 className="modal-title">Sign In</h4>
            </div>
            <div className="modal-body">
              <form name="form" onSubmit={this.handleSubmit}>
                <div className={"form-group col-md-12" + (submitted && !email ? ' has-error' : '')}>
                  <input className="form-control form-control-solid placeholder-no-fix input-custom"
                          type="text" autoComplete="off" placeholder="Email Address" name="email" value={email} onChange={this.handleChange} />
                </div>
                <div className={"form-group col-md-12" + (submitted && !password ? ' has-error' : '')}>
                  <input className="form-control form-control-solid placeholder-no-fix input-custom"
                          type="password" autoComplete="off" placeholder="Password" name="password" value={password} onChange={this.handleChange} />
                </div>
                <div className={"form-group col-md-12" + (!password || !email ? ' has-error' : '')}>
                    <button className="btn bg-yellow full-width btn-small " disabled={!password || !email}>Login</button>
                    <button id="loginBtn" data-dismiss="modal" hidden></button>
                </div>
              </form>
              <div className="footer-line col-md-12">
                <div className="footer-container">
                  <a className="signin pull-left" id="signin" data-toggle="modal" data-target="#myModal" data-dismiss="modal">Forgot password?</a>
                  <a className="signin pull-right" id="signin" data-toggle="modal" data-target="#myModal" data-dismiss="modal">Sign Up</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
};

function mapStateToProps(state) {
    const { loggingIn, loggedIn } = state.authentication;
    const { alert } = state;
    const { profile, guest } = state.buyer;

    return {
        loggingIn,
        loggedIn,
        profile,
        alert,
        guest
    };
}

export default connect(
  mapStateToProps
)(withRouter(Login));