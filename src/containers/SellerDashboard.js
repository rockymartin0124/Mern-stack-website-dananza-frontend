import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Nouislider from 'react-nouislider';
import ReactTags from "react-tag-autocomplete";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {Collapse} from 'react-bootstrap'
import ImageUploader from 'react-images-upload';

import $ from "jquery";

import { sellerActions } from '../store/actions';
import { alertActions } from '../store/actions';

import SellerSidebar from "../components/Sidebar/SellerSidebar";

import Avatar from 'react-avatar-edit'
import avatarDefault from '../res/img/default_avatar.png';

import "../res/css/Seller_Dashboard_Sellers_Page.css"
import "../res/icheck/skins/ltblue.css"
import "../res/css/nouislider.css"
import "../res/css/components/tag.css"
import "../res/css/components/slider.css"
import "../res/css/components/select.css"
import { apiConfig } from '../store/config';
const uploadRoot = apiConfig.uploadRoot;

class SellerDashboard extends React.Component{

  state={'headerType': "seller",
  		'suggestions': [
			{ name: "Bananas" },
			{ name: "Mangos" },
			{ name: "Lemons" },
			{ name: "Lemonfffffas" },
			{ name: "Lemonfefes" },
			{ name: "Apricots"}
		],
    sellerprofile: {
      'profile_photo': null,
      'profile_description': "",
      'profile_location': "",
      'image_gallery':[],
      'audience_age_min': 0,
      'audience_age_max': 60,
      'audience_male_percent' : 0,
      'audience_locations' : [],
      'audience_interests' : [],  
    },
    newpreview: null,
    previews:[],
		channels: [],
		new_channel:{},
		adlist: [],
		adlist_edit: [],
		new_adlist:{},
		flag: 0,
    avatarPreview: null,
		avatar_src: null,
		has_adza: false
  }

  constructor(props)
  {
    super(props);
    props.changeHeaderType( this.state.headerType )

    this.onDrop = this.onDrop.bind(this);

    // Avatar
    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
  }

  componentDidMount()
  {
    document.title = "Seller Dashboard";
  }

  onChannelEdit(index,event) {
  	if(event.target.className != "delete-channel")
	  	$("#channeledit_"+index).slideToggle();
  }
  onAdlistEdit(index) {
  	$("#collapse_adlist_"+index).slideToggle();
  }

  componentWillMount()
  {
  	const { dispatch } = this.props;
  	dispatch(sellerActions.getProfile());
  	dispatch(sellerActions.getChannel());
  	dispatch(sellerActions.getAdlist());
  }

  componentWillReceiveProps(props)
  {
  	if (props.sellerprofile != undefined)
  	{
  		this.setState({sellerprofile:{...props.sellerprofile},has_adza: true});
  	}
  	if (props.channel != undefined)
  	{
  		this.setState({channels:props.channel});
  	}
  	if (props.adlist != undefined)
  	{
  		console.log(props.adlist);
  		this.setState({adlist:props.adlist,
  						adlist_edit:(props.adlist.map(item=>({...item}))) });
  	}
  }

  onAgeSlide = (render, handle, value, un, percent) =>
  {
  	const {sellerprofile} = this.state;
    this.setState({
    	sellerprofile:{
			...sellerprofile,
			'audience_age_min':value[0].toFixed(0), 
			'audience_age_max':value[1].toFixed(0)
		}
	});
  }
  
  onGenderSlide = (render, handle, value, un, percent) =>
  {
  	const audience_male_percent = value[0].toFixed(0);
  	const {sellerprofile} = this.state;
    this.setState({
    	sellerprofile:{
    		...sellerprofile,
    		audience_male_percent
    	}
    });
  }

  onChangeProfile = (name,event) =>
  {
	const {sellerprofile} = this.state;
    this.setState({
    	sellerprofile:{
    		...sellerprofile,
    		[name]: event.target.value
    	}
    });
  }

  onCreateNewChannel = () =>
  {
  	var new_channel = {id:-1,media_type:"instagram",follows:0,username:"",linked_channel:""};
  		
  	this.setState({new_channel});
  	$(".new-channel").slideDown();
  }

