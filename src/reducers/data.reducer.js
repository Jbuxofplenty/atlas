import { dataConstants } from '../constants';

const initialState = {};

export function data(state = initialState, action) {
  switch (action.type) {
    case dataConstants.DATA_RESET:
      return Object.assign({}, state, initialState);
    default:
      return state
  }
}
