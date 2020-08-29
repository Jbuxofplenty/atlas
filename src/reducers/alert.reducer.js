import { alertConstants } from '../constants';

export function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        ...state,
        type: 'alert-success',
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        ...state,
        type: 'alert-danger',
        message: action.message
      };
    case alertConstants.VISIBLE:
      return {
        ...state,
        visible: action.show
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state
  }
}
