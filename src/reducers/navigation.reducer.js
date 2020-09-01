import { navigationConstants } from '../constants/navigation.constants';

const initialState = {
  sidebarOpened: false,
  activeItem: window.location.pathname,
  sidebarPosition: 'left',
  sidebarVisibility: 'show',
};

export function navigation(state = initialState, action) {
  switch (action.type) {
    case navigationConstants.OPEN_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpened: true,
      });
    case navigationConstants.CLOSE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpened: false,
      });
    case navigationConstants.CHANGE_SIDEBAR_POSITION:
      return Object.assign({}, state, {
        sidebarPosition: action.payload,
      });
    case navigationConstants.CHANGE_SIDEBAR_VISIBILITY:
      return Object.assign({}, state, {
        sidebarVisibility: action.payload,
      });
    case navigationConstants.CHANGE_ACTIVE_SIDEBAR_ITEM:
      return {
        ...state,
        activeItem: action.activeItem,
      };
    default:
      return state;
  }
}
