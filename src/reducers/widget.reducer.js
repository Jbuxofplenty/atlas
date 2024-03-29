import { widgetConstants } from '../constants';
import { candleStickOptions, riverOptions, horizontalBarOptions, lineOptions, accountsPieOptions } from 'charts';
import { cryptoCurrencies, gspc, dji } from 'components/MultiSelect/data';

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
  { value: 'gainers', label: "Today's Top Gainers" },
  { value: 'losers', label: "Today's Top Losers" },
  { value: 'usStocks', label: 'US Stocks' },
  { value: 'gspc', label: 'S&P 500' },
  { value: 'ndx', label: 'Nasdaq 100' },
  { value: 'dji', label: 'Dow Jones' },
  { value: 'nyse', label: 'New York Stock Exchange' },
  { value: 'nasdaq', label: 'Nasdaq' },
]

const defaultAccountsPie = {
  widgetType: 'accountsPie',
  dataGrid: {x: 0, y: 16, w: 6, h: 15, minH: 15, minW: 6, i: "3"},
  collapsed: false,
  height: 444,
  tickers: {},
  chartOptions: accountsPieOptions,
  name: 'Accounts Balance Pie Chart',
  timeScale: '1D',
  yType: 'Price',
  dataSet: dataSets[1],
  units: 'AccountsBalance',
}

const bitcoinTicker = [cryptoCurrencies[0].value, cryptoCurrencies[0].label, cryptoCurrencies[0].color, cryptoCurrencies[0].tickerType];
const ethereumTicker = [cryptoCurrencies[1].value, cryptoCurrencies[1].label, cryptoCurrencies[1].color, cryptoCurrencies[1].tickerType];
const algoTicker = [cryptoCurrencies[2].value, cryptoCurrencies[2].label, cryptoCurrencies[2].color, cryptoCurrencies[2].tickerType];
const appleTicker = [dji[7].value, dji[7].label, dji[7].color, dji[7].tickerType];
const facebookTicker = [gspc[66].value, gspc[66].label, gspc[66].color, gspc[66].tickerType];
const googleTicker = [gspc[439].value, gspc[439].label, gspc[439].color, gspc[439].tickerType];
const microsoftTicker = [dji[11].value, dji[11].label, dji[11].color, dji[11].tickerType];

const defaultStockAnalyzerWidget = {
  widgetType: 'stockAnalyzer',
  dataGrid: {x: 0, y: 0, w: 12, h: 21, minW: 12, minH: 21, isBounded: true, i: "4"},
  defaultMinH: 21,
  collapsed: false,
  selectedTicker: dji[7],
  name: 'Stock Analyzer',
  timeScales: ['Annual'],
}

