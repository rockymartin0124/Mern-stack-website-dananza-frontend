import React from "react";
import { Link } from 'react-router-dom';
import Signup from "../Signup";
import Login from "../Login";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import "../../res/css/footer.css"

const Footer = props => {
  const { classes, handleToggleDrawer } = props;
  let searchinput;
  return (
      <div className="footer_section">
        <div className="footer_info">
          <div className="full_container">
            <div className="row">
              <div className="col-md-3 col-sm-3 for_business">
                <div className="footer_info_title">For Business</div>
                <ul>
                  <li>Epsum factorial</li>
                  <li>Deposit quid pro</li>
                  <li>Escorol</li>
                  <li>Tempus</li>
                  <li>Condominium</li>
                  <li>Facile et</li>
                </ul>
              </div>
              <div className="col-md-2 col-sm-2">
                <div className="footer_info_title">For Adzas</div>
                <ul>
                  <li>Epsum factorial</li>
                  <li>Deposit quid pro</li>
                  <li>Escorol</li>
                  <li>Tempus</li>
                  <li>Condominium</li>
                  <li>Facile et</li>
                </ul>
              </div>
              <div className="col-md-2 col-sm-2">
                <div className="footer_info_title">About</div>
                <ul>
                  <li>Company</li>
                  <li>Careers</li>
                  <li><Link to="/blogs">Blog</Link></li>
                  <li><Link to="/help">Help</Link></li>
                  <li>Contact</li>
                </ul>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="footer_info_title">Search for Adzas</div>
                <div className="input-group input-group-lg">
                  <input ref={(node)=>{searchinput = node}} type="text" className="form-control input-lg"/>
                  <i className="fa fa-search"></i>
                    <span className="input-group-btn">
                        <button onClick={function(){props.history.push('/results?'+searchinput.value); searchinput.value="";}} className="btn bg-blue color-white" type="button">Search</button>
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_copyright">
          <div>Copyright © 2018 Dananza - All Rights Reserved.</div>
          <div>Terms & Conditions</div>
          <div>Privacy</div>
          <div className="social_icons">
            <ul>
              <li>
                <a href="#" className="fa fa-facebook"></a>
              </li>
              <li>
                <a href="#" className="fa fa-twitter"></a>
              </li>
              <li>
                <a href="#" className="fa fa-linkedin"></a>
              </li>
              <li>
                <a href="#" className="fa fa-instagram"></a>
              </li>
            </ul>
          </div>
        </div>

        <div id="myModal" className="modal fade modal-custom" role="dialog">
          <Signup />
        </div>
        <div id="login" className="modal fade modal-custom" role="dialog">
          <Login />
        </div>

      </div>
  );
};

const mapStateToProps = state => {
  return {
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
)(withRouter(Footer));
