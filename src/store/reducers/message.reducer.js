import { messageConstants } from '../config';

const initState={
	info:[]
}

export function message(state=initState, action) 
{
	switch(action.type)
	{
		case messageConstants.GET_CONTACT:
			return {
				...state,
				info: action.data,
				init_contact: false,
			}
		case messageConstants.CREATE_CONTACT:
			return {
				...state,
				init_contact: true,
			}
		case messageConstants.SEND_MESSAGE:
			return {
				...state,
				send: true
			}
		case messageConstants.GET_MESSAGE:
			return {
				...state,
				messages: action.data.messages
			}
		case messageConstants.ERROR:
			return 	{
				...state,
				error: action.data
			};
		case messageConstants.SUCCESS_SEND_SELLER_MESSAGE:
			var tmp = state.info.splice(0);
	    	var ind;
	    	tmp.some((item,index)=>{
	    		if(item.Buyer_Profile.UserId == action.data.readerId ){
	    			tmp[index].Messages.push(action.data);
	    			return true;
	    		}
	    		return false;
	    	})
	      	return { 
	      		...state,
	      		info: tmp};
		case messageConstants.SUCCESS_SEND_BUYER_MESSAGE:
			var tmp = state.info.splice(0);
	    	var ind;
	    	tmp.some((item,index)=>{
	    		if(item.Adza_Profile.UserId == action.data.readerId ){
	    			tmp[index].Messages.push(action.data);
	    			return true;
	    		}
	    		return false;
	    	})
	      	return { 
	      		...state,
	      		info: tmp};
	    case messageConstants.RECEIVE_SELLER_MESSAGE:
	    	var tmp = state.info.splice(0);
	    	var ind;
	    	tmp.some((item,index)=>{
	    		if(item.Buyer_Profile.UserId == action.data.authorId ){
	    			tmp[index].Messages.push(action.data);
	    			return true;
	    		}
	    		return false;
	    	})
	      	return { 
	      		...state,
	      		info: tmp,
	      		new_seller_msg: true};
	    case messageConstants.RECEIVE_BUYER_MESSAGE:
	    	var tmp = state.info.splice(0);
	    	var ind;
	    	tmp.some((item,index)=>{
	    		if(item.Adza_Profile.UserId == action.data.authorId ){
	    			tmp[index].Messages.push(action.data);
	    			return true;
	    		}
	    		return false;
	    	})
	      	return { 
	      		...state,
	      		info: tmp,
	      		new_seller_msg: true};
	    case messageConstants.READ_SELLER_MESSAGE:
	    	return { 
	      		...state,
	      		new_seller_msg: false }
	    case messageConstants.READ_BUYER_MESSAGE:
	    	return {
	      		...state,
	      		new_buyer_msg: false }
	    case messageConstants.DELETE_CONTACT:
	    	var tmp = state.info.slice(0);
	    	tmp.splice(action.data.index, 1);
	    	return {
	    		...state,
	    		info: tmp
	    	}
		default:
			return state;
	}
}
