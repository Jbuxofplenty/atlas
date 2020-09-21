import { userConstants } from '../constants';

const initialState = {
  isLoginSuccess: false,
  isLoginPending: false,
  loginError: false,
  human: true,
  signUp: false,
  userData: {},
}

export function user(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_RESET:
      return {
        ...state,
        isLoginPending: false,
        userData: {},
        isLoginSuccess: false,
        loginError: false,
      };
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        isLoginPending: action.isLoginPending,
        isLoginSuccess: false,
        loginError: false,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        isLoginSuccess: action.isLoginSuccess,
        userData: action.userData
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loginError: action.loginError,
        isLoginSuccess: false,
        userData: action.userData,
      };
    case userConstants.UPDATE_REQUEST:
      return {
        ...state,
        loggedIn: true,
        userData: action.userData,
      };
    case userConstants.UPDATE_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    case userConstants.UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.userData,
      };
    case userConstants.UPDATE_FAILURE:
      return initialState;
    case userConstants.UPDATE_CAPTCHA:
      return {
        ...state,
        human: action.human,
        signUp: action.signUp
      }
    case userConstants.LOGOUT:
      return initialState;
    default:
      return state
  }
}
