import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import "../res/css/help.css"

class Help extends React.Component{

  state={'headerType': "static"}

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "Help & Support"
  }

  changeMode(mode){
      this.refs.customer.style.display = 'none';  
      this.refs.adza.style.display = 'none';
      this.refs[mode].style.display = 'block';
      this.refs.customerbut.classList = ["f-color"];
      this.refs.adzabut.classList = ["f-color"];
      this.refs[mode+"but"].classList = ["f-color active"];
  }

  render(){
    return (
      <div className="help_container">
        <div className="static_container full_container">
            <div className="heroblog-help">
                <div className="hero">
                    <div className="help text-center">
                        <h1 className="info_title color-white">Help & Support</h1>
                    </div>
                    <div className="search-help text-center">
                        <i className="fa fa-search input"></i>
                        <input type="text" placeholder="Search Help Topics"></input>
                    </div>
                </div>
            </div>
            <div className="content full_container">
                <div className="tab-bar text-center">
                    <a className="f-color active" onClick={()=>{this.changeMode('customer');}} ref="customerbut">I'm a Customer</a>
                    <a className="f-color" onClick={()=>{this.changeMode('adza')}} ref="adzabut">I'm an Adza</a>
                </div>
                <div className="content-body">
                    <div className="article container" ref="customer">
                        <div className="info_title">Customer Articles</div>
                        <div className="col-md-4 article-section">
                            <ul>
                                <li className="f-color">Dananza Payment Protection</li>
                                <li className="f-color">Edit Billing Method</li>
                                <li className="f-color">Request a Refund</li>
                                <li className="f-color">Forgot Password or Security Questi...</li>
                            </ul>
                        </div>
                        <div className="col-md-4 article-section">
                            <ul>
                                <li className="f-color">Ad Rejection</li>
                                <li className="f-color">Deactivate Your Account</li>
                                <li className="f-color">Ads Measurement of Success</li>
                                <li className="f-color">Disable Messages</li>
                            </ul>
                        </div>
                        <div className="col-md-4 article-section">
                            <ul>
                                <li className="f-color">Billing</li>
                                <li className="f-color">Manage Your Campaign</li>
                                <li className="f-color">Troubleshoot Messages</li>
                            </ul>
                        </div>
                    </div>
                    <div className="article container" ref="adza">
                        <div className="info_title">Adza Articles</div>
                        <div className="col-md-4 article-section">
                            <ul>
                                <li className="f-color">Dananza Payment Protection</li>
                                <li className="f-color">Edit Billing Method</li>
                                <li className="f-color">Request a Refund</li>
                                <li className="f-color">Forgot Password or Security Questi...</li>
                            </ul>
                        </div>
                        <div className="col-md-4 article-section">
                            <ul>
                                <li className="f-color">Ad Rejection</li>
                                <li className="f-color">Deactivate Your Account</li>
                                <li className="f-color">Ads Measurement of Success</li>
                                <li className="f-color">Disable Messages</li>
                            </ul>
                        </div>
                        <div className="col-md-4 article-section">
                            <ul>
                                <li className="f-color">Billing</li>
                                <li className="f-color">Manage Your Campaign</li>
                                <li className="f-color">Troubleshoot Messages</li>
                            </ul>
                        </div>
                    </div>
                    <div className="article  bg-light">
                        <div className="container">
                            <div className="info_title">Popular Topics</div>
                            <div className="col-md-4 article-section">
                                <div className="sub-title">Getting Started</div>
                                <div className="article-section">
                                    <ul>
                                        <li><i className="fa fa-angle-right"></i>How Dananza Works</li>
                                        <li><i className="fa fa-angle-right"></i>Invite a Friend(Earn $100)</li>
                                        <li><i className="fa fa-angle-right"></i>Creating an Account</li>
                                    </ul>
                                </div>
                                <div className="article-foot">
                                    <a className="f-color">Show All</a>
                                </div>
                            </div>
                            <div className="col-md-4 article-section">
                                <div className="sub-title">Communications</div>
                                <div className="article-section">
                                    <ul>
                                        <li><i className="fa fa-angle-right"></i>Managing Your Campaigns</li>
                                        <li><i className="fa fa-angle-right"></i>Using Notifications</li>
                                        <li><i className="fa fa-angle-right"></i>Using Your Inbox</li>
                                    </ul>
                                </div>
                                <div className="article-foot">
                                    <a className="f-color">Show All</a>
                                </div>
                            </div>
                            <div className="col-md-4 article-section">
                                <div className="sub-title">Placing Orders</div>
                                <div className="article-section">
                                    <ul>
                                        <li><i className="fa fa-angle-right"></i>Finding Medium</li>
                                        <li><i className="fa fa-angle-right"></i>Contacting Adzas</li>
                                        <li><i className="fa fa-angle-right"></i>Requesting Specific Services</li>
                                    </ul>
                                </div>
                                <div className="article-foot">
                                    <a className="f-color">Show All</a>
                                </div>
                            </div>
                            <div className="col-md-4 article-section">
                                <div className="sub-title">Trust & Safety</div>
                                <div className="article-section">
                                    <ul>
                                        <li><i className="fa fa-angle-right"></i>Securing Your Account</li>
                                        <li><i className="fa fa-angle-right"></i>Verifying Your Phone</li>
                                        <li><i className="fa fa-angle-right"></i>Resetting Your Password</li>
                                    </ul>
                                </div>
                                <div className="article-foot">
                                    <a className="f-color">Show All</a>
                                </div>
                            </div>
                            <div className="col-md-4 article-section">
                                <div className="sub-title">Policies</div>
                                <div className="article-section">
                                    <ul>
                                        <li><i className="fa fa-angle-right"></i>Data and Privacy on Dananza</li>
                                        <li><i className="fa fa-angle-right"></i>Order Cancellation</li>
                                        <li><i className="fa fa-angle-right"></i>"For Commercial Use" License...</li>
                                    </ul>
                                </div>
                                <div className="article-foot">
                                    <a className="f-color">Show All</a>
                                </div>
                            </div>
                            <div className="col-md-4 article-section">
                                <div className="sub-title">FAQs</div>
                                <div className="article-section">
                                    <ul>
                                        <li><i className="fa fa-angle-right"></i>Buyer FAQs</li>
                                    </ul>
                                </div>
                                <div className="article-foot">
                                    <a className="f-color">Show All</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center title">Didn't Find What You Were Looking For?</div>
                    <div className="text-center contact-us">
                        <button className="btn btn-mid bg-yellow color-dark">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {

    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help);
