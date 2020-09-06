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
    default:
      return state
  }
}
