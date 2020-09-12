import { alertConstants } from '../constants';

const initialState = {
  type: '',
  message: '',
  visible: false,
  component: '',
}

export function alert(state = initialState, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        ...state,
        type: 'alert-success',
        message: action.message
      };
    case alertConstants.PENDING:
      return {
        ...state,
        type: 'alert-pending',
        visible: action.show,
      };
    case alertConstants.ERROR:
      return {
        ...state,
        type: 'alert-error',
        message: action.message
      };
    case alertConstants.VISIBLE:
      return {
        ...state,
        visible: action.show
      };
    case alertConstants.COMPONENT:
      return {
        ...state,
        component: action.component
      };
    case alertConstants.CLEAR:
      return initialState;
    default:
      return state
  }
}