  onChangeNewChannel = (name,event) =>
  {
	var new_channel = {...this.state.new_channel};
  	
  	new_channel[name] = event.target.value;
  	this.setState({new_channel});
  }

  onSaveNewChannel = () =>
  {
  	const { dispatch } = this.props;

  	dispatch(sellerActions.createChannel(this.state.new_channel));

  	$(".new-channel").slideUp();
  }

  onDeleteChannel = (index) =>
  {
  	const { dispatch } = this.props;
  	const r = window.confirm("Do you want to remove this channel really? Ad lists belonged in this channel will be removed too.");
  	if (!r) {
  		return;
  	}
  	for( var item of this.state.adlist ) {
  		if (item.ChannelId === this.state.channels[index].id) {
  			dispatch(sellerActions.deleteAdlist(item.id));
  		}
  	}
  	
  	dispatch(sellerActions.deleteChannel(this.state.channels[index].id));

  }

  onCreateNewAdlist = () =>
  {
  	var new_adlist = {ChannelId:-1,title:"", media_type:"", featured_photo:"", price:"", description:""};
  	
  	if (this.state.channels.length)
  	{
  		new_adlist.ChannelId = this.state.channels[0].id;
  		new_adlist.media_type = this.state.channels[0].media_type;
  	}
  	
  	this.setState({new_adlist});
  	$(".new-adlist").slideDown();
  }

  onChangeNewAdlist = (name,event) =>
  {
	var new_adlist = {...this.state.new_adlist};
  	if (name == "ChannelId")
  		this.state.channels.some(item => (event.target.value === item.id ? (new_adlist.media_type = item.media_type) : false) );

  	new_adlist[name] = event.target.value;
  	this.setState({new_adlist});
  }

  onSaveNewAdlist = () =>
  {
  	const { dispatch } = this.props;

  	dispatch(sellerActions.createAdlist(this.state.new_adlist));

  	$(".new-adlist").slideUp();
  }

  onChangeAdlist = (name,index,event) =>
  {
	var adlist_edit = this.state.adlist_edit.slice(0);

  	if (name == "ChannelId")
  		this.state.channels.some(item => (event.target.value === item.id ? (adlist_edit[index].media_type = item.media_type) : false));

	  adlist_edit[index][name] = event.target.value;
    this.setState({adlist_edit});
  };

  onSaveAdlist = (index) =>
  {
  	const { dispatch } = this.props;

  	var adlist = {...this.state.adlist[index],...this.state.adlist_edit[index]};
  	dispatch(sellerActions.updateAdlist(adlist));

  	$("#collapse_adlist_"+index).slideToggle();
  }

  onDeleteAdlist = (index) =>
  {
  	const { dispatch } = this.props;
  	
  	const r = window.confirm("Do you want to remove this Ad list really?");
  	if (!r) {
  		return;
  	}
  	
  	dispatch(sellerActions.deleteAdlist(this.state.adlist[index].id));
  }

  handleLocationDelete (i)
  {
    const {sellerprofile} = this.state;
    const audience_locations = sellerprofile.audience_locations.slice(0);
    audience_locations.splice(i, 1)
    this.setState({
    	sellerprofile:{
    		...sellerprofile,
    		audience_locations
    	}
    });
  }
 
  handleLocationAddition (location)
  {
    const {sellerprofile} = this.state;
    const audience_locations = [].concat(sellerprofile.audience_locations, location)

    if( audience_locations.length > 5 )
    	return;
    
    if( !sellerprofile.audience_locations.some(item => location.name === item.name ))
    {
    	this.setState({
	    	sellerprofile:{
	    		...sellerprofile,
	    		audience_locations
	    	}
	    });
    }
  }

  handleInterestsDelete (i)
  {
    const {sellerprofile} = this.state;
    const audience_interests = sellerprofile.audience_interests.slice(0)
  
    audience_interests.splice(i, 1)
  
    this.setState({
    	sellerprofile:{
    		...sellerprofile,
    		audience_interests
    	}
    });
  }
 
  handleInterestsAddition (interest)
  {
    const {sellerprofile} = this.state;
    const audience_interests = [].concat(sellerprofile.audience_interests, interest)
    
    if( !sellerprofile.audience_interests.some(item => interest.name === item.name ))
    {
    	this.setState({
	    	sellerprofile:{
	    		...sellerprofile,
	    		audience_interests
	    	}
	    });
    }
  }

