import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

import { sellerActions } from '../store/actions';
import { buyerActions } from '../store/actions';
import { alertActions } from '../store/actions';

import 'icheck/skins/all.css';
import {Checkbox, Radio} from 'react-icheck';
import EnhancedSwitch from 'react-icheck/lib/EnhancedSwitch'

import Nouislider from 'react-nouislider';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ReactTags from "react-tag-autocomplete";


import "../res/bootstrap-select/css/bootstrap-select.min.css"
import "../res/css/global.css"
import "../res/css/Dananza_Search.css"
import "../res/icheck/skins/ltblue.css"
import "../res/css/nouislider.css"
import "../res/css/components/tag.css"
import "../res/css/components/slider.css"
import "../res/css/components/select.css"
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;


const styles = theme => ({
  
});

class SearchResults extends React.Component{

	//for guest
	guest_listings = [];
	guest_qty = [];
	cartInfo = {};

  state={
  		'headerType': "buyer",
  		'search_option':{
  			'relevance': 'relevance',
	  		'reach_start': 0,
	  		'reach_end': 100,
	  		'gender_percent' : 0,
	  		'age_start': 0,
	  		'age_end': 60,
	  		'searchText':'',
	  		'startDate': null,
			'locations' : [],
			'interests': [],
			'media_type': [],
			'price_start': 0,
			'price_end': 0,
			'keywords': []
  		},
		suggestions: [
			{ name: "Bananas" },
			{ name: "Mangos" },
			{ name: "Lemons" },
			{ name: "Lemonfffffas" },
			{ name: "Lemonfefes" },
			{ name: "Apricots"}
		],
		allAdlist: [],
		searchResult: [],
		resultcount: 0,
		price_start: '',
		price_end: '',
		page: 1,
		itemPerPage: 3,
		pages: [],
		color: [
			"#eeb0a0",
			"#ff9865",
			"#f3b4b3",
			"#c9aedf",
			"#ffd766",
			"#96dab0",
			"#96b8da",
			"#ea8891",
			"#99cccc"
		]
  };
  first = false;

  constructor(props) {
    super(props);
    props.changeHeaderType( this.state.headerType )

    this.onChangeStartDate = this.onChangeStartDate.bind(this);
  }

  componentDidMount(){
    document.title = "Search Results"

    this.setState({
      startDate: new Date()
    });
  };
  
  componentWillMount()
  {
    const { dispatch } = this.props;
    const { loggedIn } = this.props;

    if(!loggedIn)
    {
    	var guest_cart = JSON.parse(localStorage.getItem('guest'));

    	if(!guest_cart)
    	{
    		localStorage.setItem('guest', JSON.stringify(this.cartInfo));
    	}
    }

	let path = this.props.location.search.split('?');
	if (!path[1]) {
		path[1] = "";
	}
    this.setState({search_option:{...this.state.search_option,searchText:path[1]}});
    this.state.search_option.searchText = path[1];
    
    if (this.props.location.searchOption) {
    	if (this.props.location.searchOption.media_type){
	    	this.state.search_option.media_type.push(this.props.location.searchOption.media_type);
   			this.setState({search_option:{...this.state.search_option,media_type:this.state.search_option.media_type}});
    	}
    	if (this.props.location.searchOption.keyword){
	    	this.state.search_option.locations = this.props.location.searchOption.keyword;
	    	this.state.search_option.interests = this.props.location.searchOption.keyword;
   			this.setState({search_option:{
   				...this.state.search_option,
   				locations:this.state.search_option.locations,
   				interests:this.state.search_option.interests}});
    	}
    }
	this.first = false;
    this.filter();

  	dispatch(sellerActions.getSearchResult());
  }

