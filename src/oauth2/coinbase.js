import { isDev } from 'helpers';
import queryString from 'query-string';

const authorizationURL = process.env.REACT_APP_COINBASE_AUTHORIZATION_URI;
const tokenURL = process.env.REACT_APP_COINBASE_ACCESS_TOKEN_URI;
const authCallbackURL = isDev() ? process.env.REACT_APP_COINBASE_DEV_AUTH_REDIRECT_URI : process.env.REACT_APP_COINBASE_PROD_AUTH_REDIRECT_URI;
const clientSecret = process.env.REACT_APP_COINBASE_CLIENT_SECRET;
const scopes = [
  'wallet:withdrawals:read', 
  'wallet:transactions:read', 
  'wallet:sells:read',
  'wallet:deposits:read',
  'wallet:buys:read',
  'wallet:accounts:read',
];
const oAuthParams = {
  client_id: process.env.REACT_APP_COINBASE_CLIENT_ID,
}

function buildAuthRequest(state) {
  var params = Object.assign({}, oAuthParams);
  params.response_type = "code";
  params.scopes = scopes;
  params.state = state;
  params.redirect_uri = authCallbackURL;
  return authorizationURL + "?" + queryString.stringify(params)
}

function buildTokenRequest(authCode) {
  var params = Object.assign({}, oAuthParams);
  params.grant_type = "authorization_code";
  params.code = authCode;
  params.client_secret = clientSecret;
  params.redirect_uri = authCallbackURL;
  return tokenURL + "?" + queryString.stringify(params)
}

var coinbaseOAuthObject = {
  type: "OAuth",
  buildAuthRequest,
  buildTokenRequest,
}
export default coinbaseOAuthObject;