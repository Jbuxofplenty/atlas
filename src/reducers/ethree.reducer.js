import { eThreeConstants } from '../constants';

const initialState = {
  initialized: false,
  backedUp: false,
  privateKeyPresent: false,
};

export function eThree(state = initialState, action) {
  switch (action.type) {
    case eThreeConstants.ETHREE_RESET:
      return initialState;
    case eThreeConstants.UPDATE_BACKED_UP:
      return {
        ...state,
        backedUp: action.backedUp,
      };
    case eThreeConstants.UPDATE_PRIVATE_KEY_PRESENT:
      return {
        ...state,
        privateKeyPresent: action.privateKeyPresent,
      };
    default:
      return state;
  }
}