  handleSubmit ()
  {
  	const { sellerprofile, channels, adlist } = this.state;
  	const { dispatch } = this.props;

    if(this.state.avatarPreview != null)
      sellerprofile.profile_photo = this.state.avatarPreview;
  	dispatch(sellerActions.setProfile(sellerprofile));
  }

  handlePreview()
  {
    if (this.state.sellerprofile.id == undefined) {
      window.alert("You have no profile.");
    } else {
      const { dispatch } = this.props;
      dispatch(sellerActions.moveSellerPagePreview(this.state.sellerprofile));
      this.props.history.push("/seller_page/"+this.state.sellerprofile.id);
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

  onDrop(picture) {
    const image_gallery = picture;
  	const {sellerprofile} = this.state;
    this.setState({
    	sellerprofile:{
    		...sellerprofile,
    		image_gallery
    	}
    });
  }

  // Avatar
  onClose() {
    this.setState({avatarPreview: null})
  }
  
  onCrop(avatarPreview) {
    this.setState({avatarPreview})
  }
 
  onBeforeFileLoad(elem) {
    if(elem.target.files[0].size > 131072){
      this.props.dispatch(alertActions.error("Oops! Max image size is 128k."));
      elem.target.value = "";
    };
  }

  onError(e){
    e.target.src = avatarDefault;
  }

  onChangeNewImage(e){
    var file = e.target.files[0];
    var reader = new FileReader();
    var self = this;
    let {new_adlist} = this.state;

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        self.setState({newpreview: e.target.result});
    };

    // read the image file as a data URL.
    if(file){
      reader.readAsDataURL(file);
      new_adlist.featured_photo_name = file.name;
    }
    else{
      self.setState({newpreview: null});
      new_adlist.featured_photo_name = "";
    }

    new_adlist.featured_photo = file;
    this.setState({new_adlist});
  }

  onCancelNewImage(){
    let {new_adlist} = this.state;
    new_adlist.featured_photo = null;
    new_adlist.featured_photo_name = "";
    this.setState({new_adlist, newpreview: null});
  }

  onChangeExistingImage(e,index){
    var file = e.target.files[0];
    var reader = new FileReader();
    var self = this;
    let {adlist_edit} = this.state;
    let previews = this.state.previews.splice(0);

    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        previews[index] = e.target.result;
        self.setState({previews});
    };

    // read the image file as a data URL.
    if(file){
      reader.readAsDataURL(file);
      adlist_edit[index].featured_photo_name = file.name;
    }
    else{
      previews[index] = null;
      self.setState({previews});
      adlist_edit[index].featured_photo_name = "";
    }

    adlist_edit[index].featured_photo = file;
    this.setState({adlist_edit});
  }

  onCancelExistingImage(index){
    let {adlist_edit} = this.state;
    let previews = this.state.previews.splice(0);
    adlist_edit[index].featured_photo = null;
    adlist_edit[index].featured_photo_name = "";
    previews[index] = null;
    this.setState({adlist_edit, previews});
  }

