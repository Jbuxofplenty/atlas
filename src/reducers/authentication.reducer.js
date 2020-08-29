import { userConstants } from '../constants';

const initialState = {
  isLoginSuccess: false,
  isLoginPending: false,
  loginError: null,
  user: null,
  userData: null,
  human: true,
  signUp: false,
}

export function authentication(state = { initialState }, action) {
  switch (action.type) {
    case userConstants.LOGIN_RESET:
      return Object.assign({}, state, initialState);
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        isLoginPending: action.isLoginPending,
        user: action.user,
        isLoginSuccess: false,
        loginError: null,
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
        user: action.user,
        userData: action.userData
      };
    case userConstants.UPDATE_CAPTCHA:
      return {
        ...state,
        human: action.human,
        signUp: action.signUp,
        latestAction: action.latestAction
      }
    case userConstants.LOGOUT:
      return Object.assign({}, state, initialState);
    default:
      return state
  }
}