  componentWillReceiveProps(props)
  {
    let path = props.location.search.split('?');
	if (!path[1]) {
		path[1] = "";
	}
    this.setState({search_option:{...this.state.search_option,searchText:path[1]}});
    
    if (props.location.search != this.props.location.search) {
    	this.state.search_option.searchText = path[1];
    	this.first = false;
    	this.filter();
    }

  	if (props.allAdlist != this.props.allAdlist)
  	{
  		this.setState({allAdlist:props.allAdlist});
  		this.state.allAdlist = props.allAdlist;
  		this.filter();
  	}
  }

	addToCart( _listing ) 
  	{
	  	var currentCart = localStorage.getItem('cart');
	  	var guest = localStorage.getItem('guest');

	  	if(currentCart)
			this.props.dispatch(buyerActions.addListingToCart(this.props.current_cart ? this.props.current_cart.id : currentCart.id, _listing.id, _listing.AdzaProfileId));
		else if(guest)
		{
			var temp = { ...JSON.parse(guest) }

			if(temp.cartInfo && temp.cartInfo.listings)
			{	
				var flag = false;	
				
				//init when refresh
				if(!this.guest_listings.length && !this.guest_qty.length)
				{
					this.guest_listings = [...temp.cartInfo.listings ];
					this.guest_qty = [...temp.qty ];
				}

				//for qty
				for(var i = 0; i < temp.cartInfo.listings.length; i++)
				{
					if(_listing.id == temp.cartInfo.listings[i].id)
					{
						this.guest_qty[i] += 1; 
						flag = true;
						break;
					}
				}

				//adding new listing
				if(!flag)
				{
					this.guest_listings = [...temp.cartInfo.listings, _listing];
					this.guest_qty = [...this.guest_qty, 1];
				}
			}
			else
			{
				this.guest_listings.push(_listing);
				this.guest_qty.push(1);
			}

			// var info = {'cartInfo': {'listings': this.guest_listings}, 'qty': this.guest_qty}
			
            this.props.dispatch(alertActions.success('New Listing Added!'))
			
			localStorage.setItem(
				'guest', JSON.stringify({'cartInfo': {'listings': this.guest_listings}, 'qty': this.guest_qty})
			);

			this.props.history.push('./cart');
		}
  	}

  onChangeRelevance = event => {
  	const {search_option} = this.state;
	this.setState({ search_option: {...search_option, relevance : event.target.value}});
    this.filter();
  };
  
  onReachSlide = (render, handle, value, un, percent) => {

  	const {search_option} = this.state;
	this.setState({ search_option: {...search_option,
								'reach_start':value[0].toFixed(0), 
      							'reach_end':value[1].toFixed(0)}});
    this.filter();
  };
  onAgeSlide = (render, handle, value, un, percent) => {
  	const {search_option} = this.state;
	this.setState({ search_option: {...search_option,
								'age_start':value[0].toFixed(0), 
     							'age_end':value[1].toFixed(0)}});
    this.filter();
  };
  onGenderSlide = (render, handle, value, un, percent) => {
  	const {search_option} = this.state;
	this.setState({ search_option: {...search_option,
								'gender_percent':value[0].toFixed(0)}});
    this.filter();
  };

  onChangeStartDate(date) {
  	const {search_option} = this.state;
  	search_option.startDate = date;
	this.setState({ search_option });
    this.filter();
  };

  onChangePriceStart(event) {
	this.setState({ price_start: parseInt(event.target.value)});
  }

  onChangePriceEnd(event) {
	this.setState({ price_end: parseInt(event.target.value)});
  }

