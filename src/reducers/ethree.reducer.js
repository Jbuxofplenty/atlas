import { eThreeConstants } from '../constants';

const initialState = {
  eThreeInstance: {},
  backedUp: false,
};

export function eThree(state = initialState, action) {
  switch (action.type) {
    case eThreeConstants.ETHREE_RESET:
      return initialState;
    case eThreeConstants.UPDATE_ETHREE:
      return {
        ...state,
        eThreeInstance: action.eThree,
      };
    case eThreeConstants.UPDATE_BACKED_UP:
      return {
        ...state,
        backedUp: action.backedUp,
      };
    default:
      return state;
  }
}
