import { dataConstants } from '../constants';

const initialState = {
  institutions: {},
  stockData: {},
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
        [action.key]: action.accessTokens,
      };
    case dataConstants.UPDATE_ACCOUNTS:
      return {
        ...state,
        [action.key]: action.accounts,
      };
    case dataConstants.UPDATE_STOCK_DATA:
      return {
        ...state,
        stockData: {
          ...state.stockData,
          [action.ticker]: {
            ...state.stockData[action.ticker],
            [action.dataType]: action.data
          },
        }
      };
    default:
      return state
  }
}
