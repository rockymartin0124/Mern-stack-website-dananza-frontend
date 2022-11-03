import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import "../res/css/help.css"

class About extends React.Component{

  state={'headerType': "static"}

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )
  }

  componentDidMount(){
    document.title = "About"
  }

  render(){
    return (
      <div className="help_container">
        <div className="static_container full_container about">
            <div className="heroblog-help">
                <div className="hero">
                    <div className="help text-center">
                        <h1 className="info_title color-white">About Dananza</h1>
                    </div>
                </div>
            </div>
            <div className="content container">
                <div className="content-body">
                    <div className="our_mission info_title text-center">Our Mission</div>
                    <p className="text-center italic">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
                    </p>
                    <div className="our_mission info_title text-center">About Dananza</div>
                    <p className="text-center">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. </p>
                    <p className="text-center">
                        Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae  
                    </p>    
                </div>
                <div className="find_out">
                    <div className="col-md-7 col-sm-7">
                        <div className="info_title color-white">Find the Best Space to Place Your Ad in Dananza</div>
                    </div>
                    <div className="col-md-5 col-sm-5 text-center">
                        <Link to="/cart" className="btn bg-yellow btn-mid color-dark">Start Ad Campaign</Link>
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
)(About);
