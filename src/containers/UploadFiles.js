import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactTags from "react-tag-autocomplete";
import { withRouter } from "react-router-dom";
import { sellerActions } from '../store/actions';

import "../res/css/infoflowPage.css"
import "../res/css/components/tag.css"

class UploadFiles extends React.Component{
  	state = 
  	{
	  	receivers: [
	        { name: "user1" },
	        { name: "user" }
		],
		suggestions: [
			{ name: "Bananas" },
			{ name: "Mangos" },
			{ name: "Lemons" },
			{ name: "Lemonfffffas" },
			{ name: "Lemonfefes" },
			{ name: "Apricots"}
		],
  	};

  	componentDidMount(){
    	document.title = "UploadFiles"
  	}

  	handleReceiversDelete (i) {
	    const receivers = this.state.receivers.slice(0)
	    receivers.splice(i, 1)
	    this.setState({ receivers })
  	}

  	TagComponent(props){
	  	return (
	  		<button type='button' className={ props.classNames.selectedTag } title='Click to remove tag' onClick={props.onDelete}>
	  			<img src={require("../res/img/"+props.tag.name+".png")}/>
			    <span className={ props.classNames.selectedTagName }>{ props.tag.name }</span>
			</button>
	  	);
  	}

  	handleReceiversAddition (receiver) {
	    const receivers = [].concat(this.state.receivers, receiver)
	    
	    if( !this.state.receivers.some(item => receiver.name === item.name ))
    		this.setState({ receivers: [...this.state.receivers, receiver]})
  	}

  	createOrder( _listings, _qty ) {
  		_listings.map(
  			(item, index) => 
  			{
  				if(item.Counts){
					for(var i = 0; i < item.Counts; i++) {
						this.props.dispatch(sellerActions.createOrder( item ));
					}
				}
				else
				{
					for(var i = 0; i < _qty[index]; i++) {
						this.props.dispatch(sellerActions.createOrder( item ));
					}
				}
  			}
		)
	}

  render(){
	if(this.props.location.info)
	{
		var info = this.props.location.info;
		var cartInfo = this.props.location.info.cartInfo;
		var subtotal = this.props.location.info.subTotal;
		var qty = this.props.location.info.qty;
	}
	else
	{
		var localCart = JSON.parse(localStorage.getItem('cart')),
		cartInfo = localCart.cartInfo,
  		subtotal = localCart.subTotal,
  	    qty = localCart.qty,
  		campName = localCart.campName;

		info = { cartInfo: cartInfo, subtotal: subtotal, qty: qty, campName: campName }
	}

    return (
		<div className="infoflowPage">
			<div className="full_container">
				<div className="upload_files">
					<div className="nav_flow row">
						<ul className="">
							<li className="cart actived">
								<Link to="/cart"><span className="step_num">1</span>
								Cart Details
								<i className="fa fa-chevron-right"></i></Link>
							</li>
							<li className="checkout active">
								<Link to="/checkout"><span className="step_num">2</span>
								Checkout
								<i className="fa fa-chevron-right"></i></Link>
							</li>
							<li className="upload">
								<span className="step_num">3</span>
								Uploads Media Ad Files
							</li>
						</ul>
					</div>
					<div className="row">
						<div className="cart_des">Your order has been successfully placed! <br/>Please upload your Ad files to get started.</div>
							<form action="" className="dropzone dropzone-file-area dz-clickable" id="my-dropzone">
						<div className="upload_form">
							<div className="send_msg">
								<span>To:</span>
								<ReactTags
									placeholder=""
									inputAttributes={{ maxLength: 15}}
									allowNew={true}
									addOnBlur={true}
								    tags={this.state.receivers}
								    tagComponent={this.TagComponent}
								    suggestions={this.state.suggestions}
								    handleDelete={this.handleReceiversDelete.bind(this)}
								    handleAddition={this.handleReceiversAddition.bind(this)}
								    classNames = {{root:"inner-tag react-tags"}} />
								<a><i className="fa fa-angle-down"></i></a>
							</div>
							<div className="note_txt"> </div>
							<textarea rows={8} placeholder="Send a Message to your Adza"></textarea>
	                            {/*<p className="sbold">Drop files here or click to upload</p>*/}
	                            <div className="dz-default dz-message"><span></span></div>	                    	
	                            <div className="upload_submit">
		                    		<i className="fa fa-paperclip"></i> Upload Your Files
		                    		<button className="btn bg-blue color-white btn-medium">Upload</button>	                    		
		                    	</div>
						</div>
						<div className="proceed_chk">
							<div className="checkout" onClick={this.createOrder.bind(this, info.cartInfo.listings, info.qty, )}>
								<Link 	
									to =
									{{
										pathname: "/postcheckout",
										info: info
									}} 
									className="btn btn-mid bg-yellow color-dark">Submit</Link>
							</div>
						</div>
	                    	</form>
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
	return {
		dispatch
	}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UploadFiles));
