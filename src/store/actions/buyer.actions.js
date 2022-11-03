import { buyerConstants } from '../config';
import { buyerService } from '../services';
import { alertActions } from './';

export const buyerActions = {
    createBuyerProfile,
    getBuyerProfile,
    updateBuyerProfile,
    controlAction,
    getAllCampaigns,
    createCampaign,
    getLatestCampaign,
    createNewCart,
    addListingToCart,
    getCurrentCartListings,
    cancelListingInCart,
    cleanCart,
    creatSavedAdza,
    fetchSavedAdza,
    settingGuest,
    delete: _deleteBuyerProfile
};

function createBuyerProfile ( _newBuyer )
{
    return dispatch => {
        buyerService.create_buyer_profile( _newBuyer )
            .then(
                msg => dispatch(controlAction(buyerConstants.CREATE_BUYPER_PROFILE, msg)),
                error => dispatch(controlAction(buyerConstants.ERROR, error))
            );
    };
}

function getBuyerProfile ()
{
    return dispatch => {

        buyerService.read_buyer_profile()
            .then(
                buyer_profile => dispatch(controlAction(buyerConstants.READ_BUYPER_PROFILE, buyer_profile)),
                error => dispatch(controlAction(buyerConstants.ERROR, error))
            )
    };
}

function updateBuyerProfile ( _newData ) 
{
    return  dispatch => {
                buyerService.update_buyer_profile( _newData )
                    .then(
                        msg => {
                            dispatch(getBuyerProfile());
                            dispatch(controlAction(buyerConstants.UPDATE_BUYPER_PROFILE, msg))
                            dispatch(alertActions.success('Successfully Updated!'))
                        },
                        error => {
                            dispatch(controlAction(buyerConstants.ERROR, error))  
                            dispatch(alertActions.error('Failed Update'))
                        }      
                    );
    };
}

function _deleteBuyerProfile() 
{
}

function getAllCampaigns () 
{
    return dispatch => {
        buyerService.get_all_campaigns()
            .then(
                campaigns => dispatch(controlAction(buyerConstants.GET_ALL_CAMPAIGN, campaigns)),
                error => dispatch(controlAction(buyerConstants.ERROR, error))  
            )
    }
}

function createCampaign ( _cartid, _info ) 
{
    return dispatch => {
        buyerService.create_new_campaign( _cartid, _info )
            .then(
                message => dispatch(controlAction(buyerConstants.CREAT_CAMPAIGN), message),
                error => dispatch(controlAction(buyerConstants.ERROR, error))  
            )
    }
}

function  getLatestCampaign () {
    return dispatch => {
        buyerService.get_latest_campaign()
            .then(
                campaign => dispatch(controlAction(buyerConstants.LATEST_CAMPAIGN, campaign)),
                error => dispatch(controlAction(buyerConstants.ERROR, error))
            )
    }
}

function createNewCart()
{
    return dispatch => {
        buyerService.create_new_cart()
            .then(
                cart => dispatch(controlAction(buyerConstants.CREAT_NEW_CART, cart)),
                error => dispatch(controlAction(buyerConstants.ERROR, error)) 
            )
    }
}

function addListingToCart( _current_cart, _newListingId, _sellerId ) 
{
    return dispatch => {
        buyerService.add_list_to_cart( _current_cart, _newListingId, _sellerId )
            .then(
                msg => {
                    dispatch(controlAction(buyerConstants.ADDLISTTOCART, msg))
                    dispatch(alertActions.success(msg.message))
                },
                error => 
                {    
                    dispatch(controlAction(buyerConstants.ERROR, error)) 
                    dispatch(alertActions.error(error.message))
                }
            )
    }
}

function getCurrentCartListings( _cartid ) 
{
    return dispatch => {
        buyerService.get_current_cart_listings( _cartid )
            .then(
                listings => dispatch(controlAction(buyerConstants.GET_CURRENT_CART_LISTINGS, listings)),
                error => dispatch(controlAction(buyerConstants.ERROR, error))
            )
    }
}

function cancelListingInCart( _cartid, _listingId ) {
    return dispatch => {
        buyerService.cancel_listing_in_cart( _cartid, _listingId )
            .then(
                message => 
                { 
                    dispatch(controlAction(buyerConstants.CANCEL_LISTING_IN_CART, message))
                    dispatch(alertActions.success('Successfully Deleted From Cart'))
                },
                error => 
                {
                    dispatch(controlAction(buyerConstants.ERROR, error)) 
                    dispatch(alertActions.error('Cannot Delete From Cart'))
                }
            )
    }
}

function cleanCart( _cartid ) {
    return dispatch => {
        buyerService.clean_cart( _cartid )
            .then(
                clean => 
                { 
                    dispatch(controlAction(buyerConstants.CLEANCART, clean))
                    dispatch(alertActions.success('New Campaign Created!'))
                },
                error => 
                {
                    dispatch(controlAction(buyerConstants.ERROR, error)) 
                    dispatch(alertActions.error('Cannot Delete From Cart'))
                }
            )
    }
}

function creatSavedAdza ( _adzaId ) {
    return dispatch => {
        buyerService.create_saved_adza( _adzaId )
        .then(
            adzas => 
            { 
                dispatch(controlAction(buyerConstants.SAVE_NEW_ADZA, adzas))
                dispatch(alertActions.success('New Adza Saved!'))
            },
            error => 
            {
                dispatch(controlAction(buyerConstants.ERROR, error))
                dispatch(alertActions.error('Already Saved'))
            }
        )
    }
}

function fetchSavedAdza () {
    return dispatch => {
        buyerService.fetch_Saved_Adza()
        .then(
            msg => 
            { 
                dispatch(controlAction(buyerConstants.FETCH_SAVED_ADZA, msg))
                // dispatch(alertActions.success(msg.message))
            },
            error => 
            {
                dispatch(controlAction(buyerConstants.ERROR, error)) 
                // dispatch(alertActions.error('Fail Save New Adza'))
            }
        )
    }
}

function settingGuest ()
{
    return dispatch => {
        dispatch(controlAction(buyerConstants.SET_AS_GUEST))
    }
}


function controlAction( type, data ) 
{
    return {
        type:   type,
                data
    }
}

