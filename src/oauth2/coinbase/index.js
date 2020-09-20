import coinbaseOAuthDance from './oAuthDance';
import coinbaseAPI from './api';
import Coinbase from './Coinbase';
const coinbaseOAuthObject = {
  ...coinbaseOAuthDance,
  ...coinbaseAPI,
  accountComponent: Coinbase,
};
export {
  coinbaseOAuthObject
}