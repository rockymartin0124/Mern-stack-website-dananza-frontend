import { sellerConstants } from '../config';
import { sellerService } from '../services';
import {alertActions} from './';


export const sellerActions = {
    createProfile,
    setProfile,
    getProfile,
    createChannel,
    deleteChannel,
    getChannel,
    createAdlist,
    deleteAdlist,
    updateAdlist,
    getAdlist,
    getAllProfile,
    moveSellerPage,
    moveMySellerPage,
    moveSellerPagePreview,
    getSearchResult,
    getOrderHistory,
    updateOrderHistory,
    addOrderHistory,
    getLatestOrderHistory,
    createOrder,
    getSellerOrders
};

function createProfile(user){
    return dispatch => {
        dispatch(request());

        sellerService.createProfile(user)
            .then(
                sellerprofile => { 
                    dispatch(success(sellerprofile));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    }

    function request() { return { type: sellerConstants.CREATE_SELLER_PROFILE_REQUEST } }
    function success() { return { type: sellerConstants.CREATE_SELLER_PROFILE_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.CREATE_SELLER_PROFILE_FAILURE, error } }
}

function setProfile(sellerprofile) {
    return dispatch => {
        dispatch(request());

        sellerService.setProfile(sellerprofile)
            .then(
                sellerprofile => { 
                    dispatch(getProfile());
                    dispatch(success(sellerprofile));
                    dispatch(alertActions.success('Succeed setting profile!'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Failed setting profile!'));
                }
            );
    }

    function request() { return { type: sellerConstants.SET_SELLER_PROFILE_REQUEST } }
    function success(sellerprofile) { return { type: sellerConstants.SET_SELLER_PROFILE_SUCCESS, sellerprofile }; }
    function failure(error) { return { type: sellerConstants.SET_SELLER_PROFILE_FAILURE, error } }
}

function getProfile() {
    return dispatch => {
        dispatch(request());

        sellerService.getProfile()
            .then(
                seller => {
                    if(seller != "No Result") 
                        dispatch(success(seller));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_SELLER_PROFILE_REQUEST } }
    function success(sellerprofile) { return { type: sellerConstants.GET_SELLER_PROFILE_SUCCESS, sellerprofile }; }
    function failure(error) { return { type: sellerConstants.GET_SELLER_PROFILE_FAILURE, error } }
}

function createChannel(channel) {
    return dispatch => {
        dispatch(request());

        sellerService.createChannel(channel)
            .then(
                channel => {
                    dispatch(success());
                    dispatch(getChannel());
                    dispatch(alertActions.success('Succeed creating channel!'));
                    
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Failed creating channel!'));
                }
            );
    }

    function request() { return { type: sellerConstants.CREATE_SELLER_CHANNEL_REQUEST } }
    function success() { return { type: sellerConstants.CREATE_SELLER_CHANNEL_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.CREATE_SELLER_CHANNEL_FAILURE, error } }
}

function deleteChannel(channelID) {
    return dispatch => {
        dispatch(request());

        sellerService.deleteChannel(channelID)
            .then(
                message => { 
                    dispatch(success());
                    dispatch(getChannel());
                    dispatch(alertActions.success('Succeed deleting channel!'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Failed deleting channel!'));
                }
            );
    }

    function request() { return { type: sellerConstants.DELETE_SELLER_CHANNEL_REQUEST } }
    function success() { return { type: sellerConstants.DELETE_SELLER_CHANNEL_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.DELETE_SELLER_CHANNEL_FAILURE, error } }
}

function getChannel(){
    return dispatch => {
        dispatch(request());

        sellerService.getChannel()
            .then(
                channel => {
                    if(channel.channels != undefined)
                        dispatch(success(channel.channels));
                    else
                        dispatch(success([]));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_SELLER_CHANNEL_REQUEST } }
    function success(channel) { return { type: sellerConstants.GET_SELLER_CHANNEL_SUCCESS, channel }; }
    function failure(error) { return { type: sellerConstants.GET_SELLER_CHANNEL_FAILURE, error } }
}

function createAdlist(adlist) {
    return dispatch => {
        dispatch(request());

        sellerService.createAdlist(adlist)
            .then(
                adlist => { 
                    dispatch(success());
                    dispatch(getAdlist());
                    dispatch(alertActions.success('Succeed creating Ad list!'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Failed creating Ad list!'));
                }
            );
    }

    function request() { return { type: sellerConstants.CREATE_SELLER_ADLIST_REQUEST } }
    function success() { return { type: sellerConstants.CREATE_SELLER_ADLIST_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.CREATE_SELLER_ADLIST_FAILURE, error } }
}

function updateAdlist(adlist) {
    return dispatch => {
        dispatch(request());

        sellerService.updateAdlist(adlist)
            .then(
                adlist => { 
                    dispatch(success());
                    dispatch(getAdlist());
                    dispatch(alertActions.success('Succeed update Ad list!'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Failed update Ad list!'));
                }
            );
    }

    function request() { return { type: sellerConstants.UPDATE_SELLER_ADLIST_REQUEST } }
    function success() { return { type: sellerConstants.UPDATE_SELLER_ADLIST_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.UPDATE_SELLER_ADLIST_FAILURE, error } }
}

function deleteAdlist(id) {
    return dispatch => {
        dispatch(request());

        sellerService.deleteAdlist(id)
            .then(
                adlist => { 
                    dispatch(success());
                    dispatch(getAdlist());
                    dispatch(alertActions.success('Succeed deleting Ad list!'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Failed deleting Ad list!'));
                }
            );
    }

    function request() { return { type: sellerConstants.DELETE_SELLER_ADLIST_REQUEST } }
    function success() { return { type: sellerConstants.DELETE_SELLER_ADLIST_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.DELETE_SELLER_ADLIST_FAILURE, error } }
}

function getAdlist(){
    return dispatch => {
        dispatch(request());

        sellerService.getAdlist()
            .then(
                adList => {
                    if(adList.adlist != undefined) 
                        dispatch(success(adList.adlist));
                    else
                        dispatch(success([]));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_SELLER_ADLIST_REQUEST } }
    function success(adlist) { return { type: sellerConstants.GET_SELLER_ADLIST_SUCCESS, adlist }; }
    function failure(error) { return { type: sellerConstants.GET_SELLER_ADLIST_FAILURE, error } }
}

function getAllProfile(adzaid){
    return dispatch => {
        dispatch(request());

        sellerService.getAllProfile(adzaid)
            .then(
                data => {
                    dispatch(success(data.adzas));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_SELLER_ALL_PROFILE_REQUEST } }
    function success(adzas) { return { type: sellerConstants.GET_SELLER_ALL_PROFILE_SUCCESS, adzas }; }
    function failure(error) { return { type: sellerConstants.GET_SELLER_ALL_PROFILE_FAILURE, error } }
}

function getSearchResult(){
    return dispatch => {
        dispatch(request());

        sellerService.getSearchResult()
            .then(
                adList => {
                    if(adList.length != undefined) 
                        dispatch(success(adList));
                    else
                        dispatch(success([]));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_SELLER_ALL_ADLIST_REQUEST } }
    function success(adlist) { return { type: sellerConstants.GET_SELLER_ALL_ADLIST_SUCCESS, adlist }; }
    function failure(error) { return { type: sellerConstants.GET_SELLER_ALL_ADLIST_FAILURE, error } }
}

function moveMySellerPage(){
    return dispatch => {
        dispatch(request());

        sellerService.getProfile()
            .then(
                seller => {
                    if(seller != "No Result") {
                        dispatch(success(seller.id));
                    }
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.MOVE_MY_SELLER_PAGE_REQUEST } }
    function success(adzaId) { return { type: sellerConstants.MOVE_MY_SELLER_PAGE_SUCCESS, adzaId }; }
    function failure(error) { return { type: sellerConstants.MOVE_MY_SELLER_PAGE_FAILURE, error } }
}

function moveSellerPage(id){
    return dispatch => {
        dispatch({ type: sellerConstants.MOVE_TO_SELLER_PAGE, adzaId: id });
    }
}

function moveSellerPagePreview(sellerprofile){
    return dispatch => {
        dispatch({ type: sellerConstants.MOVE_TO_SELLER_PAGE_PREVIEW, sellerprofile });
    }
}

function createOrder( _listing, mediaupload = false ){
    return dispatch => {
        dispatch(request());

        sellerService.createOrder( _listing )
            .then(
                data => {
                        dispatch(addOrderHistory(data.id,'order', 'accept', null, { listingname:_listing.Listing ? _listing.Listing.title : _listing.title, price: _listing.Listing ? _listing.Listing.price : _listing.price}));
                        if (mediaupload == true) {
                            dispatch(addOrderHistory(data.id,'mediaupload','accept',"uygyugyuguy",{image:"item1"}));
                            dispatch(addOrderHistory(data.id,'orderaccept','pending'));
                        }else{
                            dispatch(addOrderHistory(data.id,'mediaupload','pending'));
                        }
                        dispatch(success(data.Order_History))
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.CREATE_ORDER_REQUEST } }
    function success(Order_History) { return { type: sellerConstants.CREATE_ORDER_SUCCESS, Order_History}; }
    function failure(error) { return { type: sellerConstants.CREATE_ORDER_FAILURE, error } }
}

function getOrderHistory(orderId){
    return dispatch => {
        dispatch(request());

        sellerService.getOrderHistory(orderId)
            .then(
                data => {
                    if(data.order != undefined){
                        data.order.Order_Histories.sort(function(a,b){return (new Date(a.update_time))-(new Date(b.update_time));});
                        dispatch(success(data.order));
                    }
                    else{
                        dispatch(failure());
                    }
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_ORDER_STATE_REQUEST } }
    function success(orderHistory) { return { type: sellerConstants.GET_ORDER_STATE_SUCCESS, orderHistory }; }
    function failure(error) { return { type: sellerConstants.GET_ORDER_STATE_FAILURE, error } }
}

function updateOrderHistory(order){
    return dispatch => {
        dispatch(request());

        sellerService.updateOrderHistory(order)
            .then(
                data => {
                    dispatch(success());
                    dispatch(getOrderHistory(order.OrderId));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.UPDATE_ORDER_STATE_REQUEST } }
    function success() { return { type: sellerConstants.UPDATE_ORDER_STATE_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.UPDATE_ORDER_STATE_FAILURE, error } }
}

function addOrderHistory(orderId,order_type,order_status,order_comment=null,order_attachment={}){
    return dispatch => {
        dispatch(request());

        sellerService.addOrderHistory(orderId,order_status,order_type,order_comment,order_attachment)
            .then(
                data => {
                    dispatch(success());
                    dispatch(getOrderHistory(orderId));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.ADD_ORDER_STATE_REQUEST } }
    function success() { return { type: sellerConstants.ADD_ORDER_STATE_SUCCESS }; }
    function failure(error) { return { type: sellerConstants.ADD_ORDER_STATE_FAILURE, error } }
}


function getLatestOrderHistory( _orderId, index = 0 ){
    return dispatch => {
        dispatch(request());

        sellerService.getLatestOrderHistory( _orderId )
            .then(
                data => {
                    dispatch(success(data.data, index));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.LATEST_HISTORY_ORDER_REQUEST } }
    function success( latest_history, index ) { return { type: sellerConstants.LATEST_HISTORY_SUCCESS, latest_history, camp_index:index }; }
    function failure(error) { return { type: sellerConstants.LATEST_HISTORY_FAILURE, error } }
}

function getSellerOrders(){
    return dispatch => {
        dispatch(request());

        sellerService.getSellerOrders()
            .then(
                data => {
                    dispatch(success(data.data));
                },
                error => {
                    dispatch(failure());
                }
            );
    }

    function request() { return { type: sellerConstants.GET_SELLER_ORDER_REQUEST } }
    function success( orders ) { return { type: sellerConstants.GET_SELLER_ORDER_SUCCESS, orders }; }
    function failure(error) { return { type: sellerConstants.GET_SELLER_ORDER_FAILURE, error } }
}


