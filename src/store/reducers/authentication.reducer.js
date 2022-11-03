import { userConstants } from '../config';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
     case userConstants.REGISTER_REQUEST:
       return {
         registering: true,
         user_login: action.user
       }
     case userConstants.REGISTER_SUCCESS:
       return {
         registered: true,
         user: action.user,
         user_login: state.user_login
       }

    case userConstants.REGISTER_FAILURE:
      return {

      }
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    case userConstants.UPDATE_USER_WITH_LOCALSTORAGE:
      return {...state, user:JSON.parse(localStorage.getItem('user'))};
    case userConstants.USERTYPE:
      return {
        ...state,
        user_type: action.user_type
      };
    default:
      return state
  }
}