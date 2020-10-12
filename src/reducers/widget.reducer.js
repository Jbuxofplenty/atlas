import { widgetConstants } from '../constants';

const initialState = {
  'dashboard': {
    "0": {
      widgetType: 'customize',
      dataGrid: {x: 6, y: 13, w: 6, h: 7, minW: 5, minH: 7, isBounded: true, i: "0"},
      collapsed: false,
    },
    "1": {
      widgetType: 'accountSummary',
      dataGrid: {x: 0, y: 13, w: 6, h: 6, minW: 5, minH: 6, i: "1"},
      collapsed: false,
    },
    "2": {
      widgetType: 'candleStickPriceChart',
      dataGrid: {x: 0, y: 0, w: 12, h: 13, minH: 11, minW: 6, i: "2"},
      collapsed: false,
      height: 375,
    },
  },
  'charts': {},
}

function widget(state = initialState, action) {
  switch (action.type) {
    case widgetConstants.ADD_WIDGET:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          [action.key]: [action.widget],
        },
      };
    case widgetConstants.DELETE_WIDGET:
      const next = {...state};
      delete next[action.view][action.key];
      return next;
    case widgetConstants.UPDATE_WIDGETS:
      return {
        ...state,
        [action.view]: action.widgets,
      };
    case widgetConstants.UPDATE_WIDGET:
      return {
        ...state,
        [action.view]: {
          ...state[action.view],
          [action.key]: action.widget
        },
      };
    case widgetConstants.RESET:
      return initialState
    default:
      return state
  }
}

export {
  widget,
  initialState,
}