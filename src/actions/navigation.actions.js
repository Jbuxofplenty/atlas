/* eslint-disable import/prefer-default-export */
import { navigationConstants } from '../constants/navigation.constants';

export function openSidebar() {
  return {
    type: navigationConstants.OPEN_SIDEBAR,
  };
}

export function changeSidebarPosition(nextPosition) {
  return {
    type: navigationConstants.CHANGE_SIDEBAR_POSITION,
    payload: nextPosition,
  };
}

export function closeSidebar() {
  return {
    type: navigationConstants.CLOSE_SIDEBAR,
  };
}

export function changeActiveSidebarItem(activeItem) {
  return {
    type: navigationConstants.CHANGE_ACTIVE_SIDEBAR_ITEM,
    activeItem,
  };
}

export function changeSidebarVisibility(nextVisibility) {
  return {
    type: navigationConstants.CHANGE_SIDEBAR_VISIBILITY,
    payload: nextVisibility,
  };
}