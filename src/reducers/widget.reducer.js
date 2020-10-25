import { widgetConstants } from '../constants';
import { candleStickOptions } from 'charts';
import { cryptoCurrencies } from 'components/MultiSelect/data';

// const dataSets = [
//   { value: 'crypto', label: 'Crypto Currencies' },
//   { value: 'heldTickers', label: 'Held Symbols' },
//   { value: 'indices', label: "Indices" },
//   { value: 'usStocks', label: 'US Stocks' },
//   { value: 'gspc', label: 'S&P 500' },
//   { value: 'ndx', label: 'Nasdaq 100' },
//   { value: 'dji', label: 'Dow Jones' },
// ]

const dataSets = [
  { value: 'crypto', label: 'Crypto Currencies' },
  { value: 'heldTickers', label: 'Held Symbols' },
  { value: 'usStocks', label: 'US Stocks' },
  { value: 'gspc', label: 'S&P 500' },
  { value: 'ndx', label: 'Nasdaq 100' },
  { value: 'dji', label: 'Dow Jones' },
]

const defaultTicker = [cryptoCurrencies[0].value, cryptoCurrencies[0].label, cryptoCurrencies[0].color, cryptoCurrencies[0].tickerType]

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
      widgetType: 'candleStick',
      chartName: 'Candle Stick (Price)',
      dataGrid: {x: 0, y: 0, w: 12, h: 16, minH: 14, minW: 6, i: "2"},
      collapsed: false,
      height: 444,
      tickers: {1: defaultTicker},
      chartOptions: candleStickOptions,
      name: 'Crypto Currencies Candlestick Chart',
      timeScale: '1M',
      yType: 'Price',
      dataSet: dataSets[0],
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
  dataSets,
}