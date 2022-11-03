import { userConstants } from '../config';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        })
      };
    case userConstants.UPDATE_USERINFO_REQUEST:
    case userConstants.UPDATE_USERINFO_SUCCESS:
    case userConstants.UPDATE_USERINFO_FAILED:
      return state;
    case userConstants.UPDATE_PWD_REQUEST:
    case userConstants.UPDATE_PWD_SUCCESS:
      return {...state,pwd_change:action.result};
    case userConstants.UPDATE_PWD_FAILED:
      return {...state,pwd_change:false};

    case userConstants.UPDATE_QA_REQUEST:
    case userConstants.UPDATE_QA_SUCCESS:
      return {...state,qa_change:action.result};
    case userConstants.UPDATE_QA_FAILED:
      return {...state,qa_change:false};

    default:
      return state
  }
}