const initialState = {
  'dashboard': {
    "0": {
      widgetType: 'customize',
      dataGrid: {x: 6, y: 21, w: 6, h: 7, minW: 5, minH: 7, isBounded: true, i: "0"},
      collapsed: false,
    },
    "1": {
      widgetType: 'accountSummary',
      dataGrid: {x: 0, y: 21, w: 6, h: 6, minW: 5, minH: 6, i: "1"},
      collapsed: false,
    },
    "2": defaultStockAnalyzerWidget
  },
  'charts': {
    "0": {
      widgetType: 'customize',
      dataGrid: {x: 0, y: 33, w: 6, h: 7, minW: 5, minH: 7, isBounded: true, i: "0"},
      collapsed: false,
    },
    "1": {
      widgetType: 'horizontalBar',
      dataGrid: {x: 0, y: 0, w: 6, h: 16, minH: 14, minW: 6, i: "1"},
      collapsed: false,
      height: 444,
      tickers: {1: appleTicker, 2: microsoftTicker, 3: facebookTicker, 4: googleTicker},
      chartOptions: horizontalBarOptions,
      name: 'Big Four Week Percentage Change',
      timeScale: '1W',
      yType: 'Percent',
      dataSet: dataSets[6],
      units: 'Percent',
    },
    "2": {
      widgetType: 'candleStick',
      dataGrid: {x: 6, y: 0, w: 6, h: 16, minH: 14, minW: 6, i: "2"},
      collapsed: false,
      height: 444,
      tickers: {1: bitcoinTicker},
      chartOptions: candleStickOptions,
      name: 'Bitcoin Candlestick Chart',
      timeScale: '1M',
      yType: 'Price',
      dataSet: dataSets[0],
      units: 'Price',
    },
    "3": {
      widgetType: 'river',
      dataGrid: {x: 0, y: 16, w: 6, h: 16, minH: 14, minW: 6, i: "3"},
      collapsed: false,
      height: 444,
      tickers: {1: appleTicker, 2: microsoftTicker, 3: facebookTicker, 4: googleTicker},
      chartOptions: riverOptions,
      name: 'Big Four Volume',
      timeScale: '6M',
      yType: 'Price',
      dataSet: dataSets[5],
      units: 'Shares',
    },
    "4": {
      widgetType: 'line',
      dataGrid: {x: 6, y: 16, w: 6, h: 16, minH: 14, minW: 6, i: "4"},
      collapsed: false,
      height: 444,
      tickers: {1: bitcoinTicker, 2: ethereumTicker, 3: algoTicker},
      chartOptions: lineOptions,
      name: 'Crypto Currencies Line Chart',
      timeScale: '1M',
      yType: 'Percent',
      dataSet: dataSets[0],
      units: 'Percent',
    },
  },
  'simulator': {
    "0": {
      widgetType: 'customize',
      dataGrid: {x: 6, y: 19, w: 6, h: 7, minW: 5, minH: 7, isBounded: true, i: "0"},
      collapsed: false,
    },
    "1": {
      widgetType: 'overview',
      dataGrid: {x: 0, y: 0, w: 6, h: 16, minW: 6, minH: 16, isBounded: true, i: "1"},
      defaultMinH: 17,
      collapsed: false,
    },
    "2": {
      widgetType: 'simulatorSettings',
      dataGrid: {x: 6, y: 0, w: 6, h: 3, minW: 6, minH: 3, isBounded: true, i: "2"},
      collapsed: true,
      savedH: 12,
      savedMinH: 12,
    },
    "3": {
      widgetType: 'buySell',
      dataGrid: {x: 6, y: 3, w: 6, h: 15, minW: 6, minH: 15, isBounded: true, i: "3"},
      collapsed: false,
      numShares: 1,
    },
    "4": {
      widgetType: 'portfolio',
      dataGrid: {x: 0, y: 16, w: 6, h: 9, minW: 6, minH: 9, isBounded: true, i: "4"},
      defaultMinH: 9,
      collapsed: false,
    },
  }
}

const defaultCandleStickWidget = {
  widgetType: 'candleStick',
  dataGrid: {x: 0, y: 0, w: 12, h: 16, minH: 14, minW: 6, i: "2"},
  collapsed: false,
  height: 444,
  tickers: {1: bitcoinTicker},
  chartOptions: candleStickOptions,
  name: 'Crypto Currencies Candlestick Chart',
  timeScale: '1M',
  yType: 'Price',
  dataSet: dataSets[0],
  units: 'Price',
}

const defaultTransactionsWidget = {
  widgetType: 'transactions',
  dataGrid: {x: 0, y: 16, w: 6, h: 9, minW: 6, minH: 9, isBounded: true, i: "4"},
  defaultMinH: 9,
  collapsed: false,
}

const emptyState = {
  'dashboard': {},
  'charts': {},
  'simulator': {},
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
      return emptyState
    default:
      return state
  }
}

export {
  widget,
  initialState,
  dataSets,
  defaultAccountsPie,
  defaultStockAnalyzerWidget,
  defaultTransactionsWidget,
  defaultCandleStickWidget,
}