import React from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ReactTags from "react-tag-autocomplete";

import { Carousel } from 'react-responsive-carousel';

import "../res/css/homepage.css"
import "../res/css/Signup.css"
import "../res/css/components/tag.css"

class Home extends React.Component{

  state={
          'headerType': "homepage",
          'advertise' : '',
          'tags'       : [],
          suggestions : [
            { name: "Bananas" },
            { name: "Mangos" },
            { name: "Lemons" },
            { name: "Lemonfffffas" },
            { name: "Lemonfefes" },
            { name: "Apricots"}
          ]
        }

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }
  onChangeAdvertise = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount(){
    document.title = "Homepage"
  }
  handleKeywordDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }
 
  handleKeywordAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    if( tags.length > 5 )
      return;
    
    if( !this.state.tags.some(item => tag.name === item.name ))
      this.setState({ tags: [...this.state.tags, tag]})
  }

  render(){
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
         <div className="homepage_section">
          <div className="full_container">
            <div className="row heroblog">
              <div className="col-md-6 col-sm-6 mk_adv_smp color-title">
                Making Advertising Simple
                <div className="finding_best_ad color-title">Find The Best Space To Place Your Ad</div>
                <div className="finding_ad_select">I want to advertise on
                  <Select
                    value={this.state.advertise}
                    onChange={this.onChangeAdvertise}
                    inputProps={{
                      name: 'advertise',
                      id: 'advertise-list',
                    }}
                  >
                    <MenuItem value={'facebook'}>Facebook</MenuItem>
                    <MenuItem value={'instagram'}>Instagram</MenuItem>
                    <MenuItem value={'youTube'}>YouTube</MenuItem>
                    <MenuItem value={'linkedIn'}>LinkedIn</MenuItem>
                    <MenuItem value={'pinterest'}>Pinterest</MenuItem>
                    <MenuItem value={'blogs'}>Blogs</MenuItem>
                    <MenuItem value={'podcasts'}>Podcasts</MenuItem>
                  </Select>                  
                </div>
                <div className="finding_ad_input">
                  related to
                  <ReactTags
                    placeholder="Type any keyword (maximum of 5 keywords)"
                    inputAttributes={{ maxLength: 15 }}
                    autofocus={false}
                    allowNew={true}
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleKeywordDelete.bind(this)}
                    handleAddition={this.handleKeywordAddition.bind(this)}
                    classNames = {{root:"inner-tag react-tags"}} />
                </div>
                <div className="action">
                  <Link to=
                        {{
                            "pathname" : "/results", 
                            searchOption: 
                            { 
                              media_type: this.state.advertise,
                              keyword: this.state.tags
                            } 
                        }} className="btn bg-yellow color-dark btn-small">Find Adzas</Link>
                </div>
              </div>
              <div className="col-sm-6 col-md-6 pull-right">
                <div className="heroimage">
                  <img src={require("../res/img/heroimage.png")} alt=""/>
                </div>
              </div>
            </div>
            <div className="row what_adza">
              <div className="col-lg-6 col-sm-5">
                <img src={require("../res/img/dza.png")} alt=""/>
              </div>
              <div className="col-lg-6 col-sm-7">
                <div className="info_title">What is an Adza?</div>
                <div className="info_content">An Adza is any entity that sells space for you to place your ad. These include owners of media such as podcasts, websites, social media, events, billboards and lots more. Seeing as the word “seller” didn’t sound right, we call these customer liaisons Adzas instead..</div>
              </div>
            </div>
            <div className="row tell_reach">
              <div className="col-sm-7 col-lg-5 img">
                <img src={require("../res/img/adza_reach.png")} alt=""/>
              </div>
              <div className="col-sm-5 col-lg-7 content">
                <div className="info_title">
                  <span className="you">You</span> Tell Us Who You Want to Reach <span className="we">We</span> Show You Where to Reach Them
                </div>
                <div className="info_content">Dananza is an open marketplace that provides businesses with a simple solution to finding the best ad spaces to reach potential customers. Using filters such as interests, location, gender, and age, users can quickly find Adzas most likely to get them in front of their target audience.</div>
              </div>
            </div>
            <div className="row build_ad bg-light">
              <div className="info_title">
                Build Ad Campaigns
              </div>
              <div className="step">
                <div className="col-sm-2">
                  <img src={require("../res/img/ad_find.png")} alt=""/>
                  <br/>
                  Find The Adzas You Need
                </div>
                <div className="col-sm-1 arrow">
                </div>
                <div className="col-sm-2">
                  <img src={require("../res/img/ad_cart.png")} alt=""/>
                  <br/>
                  Add Packages From Their Page
                </div>
                <div className="col-sm-1 arrow">
                </div>
                <div className="col-sm-2">
                  <img src={require("../res/img/ad_cloud.png")} alt=""/>
                  <br/>
                  Upload Media & Instructions
                </div>
                <div className="col-sm-1 arrow">
                </div>
                <div className="col-sm-2">
                  <img src={require("../res/img/ad_tablet.png")} alt=""/>
                  <br/>
                  Monitor Status of Order
                </div>
              </div>
              <div className="bg_img col-sm-12">
                <img src={require("../res/img/ad_camp.png")} alt=""/>
                <div>
                  <Link to="/cart" className="btn btn-mid bg-yellow color-dark">Start Ad Campaign</Link>
                </div>
              </div>
            </div>
            <div className="row rest">
              <div className="col-sm-12">
                <div className="info_title col-sm-6">
                  Rest Assured Your Advertising Meets Your Needs
                </div>
              </div>
              <div className="col-sm-6 col-md-6 img">
                <img src={require("../res/img/rest_bg.png")} alt=""/>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="info_content">
                  <div className="info_content_title">
                    <i className="fa fa-check-circle"></i>
                    Your Stamp of Approval
                  </div>
                  <div>Your Adza doesn’t get paid until you confirm you’re happy with how they got the word out about your business.</div>
                  <div className="info_content_title">
                    <i className="fa fa-check-circle"></i>
                    Diversify Your Strategy
                  </div>
                  <div>Add multiple packages from different Adzas to your campaign and easily manage media, timeline, and costs.</div>
                  <div className="info_content_title">
                    <i className="fa fa-check-circle"></i>
                    Dananza Has Your Back
                  </div>
                  <div>If anything goes wrong at any step in the process, we’re available 365 days a year to help make it right and ensure that advertising is simple.</div>
                </div>  
              </div>
            </div>
            <div className="row slider">
              <div id="slideshow">
                  <div id="slidesContainer">
                      <Carousel showThumbs={false}>
                        <div>
                          <img src={require("../res/img/test_slider1.png")} className="slide_img" alt=""/>
                          <div className="img_content">
                            <div className="description">
                              “ At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolor es et quas molestias! “
                            </div>
                            <div className="auth">
                              John Doe, Founder
                            </div>
                            <div className="brand">
                              <img src={require("../res/img/mock_data.png")} alt=""/>
                            </div>
                          </div>
                        </div>
                        <div>
                          <img src={require("../res/img/test_slider1.png")} className="slide_img" alt=""/>
                          <div className="img_content">
                            <div className="description">
                              “ At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolor es et quas molestias! “
                            </div>
                            <div className="auth">
                              John Doe, Founder
                            </div>
                            <div className="brand">
                              <img src={require("../res/img/mock_data.png")} alt=""/>
                            </div>
                          </div>
                        </div>
                        <div>
                          <img src={require("../res/img/test_slider1.png")} className="slide_img" alt=""/>
                          <div className="img_content">
                            <div className="description">
                              “ At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolor es et quas molestias! “
                            </div>
                            <div className="auth">
                              John Doe, Founder
                            </div>
                            <div className="brand">
                              <img src={require("../res/img/mock_data.png")} alt=""/>
                            </div>
                          </div>
                        </div>
                      </Carousel>
                  </div>
                </div>
            </div>
            </div>
            <div className="row customer">
              <div className="info_title">Your Customers are Waiting For You</div>
              <div className="customer_link">
                <a href="#" className="btn btn-large creat_act color-white bg-blue" data-toggle="modal" data-target="#myModal">Create Account</a>
                <Link to="/signup" className="btn btn-large become_adza color-dark bg-yellow">Become An Adza</Link>
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
)(Home);