  onMediumType(media) {
  	const {search_option} = this.state;
  	let index = search_option.media_type.indexOf(media);

  	if (index != -1){
  		search_option.media_type.splice(index,1);
  		if (media == 'socialmedia') {
  			search_option.media_type.splice(search_option.media_type.indexOf('facebook'),1);
  			search_option.media_type.splice(search_option.media_type.indexOf('twitter'),1);
  			search_option.media_type.splice(search_option.media_type.indexOf('instagram'),1);
  			search_option.media_type.splice(search_option.media_type.indexOf('linkedin'),1);
  			search_option.media_type.splice(search_option.media_type.indexOf('youtube'),1);
  			search_option.media_type.splice(search_option.media_type.indexOf('pinterest'),1);
  		}
  	}
  	else{
  		search_option.media_type.push(media);
  		if (media == 'socialmedia')
  		{
  			if(search_option.media_type.indexOf('facebook')==-1)
  				search_option.media_type.push('facebook');
  			if(search_option.media_type.indexOf('twitter')==-1)
  				search_option.media_type.push('twitter');
  			if(search_option.media_type.indexOf('instagram')==-1)
  				search_option.media_type.push('instagram');
  			if(search_option.media_type.indexOf('linkedin')==-1)
  				search_option.media_type.push('linkedin');
  			if(search_option.media_type.indexOf('youtube')==-1)
  				search_option.media_type.push('youtube');
  			if(search_option.media_type.indexOf('pinterest')==-1)
  				search_option.media_type.push('pinterest');
  		}
  	}

  	this.setState({search_option});
    this.filter();
  }

  handleInterestsDelete (i) {
    const interests = this.state.search_option.interests.slice(0);
    const {search_option} = this.state;
    interests.splice(i, 1)
    search_option.interests = interests;
	this.setState({ search_option });
    this.filter();
  }
 
  handleInterestsAddition (tag) {
    const interests = [].concat(this.state.search_option.interests, tag)
    const {search_option} = this.state;
    if( interests.length > 5 )
    	return;
    
    if( !this.state.search_option.interests.some(item => tag.name === item.name )){
    	search_option.interests = interests;
		this.setState({ search_option });
    	this.filter();
    }
  }

  handleLocationDelete (i) {
    const locations = this.state.search_option.locations.slice(0);
    const {search_option} = this.state;
    locations.splice(i, 1)
    search_option.locations = locations;
    this.setState({ search_option });
	this.filter();
  }
 
  handleLocationAddition (location) {
    const locations = [].concat(this.state.search_option.locations, location)
    const {search_option} = this.state;
    if( locations.length > 5 )
    	return;
    
    if( !this.state.search_option.locations.some(item => location.name === item.name )){
    	search_option.locations = locations;
    	this.setState({ search_option});
    	this.filter();
    }
  }

  showFollows(number)
  {
  	if (number >= 1000)
  	{
  		var str = "" + Math.floor(number/1000) + 'k';

  		if (number % 1000)
  			str+='+';
  		return str;
  	}
  	return number;
  }

  moveSellerpage(id)
  {
  	const { dispatch } = this.props;
  	dispatch(sellerActions.moveSellerPage(id));
  	this.props.history.push("/seller_page?"+id);
  }

  filterPrice()
  {
  	const {search_option} = this.state;
  	search_option.price_start = this.state.price_start;
  	search_option.price_end = this.state.price_end;
  	this.setState({search_option});
   	this.filter();
  }

