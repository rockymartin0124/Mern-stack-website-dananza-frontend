import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { withRouter } from "react-router-dom";
import { buyerActions } from '../store/actions';
import moment from 'moment';

import "../res/css/infoflowPage.css"

class Cart extends React.Component{

  	state = 
  	{
  		headerType: "static",
  		"startDate":[],
  		qty:[],
  		subTotal: 0,
  		campName: 'Campaign',
  		cartInfo: {}
	}

  	constructor(props) {
	    super(props);
	    props.changeHeaderType( this.state.headerType )
 	}	

  	componentWillMount () {
  		var local_cart = JSON.parse(localStorage.getItem('cart'));
  		var guest_cart  = JSON.parse(localStorage.getItem('guest'));

  		if(local_cart)
  		{
  			this.props.dispatch(buyerActions.getCurrentCartListings(local_cart.id));
  		}
  		else if(guest_cart)
  		{
  			
 			var subTotal = 0;

  			this.props.dispatch(buyerActions.settingGuest());

  			guest_cart.cartInfo.listings.map(
  				(item, index) => {
					subTotal += item.price * guest_cart.qty[index]
  				}
  			)
  			this.setState({cartInfo: guest_cart.cartInfo, qty: [...guest_cart.qty], subTotal: subTotal, guest: true});
  		}
  	}

  	componentWillReceiveProps( nextprops ) {

	    var qty = [], subTotal = 0, cartInfo = {};
	    var guest_cart = JSON.parse(localStorage.getItem('guest'));
	    var cart  = JSON.parse(localStorage.getItem('cart'));

		if(nextprops.cartListings) // auth user
		{
			cartInfo = nextprops.cartListings;

			nextprops.cartListings.listings.map(
				(item, index) => {
					qty[index] = item.Counts ? item.Counts : 1;
					subTotal += item.Listing.price * qty[index]
				}
			)

			this.setState({ cartInfo: cartInfo, 
							subTotal: subTotal, 
							qty: [ ...qty ], 
							startDate: [new Date(),new Date()]
						});
		}
		else if(guest_cart)			 //guest
		{
			cartInfo = guest_cart.cartInfo;

  			guest_cart.cartInfo.listings.map(
  				(item, index) => {
					subTotal += item.price * guest_cart.qty[index]
  				}
  			)

  			this.setState({ cartInfo: cartInfo, 
			  				subTotal: subTotal, 
			  				qty: [ ...guest_cart.qty ], 
			  				startDate: [new Date(),new Date()]
			  			});
		}


  	}

  	componentDidMount(){
	    document.title = "Cart"
  	}

  	componentDidUpdate() {
  		if( this.state.cartInfo && this.props.loggedIn ) {
  			var temp = {};
	  		temp = 
		    	{ 
		    		...JSON.parse(localStorage.getItem('cart')), 
		    		qty: this.state.qty, 
		    		subTotal: this.state.subTotal,
		    		cartInfo: this.state.cartInfo, 
		    		campName: this.state.campName
		    	}

		    localStorage.setItem('cart', JSON.stringify(temp));
		}
		else if(this.state.cartInfo && !this.props.loggedIn)
		{
			var temp = {};
	  		temp = 
		    	{ 
		    		...JSON.parse(localStorage.getItem('guest')), 
		    		qty: this.state.qty, 
		    		subTotal: this.state.subTotal,
		    		cartInfo: this.state.cartInfo, 
		    		campName: this.state.campName
		    	}

		    localStorage.setItem('guest', JSON.stringify(temp));
		}

		console.log('this.state = ', this.state);
  	}

	initCart ()
  	{
	    var guest_cart = JSON.parse(localStorage.getItem('guest'));
	    var cart  = JSON.parse(localStorage.getItem('cart'));

	    if(this.props.loggedIn && guest_cart && cart)
	    {
	    	guest_cart.cartInfo.listings.map(
	    		(item, index) => {
	    			this.props.dispatch(buyerActions.addListingToCart(cart.id, item.id, item.AdzaProfileId));
	    		}
	    	)

	    	cart = { ...cart, ...guest_cart}
			localStorage.setItem('cart', JSON.stringify(cart))

			localStorage.removeItem('guest');
	    }
		// this.props.dispatch(buyerActions.getCurrentCartListings(cart.id));
  	}

  	handlesubTotal(){
		var local_cart = JSON.parse(localStorage.getItem('cart'));
  		var guest_cart = JSON.parse(localStorage.getItem('guest'));
  		var temp = 0;
 
  		if(local_cart && local_cart.cartInfo && local_cart.cartInfo.listings[0].Listing)
  		{
			local_cart.cartInfo.listings.map(
				(item, index) => {
					temp += item.Listing.price * this.state.qty[index]
				}
			)	
  		}
  		else
  		{
  			guest_cart.cartInfo.listings.map(
  				(item, index) => {
					temp += item.price * this.state.qty[index]
  				}
  			)
  		}

  		this.setState({ subTotal: temp});
  	}

  	cancelListing( _listingId, _index ) {
  		var localCart = JSON.parse(localStorage.getItem('cart'));
  		var guest_cart = JSON.parse(localStorage.getItem('guest'));
  		if(localCart && localCart.id)
  		{
  			this.props.dispatch(buyerActions.cancelListingInCart( localCart.id, localCart.cartInfo.listings[_index].id));
  		}
  		else 
  		{
  			var temp = 0;
  			guest_cart.cartInfo.listings.splice(_index, 1);
  			guest_cart.qty.splice(_index, 1);

  			guest_cart.cartInfo.listings.map(
  				(item, index) => {
					temp += item.price * this.state.qty[index]
  				}
  			)
  			this.setState({
  				cartInfo: guest_cart.cartInfo,
  				qty: guest_cart.qty,
  				subTotal: temp
  			})
  		}
  	}

