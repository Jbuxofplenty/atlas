import binanceOAuthDance from './oAuthDance';
import binanceAPI from './api';
import Binance from './Binance';
const binanceOAuthObject = {
  ...binanceOAuthDance,
  ...binanceAPI,
  accountComponent: Binance,
};
export {
  binanceOAuthObject
}