  filter()
  {
  	let {relevance, reach_start, reach_end,
	  		gender_percent, age_start, age_end,
	  		searchText,	startDate, locations, interests, media_type, price_start, price_end, keywords} = this.state.search_option;
	let searchResult = [];
	let resultcount = 0;
	let {pages} = this.state;

	for(var item of this.state.allAdlist)
	{
		if(item.Adza_Profile == null)
			continue;
	  	const {audience_age_min,
	  		audience_age_max,
	  		audience_male_percent,
	  		audience_locations,
	  		audience_interests} = item.Adza_Profile;
	  	const {price, title, description} = item;
	  	const {follows, username, linked_channel} = item.Channel;
		var launchDate = new Date(item.insert_date);
	  	let flag = false;

	  	if (item.media_type.search(searchText) == -1
	  		&& title.search(searchText) == -1
	  		&& description.search(searchText) == -1
	  		&& username.search(searchText) == -1
	  		&& linked_channel.search(searchText) == -1)
	  	{
	  		continue;
	  	}
	  	else if (this.first == false) {
	  		resultcount ++;
	  		searchResult.push(item);
	  		continue;
	  	}

	  	if (audience_age_max < age_start || age_end < audience_age_min)
	  		continue;
	  	if (Math.abs(audience_male_percent - gender_percent) > 20)
	  		continue;
	  	if (follows < (reach_start*1000) || follows > (reach_end*1000))
	  		continue;
	  	if ((price < price_start || price > price_end) && price_start && price_end)
	  		continue;

	  	for(var location of locations)
	  	{
	  		if (audience_locations.some(item => location.name === item.name ))
	  		{
	  			flag = true;
	  			break;
	  		}
	  	}
	  	if (flag == false && locations.length || audience_locations == null)
	  		continue;

	  	flag = false;
	  	for(var interest of interests)
	  	{
	  		if (audience_interests.some(item => interest.name === item.name ))
	  		{
	  			flag = true;
	  			break;
	  		}
	  	}
	  	if (flag == false && interests.length || audience_interests == null)
	  		continue;

		if (media_type.length && media_type.indexOf(item.media_type) == -1)
			continue;

		if (startDate > launchDate ) {
			continue;
		}

		resultcount ++;
	  	searchResult.push(item);
	}

	this.first = true;
	pages = [];
	for (var i = 0; i < Math.ceil(resultcount/this.state.itemPerPage) ; i++)
		pages.push(i+1);
	this.setState({searchResult,resultcount,page:1,pages});
  }

 


