import { coinbaseOAuthObject } from './coinbase';
import { binanceOAuthObject } from './binance';
import { plaidOAuthObject } from './plaid';
const OAuthObject = {
  "Coinbase": coinbaseOAuthObject,
  "Binance": binanceOAuthObject,
  "Plaid": plaidOAuthObject,
}
export default OAuthObject;