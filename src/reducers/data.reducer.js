import { dataConstants } from '../constants';

const initialState = {
  institutions: {},
  stockData: {},
  accounts: {},
  tokens: {},
  symbolData: {},
  newsData: {},
};

export function data(state = initialState, action) {
  switch (action.type) {
    case dataConstants.DATA_RESET:
      return initialState;
    case dataConstants.UPDATE_INSTITUTIONS:
      return {
        ...state,
        institutions: action.institutions,
      };
    case dataConstants.UPDATE_ACCESS_TOKENS:
      return {
        ...state,
        accessTokens: {
          [action.key]: action.accessTokens,
        }
      };
    case dataConstants.UPDATE_ACCOUNTS:
      return {
        ...state,
        accounts: {
          [action.key]: action.accounts,
        }
      };
    case dataConstants.UPDATE_NEWS_DATA:
      return {
        ...state,
        newsData: {
          ...state.newsData,
          [action.ticker]: action.newsData,
        }
      };
    case dataConstants.UPDATE_SYMBOL_DATA:
      return {
        ...state,
        symbolData: {
          ...state.symbolData,
          [action.ticker]: {
            ...state.symbolData[action.ticker],
            ...action.symbolData,
          }
        }
      };
    case dataConstants.UPDATE_STOCK_DATA:
      if(state.stockData[action.ticker] && state.stockData[action.ticker][action.dataType])
        return {
          ...state,
          stockData: {
            ...state.stockData,
            [action.ticker]: {
              ...state.stockData[action.ticker],
              [action.dataType]: {
                ...state.stockData[action.ticker][action.dataType],
                [action.timeScale]: action.data
              }
            },
          }
        };
      else
        return {
          ...state,
          stockData: {
            ...state.stockData,
            [action.ticker]: {
              ...state.stockData[action.ticker],
              [action.dataType]: {
                [action.timeScale]: action.data
              }
            },
          }
        };
      case dataConstants.UPDATE_BATCH_STOCK_DATA:
        return {
          ...state,
          stockData: action.stockData
        };
    default:
      return state
  }
}
