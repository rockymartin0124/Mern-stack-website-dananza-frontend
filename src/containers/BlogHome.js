import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import "../res/css/Blog_Home.css"

class BlogHome extends React.Component{

  state={'headerType': "homepage"}

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "Blog Homepage"
  }

  render(){
    return(
      <div className="blog-dashboard">
        <div className="blog-home page-content">
          <div className="background">
            
          </div>
          <div className="summary">
            <div className="title">
              Let’s build better business
            </div>
            <div className="content">
              Read about the latest trends in advertising, the best ways to maximize your business and even get to know some of the awesome people that make up our site.
            </div>
          </div>
          <div className="search">
            <div className="search-wrapper">
              <div className="icon-edit">
                <input type="text"/>
                <i className="fa fa-search"></i>
              </div>
            </div>
          </div>

          <div className="post-advertise">
            <div className="post-list">
              <div className="post">
                <img src={require("../res/img/item2.png")} alt=""/>
                <div className="title">
                  10 Advertising Trends for 2019
                </div>
                <div className="content">
                  Advertising is always changing and 2019 is no different. Read about the top trends that are sure to shape up the industry and your marketing plan.
                </div>
                <div className="action">
                  <Link to="/blogview">
                    <button className="btn read">
                      Read
                    </button>
                  </Link>
                  <button className="btn save">
                    Save
                  </button>
                </div>
              </div>
              <div className="post">
                <img src={require("../res/img/item2.png")}  alt=""/>
                <div className="title">
                  10 Advertising Trends for 2019
                </div>
                <div className="content">
                  Advertising is always changing and 2019 is no different. Read about the top trends that are sure to shape up the industry and your marketing plan.
                </div>
                <div className="action">
                  <Link to="/blogview">
                    <button className="btn read">
                      Read
                    </button>
                  </Link>
                  <button className="btn save">
                    Save
                  </button>
                </div>
              </div>
              <div className="post">
                <img src={require("../res/img/item2.png")} alt=""/>
                <div className="title">
                  10 Advertising Trends for 2019
                </div>
                <div className="content">
                  Advertising is always changing and 2019 is no different. Read about the top trends that are sure to shape up the industry and your marketing plan.
                </div>
                <div className="action">
                  <Link to="/blogview">
                    <button className="btn read">
                      Read
                    </button>
                  </Link>
                  <button className="btn save">
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div className="post-list">
              <div className="post">
                <img src={require("../res/img/item2.png")} alt=""/>
                <div className="title">
                  10 Advertising Trends for 2019
                </div>
                <div className="content">
                  Advertising is always changing and 2019 is no different. Read about the top trends that are sure to shape up the industry and your marketing plan.
                </div>
                <div className="action">
                  <Link to="/blogview">
                    <button className="btn read">
                      Read
                    </button>
                  </Link>
                  <button className="btn save">
                    Save
                  </button>
                </div>
              </div>
              <div className="post">
                <img src={require("../res/img/item2.png")} alt=""/>
                <div className="title">
                  10 Advertising Trends for 2019
                </div>
                <div className="content">
                  Advertising is always changing and 2019 is no different. Read about the top trends that are sure to shape up the industry and your marketing plan.
                </div>
                <div className="action">
                  <Link to="/blogview">
                    <button className="btn read">
                      Read
                    </button>
                  </Link>
                  <button className="btn save">
                    Save
                  </button>
                </div>
              </div>
              <div className="post">
                <img src={require("../res/img/item2.png")} alt=""/>
                <div className="title">
                  10 Advertising Trends for 2019
                </div>
                <div className="content">
                  Advertising is always changing and 2019 is no different. Read about the top trends that are sure to shape up the industry and your marketing plan.
                </div>
                <div className="action">
                  <Link to="/blogview">
                    <button className="btn read">
                      Read
                    </button>
                  </Link>
                  <button className="btn save">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pagination-wrapper">
            <div className="pagination">
              <a className="btn btn-default hidden" id="prev" hidden> &lt; </a>
              <div className="btn-group" data-toggle="buttons" id="pages">
                  <label className="btn btn-default active">
                      <input type="radio" className="toggle"/> 1 </label>
                  <label className="btn btn-default">
                      <input type="radio" className="toggle"/> 2 </label>
                  <label className="btn btn-default">
                      <input type="radio" className="toggle"/> 3 </label>
                  <label className="btn btn-default">
                      <input type="radio" className="toggle"/> 4 </label>
                  <label className="btn btn-default">
                      <input type="radio" className="toggle"/> 5 </label>
              </div>
              <a className="btn btn-default" id="next"> &gt; </a>
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
)(BlogHome);
