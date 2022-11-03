import { buyerConstants } from '../config';

export function buyer(state={}, action) 
{
	const initialState = 
		{
	      	buyerProfileMSG: "",
		    buyerprofile: {
		        'profile_photo': null,
		        'profile_description': "",
		        'profile_location': "",
	      	},
	      	latest_history:[]
		};

	switch(action.type)
	{
		case buyerConstants.CREATE_BUYPER_PROFILE: 
			return 	{
				create: true,
			};
		case buyerConstants.READ_BUYPER_PROFILE:
			return	{
				...state,
				profile: action.data,
			};
		case buyerConstants.UPDATE_BUYPER_PROFILE:
			return 	{
				...state,
				updated: action.data.message
			};
		case buyerConstants.DELETE_BUYPER_PROFILE:
			return state;
		case buyerConstants.CREAT_CAMPAIGN:
			return {
				...state,
				campaign_created: true
			}
		case buyerConstants.GET_ALL_CAMPAIGN:
			return {
				...state,
				campaigns: action.data
			}
		case buyerConstants.UPDATE_CAMPAIGN: 
			return state;
		case buyerConstants.DELETE_CAMPAIGN:
			return state;
		case buyerConstants.LATEST_CAMPAIGN:
			return {
				...state,
				latest_campaign: action.data
			}
		case buyerConstants.CREAT_NEW_CART:
			return {
				...state,
				current_cart: action.data,
				cleaned: false
			}
		case buyerConstants.ADDLISTTOCART:
			return {
				...state,
				message: action.data
			}	
		case buyerConstants.GET_CURRENT_CART_LISTINGS:
			return {
				...state,
				cartListings: action.data
			}
		case buyerConstants.CANCEL_LISTING_IN_CART:
			return {
				...state,
				cartListings: action.data,
				cancel_listing_msg: "Successfully Cancel Listing from cart"
			}
		case buyerConstants.CLEANCART:
			return {
				...state,
				cleaned: true
			}
		case buyerConstants.FETCH_SAVED_ADZA:
			return {
				...state,
				savedAdza: action.data
			}
		case buyerConstants.SAVE_NEW_ADZA:
			return {
				...state
			}
		case buyerConstants.SET_AS_GUEST:
			return {
				...state,
				guest: true,
			}
		case buyerConstants.ERROR:
			return 	{
				...state,
				error: action.data
			};

		default:
			return state;
	}
}

// export function buyerSavedAdzas(state={}, action) 
// {
// 	switch(action.type)
// 	{
// 		case buyerConstants.FETCH_SAVED_ADZA:
// 			return { adzas: action.adzas };
// 		default:
// 			return state;
// 	}
// }

