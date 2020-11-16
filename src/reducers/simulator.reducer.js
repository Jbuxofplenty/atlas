import { simulatorConstants } from '../constants';

const defaultSimulatorSettings = {
  startingBalance: 100000,
  commission: 10,
  creditInterestRate: 3,
  borrowingFactor: 2,
  margin: false,
};

export const defaultSimulatorHolding = {
  symbol: 'USD',
  quantity: defaultSimulatorSettings.startingBalance,
  price: 1,
  value: defaultSimulatorSettings.startingBalance,
  dailyChange: {
    value: 0,
    percent: 0,
  },
  overallChange: {
    value: 0,
    percent: 0,
  },
  priceToShares: [{price: 1, shares: defaultSimulatorSettings.startingBalance}],
};

export const defaultPortfolio = {
  netWorth: defaultSimulatorSettings.startingBalance,
  todaysGains: 0,
  todaysReturns: 0,
  cashRemaining: defaultSimulatorSettings.startingBalance,
  buyingPower: defaultSimulatorSettings.margin ? defaultSimulatorSettings.startingBalance*defaultSimulatorSettings.borrowingFactor : defaultSimulatorSettings.startingBalance,
  overallGains: 0,
  overallReturns: 0,
  cashBorrowed: 0,
  marginEnabled: true,
  holdings: [defaultSimulatorHolding],
  transactions: {
    completed: [],
    pending: [],
  }
};

export const initialState = {
  portfolio: JSON.parse(JSON.stringify(defaultPortfolio)),
  settings: JSON.parse(JSON.stringify(defaultSimulatorSettings)),
};

export function simulator(state = initialState, action) {
  switch (action.type) {
    case simulatorConstants.SIMULATOR_RESET:
      return initialState;
    case simulatorConstants.UPDATE_SETTINGS:
      return {
        ...state,
        settings: action.settings,
      };
    case simulatorConstants.UPDATE_PORTFOLIO:
      return {
        ...state,
        portfolio: action.portfolio,
      };
    case simulatorConstants.UPDATE_HOLDINGS:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          holdings: action.holdings,
        }
      };
    case simulatorConstants.UPDATE_ALL:
      return {
        ...action.simulator,
      };
    default:
      return state
  }
}