  render(){
  	const { reach_start, reach_end, interests, locations, media_type } = this.state.search_option;
  	const { age_start, searchText, startDate, age_end, gender_percent, relevance } = this.state.search_option;
  	const { searchResult, resultcount, color, suggestions, price_start, price_end, pages, page, itemPerPage } = this.state;
  	let count = 0;

    return (
    	<div className="search_page full_container">
			<div className="page-navbar">
				<div className="page-navbar-content">
					<div className="btn-grou">
						<label className={"btn btn-default " + (media_type.indexOf('facebook')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"facebook")}>
							Facebook
						</label>
						<label className={"btn btn-default " + (media_type.indexOf('instagram')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"instagram")}>
							Instagram
						</label>
						<label className={"btn btn-default " + (media_type.indexOf('twitter')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"twitter")}>
							Twitter
						</label>
						<label className={"btn btn-default " + (media_type.indexOf('linkedin')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"linkedin")}>
							LinkedIn
						</label>
						<label className={"btn btn-default " + (media_type.indexOf('youtube')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"youtube")}>
							YouTube
						</label>
						<label className={"btn btn-default " + (media_type.indexOf('blogs')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"blogs")}>
							Blog
						</label>
						<label className={"btn btn-default " + (media_type.indexOf('podcasts')!=-1?"active focus":"")}
							  onClick={this.onMediumType.bind(this,"podcasts")}>
							Podcasts
						</label>
					</div>
				</div>
			</div>
			<div className="page-container">
				<div className="page-bar bg-white">
					<div className="sort-by material-select">
						<span className="grey">Sort by:</span>
						<FormControl>
						  <Select
						    value={relevance}
						    onChange={this.onChangeRelevance}
						    inputProps={{
						      name: 'material',
						      id: 'material-simple',
						    }}
						  >
						    <MenuItem value={'relevance'}>Relevance</MenuItem>
						    <MenuItem value={'relevance1'}>Relevance1</MenuItem>
						    <MenuItem value={'relevance2'}>Relevance2</MenuItem>
						    <MenuItem value={'relevance3'}>Relevance3</MenuItem>
						    <MenuItem value={'relevance4'}>Relevance4</MenuItem>
						  </Select>
						</FormControl>
					</div>
				</div>
				<div className="page-content">
					<div className="page-sidebar">
						<div className="section">
							<span className="title"> Medium Type </span>
							<div className="content">
								<ul className="sub-menu">
									<li className="active">
										<div className="nav-link nav-toggle">
											<Checkbox
											  checkboxClass="icheckbox_square-ltblue"
											  increaseArea="20%"
											  label="Social Media"
											  className="icheck"
											  onChange={this.onMediumType.bind(this,"socialmedia")}
											/>
										</div>
										<ul className="sub-menu">
											<li>
												<div className="nav-link">
													<Checkbox
													  checkboxClass="icheckbox_square-ltblue"
													  increaseArea="40%"
													  label="Facebook"
													  className="icheck"
													  checked={media_type.indexOf('facebook')!=-1}
													  onChange={this.onMediumType.bind(this,"facebook")}
													/>
												</div>
											</li>
											<li>
												<div className="nav-link">
													<Checkbox
													  checkboxClass="icheckbox_square-ltblue"
													  increaseArea="40%"
													  label="Instagram"
													  className="icheck"
													  checked={media_type.indexOf('instagram')!=-1}
													  onChange={this.onMediumType.bind(this,"instagram")}
													/>
												</div>
											</li>
											<li>
												<div className="nav-link">
													<Checkbox
													  checkboxClass="icheckbox_square-ltblue"
													  increaseArea="40%"
													  label="Twitter"
													  className="icheck"
													  checked={media_type.indexOf('twitter')!=-1}
													  onChange={this.onMediumType.bind(this,"twitter")}
													/>
												</div>
											</li>
											<li>
												<div className="nav-link">
													<Checkbox
													  checkboxClass="icheckbox_square-ltblue"
													  increaseArea="40%"
													  label="Linkedin"
													  className="icheck"
													  checked={media_type.indexOf('linkedin')!=-1}
													  onChange={this.onMediumType.bind(this,"linkedin")}
													/>
												</div>
											</li>
											<li>
												<div className="nav-link">
													<Checkbox
													  checkboxClass="icheckbox_square-ltblue"
													  increaseArea="40%"
													  label="YouTube"
													  className="icheck"
													  checked={media_type.indexOf('youtube')!=-1}
													  onChange={this.onMediumType.bind(this,"youtube")}
													/>
												</div>
											</li>
											<li>
												<div className="nav-link">
													<Checkbox
													  checkboxClass="icheckbox_square-ltblue"
													  increaseArea="40%"
													  label="Pinterest"
													  className="icheck"
													  checked={media_type.indexOf('pinterest')!=-1}
													  onChange={this.onMediumType.bind(this,"pinterest")}
													/>
												</div>
											</li>
										</ul>
									</li>
									<li>
										<div className="nav-link">
											<Checkbox
											  checkboxClass="icheckbox_square-ltblue"
											  increaseArea="40%"
											  label="Blogs"
											  className="icheck"
											  checked={media_type.indexOf('blogs')!=-1}
											  onChange={this.onMediumType.bind(this,"blogs")}
											/>
										</div>
									</li>
									<li>
										<div className="nav-link">
											<Checkbox
											  checkboxClass="icheckbox_square-ltblue"
											  increaseArea="40%"
											  label="Podcasts"
											  className="icheck"
											  checked={media_type.indexOf('podcasts')!=-1}
											  onChange={this.onMediumType.bind(this,"podcasts")}
											/>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<div className="split"></div>
						<div className="section">
							<span className="title">Audience Features</span>
							<div className="content">
								<div className="features">
									<div className="sub-title"> Interests </div>
									<ReactTags
										placeholder="Type Audience Interests"
										inputAttributes={{ maxLength: 15 }}
										allowNew={true}
									    tags={interests}
									    suggestions={suggestions}
									    handleDelete={this.handleInterestsDelete.bind(this)}
									    handleAddition={this.handleInterestsAddition.bind(this)}
									    classNames = {{root:"outer-tag react-tags"}} />
								</div>
								<div className="features">
									<div className="sub-title"> Location </div>
									<ReactTags
										placeholder="Enter City, State, or Zip Code"
										inputAttributes={{ maxLength: 15 }}
										allowNew={true}
									    tags={locations}
									    handleDelete={this.handleLocationDelete.bind(this)}
									    handleAddition={this.handleLocationAddition.bind(this)}
									    classNames = {{root:"outer-tag react-tags"}}/>
								</div>
								<div className="features">
									<div className="sub-title"> Minimum Reach </div>
									<div className="feature-slider noUi-ltblue" id="reach">

									<Nouislider
									    range={{min: 0, max: 100}}
									    start={[ reach_start, reach_end]}
									    connect
									    onChange={this.onReachSlide}
									  />
		                                <label className="dark-grey">{ reach_start } - { reach_end }k</label>
		                            </div>
								</div>
								<div className="features">
									<div className="sub-title"> Gender </div>
									<div className="feature-slider noUi-ltblue" id="gender">
		                                <Nouislider											
										    range={{min: 0, max: 100}}
										    start={[gender_percent]}
										    onChange={this.onGenderSlide}
										  />
		                                <div className="dark-grey">
		                                	<label>Male</label>
		                                	<label className="right">Female</label>
		                                </div>
		                            </div>
								</div>
								<div className="features">
									<div className="sub-title"> Age Range </div>
									<div className="feature-slider noUi-ltblue" id="age">
										<Nouislider
										    range={{min: 0, max: 60}}
										    start={[age_start, age_end]}
										    connect
										    onChange={this.onAgeSlide}
										  />
		                                <label className="dark-grey"> { age_start } - { age_end }</label>
		                            </div>
								</div>
							</div>
						</div>
						<div className="split"></div>
						<div className="section">
							<span className="title">Price Range</span>
							<div className="content price-range">
								<div className="price-form">
									<div>$</div>
									<input className="danaza-input-small" type="number" min={0} value={price_start}
										onChange={(event)=>{this.onChangePriceStart(event)}}/>
								</div>
								<label>to</label>
								<div className="price-form">
									<div>$</div>
									<input className="danaza-input-small" type="number" min={0} value={price_end}
										onChange={(event)=>{this.onChangePriceEnd(event)}}/>
								</div>
								<button className="btn" onClick={this.filterPrice.bind(this)}>></button>
							</div>
						</div>
						<div className="split"></div>
						<div className="section">
							<span className="title">Ad Launch Date</span>
							<div className="content datetime">
								<DatePicker
									className="btn btn-default"
							        selected={startDate}
							        onChange={this.onChangeStartDate}
							        placeholderText="Select Date/s"
							        dateFormat="YYYY-MM-dd"
							      />
								<img src={require("../res/img/datetime.png")} />
								<div className="bs-caret">
									<i className="caret"></i>
								</div>
							</div>
						</div>
						<div className="split"></div>
						<div className="section">
							<span className="title">Average Rating</span>
							<div className="content average-rating">
								<label>
									<Checkbox
									  checkboxClass="icheckbox_square-ltblue"
									  increaseArea="10%"
									  className="icheck"
									/>
		                            <i className="fa fa-star"></i>
		                            <span>5.0</span>
		                        </label>
		                        <label>
									<Checkbox
									  checkboxClass="icheckbox_square-ltblue"
									  increaseArea="10%"
									  className="icheck"
									/>
		                            <i className="fa fa-star"></i>
		                            <span>4.0</span>
		                        </label>
		                        <label>
									<Checkbox
									  checkboxClass="icheckbox_square-ltblue"
									  increaseArea="10%"
									  className="icheck"
									/>
		                            <i className="fa fa-star"></i>
		                            <span>3.0</span>
		                        </label>
		                        <label>
									<Checkbox
									  checkboxClass="icheckbox_square-ltblue"
									  increaseArea="10%"
									  className="icheck"
									/>
		                            <i className="fa fa-star"></i>
		                            <span>2.0</span>
		                        </label>
		                        <label>
									<Checkbox
									  checkboxClass="icheckbox_square-ltblue"
									  increaseArea="10%"
									  className="icheck"
									/>
		                            <i className="fa fa-star"></i>
		                            <span>1.0</span>
		                        </label>

							</div>
						</div>
					</div>
					<div className="page-result">
						<div className="page-result-header">
							<li> <i className="fa fa-circle"></i> Sponsored </li>
							<div style={{'display': 'inline-flex', float:'right'}}>
								{resultcount?
									((page-1)*itemPerPage+1)+"-"+(page*itemPerPage<resultcount?page*itemPerPage:resultcount)+" of "+resultcount+" result(s) "
								:"No result "}
								{
									searchText==""||searchText==null?"":
									<span>
										&nbsp;for&nbsp;
										<span className="search_keyword color-dark"> "{searchText}" </span>
									</span>
								}
							</div>
						</div>
						<div className="page-result-content row">
							{
								searchResult.map(
									(item,index) =>
									{
										return parseInt(index/itemPerPage)==page-1?
										(
											<div className="col-sm-6 col-md-3">
												<div className="item active">
													<div className="item-header">
														<div className="title">
															<a onClick={this.moveSellerpage.bind(this,item.AdzaProfileId)}>
																{item.Channel.username}
															</a>
														</div>
														<div className="sites">
															{
																item.Adza_Profile.Channels.map(
																	channel =>
																	(
																		<a><img src={require("../res/img/"+channel.media_type+".png")} /></a>
																	)
																)
															}
														</div>
														<div className="keywords">
															{
																item.Adza_Profile.audience_interests.map(
																	interest =>
																	(
																		<a className="btn btn-default btn-type btn-food"
																			style={{'background-color':color[parseInt(Math.random()*10)]}}>
																			{interest.name}
																		</a>
																	)
																)
															}
															<div className="hide-end"></div>
														</div>
													</div>
													<div className="item-image">
														<img src={require("../res/img/item"+(parseInt(Math.random()*10)%5+1)+".png")}/>
													</div>
													<div className="item-footer">
														<div className="reach">
															<i className="fa fa-user"></i>
															<span> {this.showFollows(item.Channel.follows)}</span> 
														</div>
														<div className="rating">
															<i className="fa fa-star"></i>
															<span> 5.0(17)</span> 
														</div>
														<div className="price">
															<span className="small"> Starting at </span>
															<span className="value"> ${item.price} </span>
															<a onClick={ this.addToCart.bind(this, item ) }>+</a>
														</div>
													</div>
												</div>
											</div>
										):"";
									}
								)
							}

							{pages.length>1?(
								<div className="col-sm-12 pagination">
									<a className={"btn btn-default "+(page == 1 ?"disabled":"")}
										onClick={()=>{ this.setState({page:page-1}) }}> {'<'} </a>
									<div className="btn-group" data-toggle="buttons" id="pages">
										{
											pages.map(
												(item,index) =>
												{
													let bef = Math.min(4,page-1),
														aft = Math.min(4,pages.length - page);
													const before = Math.max(bef, 8-aft), after =Math.max(aft, 8-bef);

													if((item < page-before) || (item > page+after))
														return "";
													return (
														<label className={"btn btn-default "+(item == page?"active":"")}
															onClick={()=>{ this.setState({page:item}) }}>
				                                			<input type="radio" className="toggle"/>
				                                			{item}
				                                		</label>
			                                		);
												}
											)
										}
			                        </div>
			                        <a className={"btn btn-default "+(page >= pages.length ?"disabled":"")}
			                        	onClick={()=>{ this.setState({page:page+1}) }}> {'>'} </a>
								</div>
								):""
							}
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
  	const { allAdlist } = state.seller;
  	const { current_cart } = state.buyer;
	return {
		user,
		allAdlist,
		current_cart
	};
};

const mapDispatchToProps = dispatch => {
  return {dispatch};
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchResults));