  render(){
  	const { audience_age_min, audience_age_max, audience_male_percent, 
  			audience_locations, audience_interests,image_gallery,
  			profile_photo, profile_description, profile_location } = this.state.sellerprofile;

    const { suggestions,mediaType, channel, channels, adlist, adlist_edit, new_adlist, new_channel, has_adza } = this.state;

  	const uploader_button = <div className="input-icon"><i className="fa fa-file-image-o"></i><span>Drag files to upload or select files from your library</span></div>

  	let preview_image;
    let {newpreview,previews} = this.state;

    preview_image = <img className="profile" src={uploadRoot+"/adza_avatar/"+this.state.sellerprofile.UserId+".png?"+new Date()} onError={this.onError}/>;

  	if ( this.state.avatarPreview ) {
      	preview_image =  <img src={this.state.avatarPreview} alt="avatarPreview" />
    } 

    return (
    	<div className="dashboard_seller">
	    	<div className="page-content sellers_page">
				<SellerSidebar navitem={"sellers_page"}/>
				<div className="page-result-wrapper">
					<div className="page-result">
						<label className="title">Edit Your Profile Page</label>						
						<label className="subtitle">Seller’s Description</label>

						<div className="control-list">
							<div className="formcontrol row">
								<label className="col-sm-2 controllabel"> Profile photo</label>
								<div className="col-sm-10 controlcontent">
									<div className="avatar_preview">
			                          { preview_image }
			                        </div>
			                        <Avatar
                                ref="avatar"
			                          width={390}
			                          height={295}
			                          onCrop={this.onCrop}
			                          onClose={this.onClose}
			                          onBeforeFileLoad={this.onBeforeFileLoad}
			                          src={this.state.avatar_src}
                                mimeTypes={'image/jpeg,image/png,image/bmp'}
			                        />
								</div>
							</div>
							<div className="formcontrol row">
								<label className="col-sm-2 controllabel">
									Describe Your Company (140 characters)
								</label>
								<div className="col-sm-10 controlcontent">
									<textarea value={profile_description} onChange={(event)=>{this.onChangeProfile("profile_description",event)}}
										className="form-control btn-radius" placeholder="Official Account of Target Tree Miami"></textarea>
								</div>
							</div>
							<div className="formcontrol row">
								<label className="col-sm-2 controllabel">
									Location
								</label>
								<div className="col-sm-10 controlcontent">
									<div className="input-icon">
					                    <img src={require('../res/img/minami.png')}/>
					                    <input value={profile_location} onChange={(event)=>{this.onChangeProfile("profile_location",event)}}
					                    	type="text" className="form-control btn-radius"/>
					                </div>
								</div>
							</div>
							<div className="formcontrol row">
								<label className="col-sm-2 controllabel">
									Gallery
								</label>
								<div className="col-sm-10 controlcontent block">
					                <ImageUploader
						                withIcon={false}
						                withLabel={false}
						                buttonText= {uploader_button}
						                onChange={this.onDrop}
						                imgExtension={['.jpg', '.gif', '.png', '.gif']}
						                maxFileSize={5242880}
						                withPreview={true}
						            />
								</div>
							</div>
							<div className="formcontrol row">
								<label className="col-sm-2 controllabel">
									Audience Description
								</label>
								<div className="col-sm-10 controlcontent block">
									<div className="sub-control"><b>Age Range</b></div>
									<div className="feature-slider noUi-ltblue">

										<Nouislider
										    range={{min: 0, max: 60}}
										    start={[audience_age_min, audience_age_max]}
										    connect
										    onSlide={this.onAgeSlide}
										/>

                    <label className="age-result">
                      { audience_age_min } - { audience_age_max }yrs Old
                    </label>
			            </div>

			            <div className="sub-control"><b>Gender Distribution</b></div>
									<div className="feature-slider" id="gender">
										<label className="col-sm-1 no-padding-left">
											Male
											<div id="male">{audience_male_percent}%</div>
										</label>
										<div id="seller_page_gender" className="col-sm-10">
											<Nouislider											
											    range={{min: 0, max: 100}}
											    start={[audience_male_percent]}
											    connect
											    onSlide={this.onGenderSlide}
											/>
										</div>

			                            <label className="col-sm-1">
			                            	Female
			                            	<div id="female">{100-audience_male_percent}%</div>
			                        	</label>
			                        </div>

			                        <div className="sub-control"><b>Location</b></div>
									<div className="col-sm-12 no-padding-left">
										<div className="input-icon">
						                    <img src={require('../res/img/minami.png')}/>
						                    <ReactTags
												placeholder=""
												inputAttributes={{ maxLength: 15}}
												allowNew={true}
												addOnBlur={true}
												autofocus={false}
											    tags={audience_locations}
											    suggestions={suggestions}
											    handleDelete={this.handleLocationDelete.bind(this)}
											    handleAddition={this.handleLocationAddition.bind(this)}
											    classNames = {{root:"inner-tag react-tags"}} />
						                </div>
									</div>

			                        <div className="sub-control"><b>audience_interests</b></div>
									<div className="col-sm-12 no-padding-left">
										<div className="input-icon">
											<img src={require("../res/img/pencil.png")}/>
						                    <ReactTags
												placeholder=""
												inputAttributes={{ maxLength: 15}}
												allowNew={true}
												addOnBlur={true}
												autofocus={false}
											    tags={audience_interests}
											    suggestions={suggestions}
											    handleDelete={this.handleInterestsDelete.bind(this)}
											    handleAddition={this.handleInterestsAddition.bind(this)}
											    classNames = {{root:"outer-tag react-tags"}} />
						                </div>
									</div>
								</div>
							</div>
						</div>
						{
							has_adza == true ? (
								<label className="subtitle">
									Edit Channels
									<a className="add-channel" onClick={this.onCreateNewChannel.bind(this)}>+ Add Another Channel</a>
								</label>
							) : ""
						}
						<div className="channel-list">
							<div className="dropdown-edit collapse new-channel">
								<label>Media Type</label>
								<div className="material-select media-type">
									<FormControl>
									  <Select
									    value={new_channel.media_type}
									    onChange={(event)=>{this.onChangeNewChannel("media_type",event)}}
									    inputProps={{
									      name: 'material',
									      id: 'material-simple',
									    }}
									  >
									    <MenuItem value={'instagram'}>
									    	<img src={require('../res/img/instagram_sq.png')} />
									    	instagram
									    </MenuItem>
									    <MenuItem value={'facebook'}>
									   		<img src={require('../res/img/facebook_sq.png')} />
									    	facebook
									    </MenuItem>
									    <MenuItem value={'twitter'}>
									    	<img src={require('../res/img/twitter_sq.png')} />
									    	twitter
									    </MenuItem>
                      <MenuItem value={'youtube'}>
                        <img src={require('../res/img/youtube_sq.png')} />
                        youtube
                      </MenuItem>
									  </Select>
									</FormControl>
								</div>
								<label>User Name</label>
								<div>
									<input type="text" className="form-control radius-formcontrol"
										onChange={(event)=>{this.onChangeNewChannel("username",event)}} value={new_channel.username}/>
									<i className="fa fa-user control-icon"></i>
								</div>
								<label>Link to Channel</label>
								<div>
									<input type="text" className="form-control radius-formcontrol"
										onChange={(event)=>{this.onChangeNewChannel("linked_channel",event)}} value={new_channel.linked_channel}/>
									<img className="control-icon" src={require("../res/img/link.png")}/>
								</div>
								<label># of Followers</label>
								<div>
									<input type="text" className="form-control radius-formcontrol"
										onChange={(event)=>{this.onChangeNewChannel("follows",event)}} value={new_channel.follows}/>
									<img className="control-icon" src={require("../res/img/followers.png")}/>
								</div>
								<div className="action">
									<button className="btn btn-outline btn-radius btn-cancel" onClick={()=>{$(".new-channel").slideUp()}}>
										<i className="fa fa-long-arrow-left"></i>
										Cancel
									</button>
									<button className="btn btn-outline btn-radius btn-save" onClick={this.onSaveNewChannel.bind(this)}>
										<i className="fa fa-check"></i>
										Save
									</button>
								</div>
							</div>
							{
								channels.map(
									(item,index)=>(
										<div className="channel">
											<div className="channel-show" onClick={(event)=>{this.onChannelEdit(index,event)}}>
												<span className="channel-edit">
													<img className="icon" src={require("../res/img/"+item.media_type+"_sq.png")}/>
													<b>{item.username}</b>
													<i className="fa fa-user"></i>
													<b>{this.showFollows(item.follows)}</b>
												</span>
												<div className="toolbox">
													<a onClick={this.onDeleteChannel.bind(this,index)}>
														<img className="delete-channel" src={require("../res/img/delete.png")}/>
													</a>
												</div>
											</div>
											<div className="dropdown-edit collapse" id={"channeledit_"+index}>
												<label>Media Type</label>
												<div>
													<input type="text" className="form-control radius-formcontrol" value={item.media_type} readOnly/>
											    	<img className="control-icon" src={require("../res/img/"+item.media_type+"_sq.png")} />
												</div>
												<label>User Name</label>
												<div>
													<input type="text" className="form-control radius-formcontrol" value={item.username} readOnly/>
													<i className="fa fa-user control-icon"></i>
												</div>
												<label>Link to Channel</label>
												<div>
													<input type="text" className="form-control radius-formcontrol" value={item.linked_channel} readOnly/>
													<img className="control-icon" src={require("../res/img/link.png")}/>
												</div>
												<label># of Followers</label>
												<div>
													<input type="text" className="form-control radius-formcontrol" value={item.follows} readOnly/>
													<img className="control-icon" src={require("../res/img/followers.png")}/>
												</div>
											</div>
										</div>
									)
								)
							}
						</div>
						{
							(has_adza == true && channels.length) ? (
								<label className="subtitle">
									Ad Listings
									<a className="add-channel" onClick={this.onCreateNewAdlist.bind(this)}>+ Add Another Listing</a>
								</label>
							) : ""
						}
						<div className="ad_listings">
							<div className="dropdown-edit packed collapse new-adlist">
								<label>Choose Channel</label>
								<div className="material-select media-type">
									<FormControl>
									  <Select
									    value={new_adlist.ChannelId}
									    onChange={(event)=>{this.onChangeNewAdlist("ChannelId",event)}}
									    inputProps={{
									      name: 'material',
									      id: 'material-simple',
									    }}
									  >
									  	{
									  		channels.map(
									  			(chn) => (
									  				<MenuItem value={chn.id}>
												    	<img src={require('../res/img/'+chn.media_type+'_sq.png')} />
												    	{chn.media_type}
												    </MenuItem>
									  			)
									  		)
									  	}
									  </Select>
									</FormControl>
								</div>
								<label>Listing Title</label>
								<div>
									<input type="text" className="form-control radius-formcontrol"
										value={new_adlist.title} onChange={(event)=>{this.onChangeNewAdlist("title",event)}}/>
									<img className="control-icon" src={require("../res/img/pencil.png")} alt=""/>
								</div>
								<label>Price</label>
								<div>
									<input type="text" className="form-control radius-formcontrol"
										value={new_adlist.price} onChange={(event)=>{this.onChangeNewAdlist("price",event)}}/>
									<img className="control-icon" src={require("../res/img/dollar.png")} alt=""/>
								</div>
								<label>Featured Photo ( 833 px X 1167 px )</label>
								<div>
									<input type="text" className="form-control radius-formcontrol" placeholder="Click to set featured photo..." value={new_adlist.featured_photo_name}/>
                  <input type="file" onChange={this.onChangeNewImage.bind(this)}/>
                  <img className="control-icon" src={require("../res/img/followers.png")} alt=""/>
                  <a className={"fa fa-remove close-but " + (newpreview?"":"hidden")} onClick={this.onCancelNewImage.bind(this)}></a>
                  <div className={"wrapper " + (newpreview?"":"hidden")}>
                    <img className="preview" src={newpreview?newpreview:""} alt=""/>
                  </div>
								</div>
								<label>Details (300 characters)</label>
								<div>
									<textarea className="form-control radius-formcontrol detail-textarea" maxLength="300" 
										value={new_adlist.description} onChange={(event)=>{this.onChangeNewAdlist("description",event)}}/>
									<i className="fa fa-commenting-o control-icon"></i>
								</div>
								<div className="action">
									<button className="btn btn-outline btn-radius btn-cancel" onClick={()=>{$(".new-adlist").slideUp()}}>
										<i className="fa fa-long-arrow-left"></i>
										Cancel
									</button>
									<button className="btn btn-outline btn-radius btn-save" onClick={this.onSaveNewAdlist.bind(this)}>
										<i className="fa fa-check"></i>
										Save
									</button>
								</div>
							</div>
							{
								adlist.map(
									(item,index)=>(
										<div className="ad-list">
											<div className="ad-list-show">
												<div className="ad_list_head">
													<img className="icon" src={require("../res/img/"+item.media_type+"_sq.png")}/>
													<div className="ad_title">{item.title}</div>
													<div className="ad_value">${item.price}</div>
													<div className="ad_toolbox">
														<a onClick={this.onAdlistEdit.bind(this,index)} className="edit-adlist">
															<img src={require("../res/img/pencil.png")}/>
														</a>
														<a onClick={this.onDeleteAdlist.bind(this,index)}>
															<img src={require("../res/img/delete.png")}/>
														</a>
													</div>
												</div>
												<div className="ad_list_content">
                          <div className="image">
													  <img src={uploadRoot+"/adlist_image/"+item.id+".png?"+new Date()} alt="Missing image"/>
                          </div>
													<div className="description">
														{item.description}
													</div>
												</div>
											</div>
											<div className="dropdown-edit packed collapse" id={"collapse_adlist_"+index}>
												<label>Choose Channel</label>
												<div className="material-select media-type">
													<FormControl>
													  <Select
													    value={adlist_edit[index].ChannelId}
													    onChange={(event)=>{this.onChangeAdlist("ChannelId",index,event)}}
													    inputProps={{
													      name: 'material',
													      id: 'material-simple',
													    }}
													  >
													  	{
													  		channels.map(
													  			(chn) => (
													  				<MenuItem value={chn.id}>
																    	<img src={require('../res/img/'+chn.media_type+'_sq.png')} />
																    	{chn.media_type}
																    </MenuItem>
													  			)
													  		)
													  	}
													  </Select>
													</FormControl>
												</div>
												<label>Listing Title</label>
												<div>
													<input type="text" className="form-control radius-formcontrol"
														value={adlist_edit[index].title} onChange={(event)=>{this.onChangeAdlist("title",index,event)}}/>
													<img className="control-icon" src={require("../res/img/pencil.png")}/>
												</div>
												<label>Price</label>
												<div>
													<input type="text" className="form-control radius-formcontrol"
														value={adlist_edit[index].price} onChange={(event)=>{this.onChangeAdlist("price",index,event)}}/>
													<img className="control-icon" src={require("../res/img/dollar.png")}/>
												</div>
												<label>Featured Photo ( 833 px X 1167 px )</label>
												<div>
                          <input type="text" className="form-control radius-formcontrol" placeholder="Click to set featured photo..."
                              value={adlist_edit[index].featured_photo_name?adlist_edit[index].featured_photo_name:adlist[index].featured_photo}/>
                          <input type="file" onChange={(e)=>this.onChangeExistingImage(e,index)}/>
                          <img className="control-icon" src={require("../res/img/followers.png")} alt=""/>
                          <a className={"fa fa-remove close-but " + (previews[index]?"":"hidden")} onClick={this.onCancelExistingImage.bind(this,index)}></a>
                          {
                            previews[index]?
                            <div className="wrapper">
                              <img className="preview" src={previews[index]} alt=""/>
                            </div> :
                            <div className="wrapper">
                              <img src={uploadRoot+"/adlist_image/"+adlist[index].id+".png?"+new Date()} alt="Missing image"/>
                            </div>
                          }
                          
												</div>
												<label>Details (300 characters)</label>
												<div>
													<textarea className="form-control radius-formcontrol detail-textarea" maxLength="300" 
														value={adlist_edit[index].description} onChange={(event)=>{this.onChangeAdlist("description",index,event)}}/>
													<i className="fa fa-commenting-o control-icon"></i>
												</div>
												<div className="action">
													<button className="btn btn-outline btn-radius btn-cancel" onClick={()=>{$("#collapse_adlist_"+index).slideToggle()}}>
														<i className="fa fa-long-arrow-left"></i>
														Cancel
													</button>
													<button className="btn btn-outline btn-radius btn-save" onClick={this.onSaveAdlist.bind(this,index)}>
														<i className="fa fa-check"></i>
														Save
													</button>
												</div>
											</div>
										</div>
									)
								)
							}
						</div>
						<div className="action_group">
							<button className="btn btn-blue left" onClick={this.handlePreview.bind(this)}><img src={require("../res/img/eye_white.png")}/> Preview</button>
							<button className="btn btn-yellow right" onClick={this.handleSubmit.bind(this)}><img src={require("../res/img/check_black.png")}/> Save</button>
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
  	const { sellerProfileMSG, sellerprofile, channel, adlist } = state.seller;

	return {
		user,
		sellerProfileMSG,
		sellerprofile,
		channel,
		adlist
	};
};

const mapDispatchToProps = dispatch => {
  return {dispatch};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SellerDashboard));
