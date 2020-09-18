import { dataConstants } from '../constants';

const initialState = {
  institutions: {},
};

export function data(state = initialState, action) {
  switch (action.type) {
    case dataConstants.DATA_RESET:
      return initialState;
    case dataConstants.UPDATE_INSTITUTIONS:
      return {
        ...state,
        institutions: action.institutions,
      };
    case dataConstants.UPDATE_ACCESS_TOKENS:
      return {
        ...state,
        [action.key]: action.accessTokens,
      };
    case dataConstants.UPDATE_ACCOUNTS:
      return {
        ...state,
        [action.key]: action.accounts,
      };
    default:
      return state
  }
}
