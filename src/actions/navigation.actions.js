/* eslint-disable import/prefer-default-export */
import { navigationConstants } from '../constants/navigation.constants';

function openSidebar() {
  return {
    type: navigationConstants.OPEN_SIDEBAR,
  };
}

function changeSidebarPosition(nextPosition) {
  return {
    type: navigationConstants.CHANGE_SIDEBAR_POSITION,
    payload: nextPosition,
  };
}

function closeSidebar() {
  return {
    type: navigationConstants.CLOSE_SIDEBAR,
  };
}

function changeActiveSidebarItem(activeItem) {
  return {
    type: navigationConstants.CHANGE_ACTIVE_SIDEBAR_ITEM,
    activeItem,
  };
}

function changeSidebarVisibility(nextVisibility) {
  return {
    type: navigationConstants.CHANGE_SIDEBAR_VISIBILITY,
    payload: nextVisibility,
  };
}

export const navigationActions = {
  openSidebar,
  changeActiveSidebarItem,
  changeSidebarPosition,
  closeSidebar,
  changeSidebarVisibility,
}