  	incQty(index){
	  	var tmp = this.state.qty;
	  	tmp[index] ++;
	  	this.setState({"qty":[...tmp]});
	  	this.handlesubTotal();
  	}

  	decQty(index){
	  	var tmp = this.state.qty;
	  	tmp[index] = tmp[index] > 1 ? tmp[index]-1 : tmp[index];
	  	this.setState({"qty":[...tmp]});
	  	this.handlesubTotal();
  	}

  	handleCampName(e) {
	  	this.setState({
	  		campName: e.target.value
	  	});
  	}

  	onChangeStartDate(date,event,i) {
	    var temp = this.state.startDate.slice(0);
	    temp[i] = date;
	    this.setState({
	      startDate: [...temp]
	    });
  	};

	render(){
	    return (
			<div className="infoflowPage">
				<div className="full_container">
					<div className="cartPart">
						<div className="nav_flow row">
							<ul className="">
								<li className="cart active">
									<span className="step_num">1</span>
									Cart Details
									<i className="fa fa-chevron-right"></i>
								</li>
								<li className="checkout">
									<span className="step_num">2</span>
									Checkout
									<i className="fa fa-chevron-right"></i>
								</li>
								<li className="upload">
									<span className="step_num">3</span>
									Uploads Media Ad Files
								</li>
							</ul>
						</div>
						<div className="row">
							<div className="cart_des">You're a Few Clicks Away from Ad-ing to Your Business</div>
							<div className="table_camp">
								<h3 className="text">
									<input
										className="input_campName" 
										placeholder="Campaign Name"
										autoFocus={ true }
										name="camp_name"
									    onChange={ this.handleCampName.bind(this) }
									/>
									<button><i className="fa fa-pencil"></i></button>
								</h3>
								<table className="table table-striped table-hover">
		                            <thead>
		                                <tr>
		                                    <th> Adza </th>
		                                    <th> Medium </th>
		                                    <th> Schedule Date </th>
		                                    <th> Qty </th>
		                                    <th> Amount </th>
		                                    <th></th>
		                                </tr>
		                            </thead>
		                            <tbody>
	                            	{
										this.state.cartInfo.listings ? this.state.cartInfo.listings.map(
	                            			(item, index) => 
		                            		(
		                            			<tr>
				                                    <td>
				                                    	<img src={require("../res/img/" + (item.Listing ? item.Listing.media_type : item.media_type) + "_sq.png")}/>
				                                    	<Link className="color-dark" to='/seller_page'>{ item.Listing ? item.Listing.Channel.username : item.Channel.username }</Link>
				                                    </td>
				                                    <td> { item.Listing ? item.Listing.media_type : item.media_type } </td>
				                                    <td className="add_date">
				                                    	<DatePicker
			                                              className="btn btn-default"
			                                              selected={moment(item.Listing ? item.Listing.insert_date : item.insert_date, 'DD-MM-YYYY').toDate()}
			                                              onChange={(date,event)=>{this.onChangeStartDate(date,event,0)}}
			                                              placeholderText="Choose Post Date"
			                                              dateFormat="dd/MM/YYYY"
			                                            />
				                                    </td>
				                                    <td className="qty"> 
				                                    	<div className="qty_value">{this.state.qty[index]}</div> 
				                                    	<div className="ctrl_value">
				                                    		<button className="inc_value" onClick={()=>{this.incQty(index)}}>
				                                    			<i className="fa fa-angle-up"></i>
				                                    		</button>
				                                    		<button className="dec_value" onClick={()=>{this.decQty(index)}}>
				                                    			<i className="fa fa-angle-down"></i>
				                                    		</button>
				                                    	</div>
				                                    </td>
				                                    <td> { item.Listing ? item.Listing.price : item.price } </td>
				                                    <td className="del">
				                                    	<button onClick={this.cancelListing.bind(this, item.id, index)}>
				                                    		<i className="fa fa-close"></i>
				                                    	</button>
				                                    </td>
				                                </tr>

	                            			)
	                        			):''
	                            	}			
	                            	{
	                            		this.state.cartInfo.listings ?
	                            		(
			                            	<tr>
			                                    <td> </td>
			                                    <td> </td>
			                                    <td> </td>
			                                    <td className="total"> 
													Subtotal                                    	
			                                    </td>
			                                    <td className="total_value"> { this.state.subTotal }$ </td>
			                                    <td></td>
			                                </tr>
                            			) 
                            			: 
                            			(
			                            	<tr>
			                                    <td> </td>
			                                    <td> </td>
			                                    <td>Please Add Listing to Cart</td>
			                                    <td> </td>
			                                    <td> </td>
			                                    <td> </td>
			                                </tr>
                        				)
	                            	}
		                            </tbody>
		                        </table>
							</div>
							<div className="proceed_chk">
								<div className="note" >
								{
									this.props.loggedIn ? 
									(
										<Link  	onClick={this.initCart.bind(this)} 
												className="btn btn-mid bg-yellow color-dark"
												disabled={!this.state.cartInfo.listings}
												to= {{
													pathname: "/checkout",
													info: this.state
												}}
										>
											Proceed to Checkout
										</Link>
									) 
									:
									(
										<a data-toggle="modal" data-target="#myModal" className="btn btn-mid bg-yellow color-dark">Sign Up</a>	
									)
								}
								</div>
								<div className="note">
									Note: You are not charged until Adza approves your media 
									You will have a chance to upload media for ads after checking out 
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
	const { loggedIn } = state.authentication;
	const { campaigns, cartListings } = state.buyer;
  	
  	return {
  		loggedIn, 
  		campaigns,
  		cartListings
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
)(withRouter(Cart));
