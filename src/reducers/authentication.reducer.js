import { userConstants } from '../constants';

const initialState = {
  isLoginSuccess: false,
  isLoginPending: false,
  loginError: false,
  human: true,
  signUp: false,
  user: {},
  userData: {},
}

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_RESET:
      return {
        isLoginPending: false,
        user: {},
        userData: {},
        eThree: {},
        isLoginSuccess: false,
        loginError: false,
      };
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        isLoginPending: action.isLoginPending,
        user: action.user,
        isLoginSuccess: false,
        loginError: false,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        isLoginSuccess: action.isLoginSuccess,
        user: action.user,
        userData: action.userData
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loginError: action.loginError,
        isLoginSuccess: false,
        user: action.user,
        userData: action.userData,
        eThree: {},
      };
    case userConstants.UPDATE_REQUEST:
      return {
        ...state,
        loggedIn: true,
        user: action.user,
        userData: action.userData,
      };
    case userConstants.UPDATE_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.user
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
