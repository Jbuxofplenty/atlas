import { isDev } from 'helpers';
import queryString from 'query-string';

const authorizationURL = process.env.REACT_APP_BINANCE_AUTHORIZATION_URI;
const tokenURL = process.env.REACT_APP_BINANCE_ACCESS_TOKEN_URI;
const authCallbackURL = isDev() ? process.env.REACT_APP_BINANCE_DEV_AUTH_REDIRECT_URI : process.env.REACT_APP_BINANCE_PROD_AUTH_REDIRECT_URI;
const clientSecret = process.env.REACT_APP_BINANCE_CLIENT_SECRET;
const scopes = [
  'asset:balance',
];

const oAuthParams = {
  client_id: process.env.REACT_APP_BINANCE_CLIENT_ID,
}

function buildScopesQueryParam() {
  var scopesQueryParam = "&scope=";
  scopes.forEach(scope => {
    scopesQueryParam += scope + ',';
  })
  return scopesQueryParam.slice(0,-1);
}

function buildAuthRequest(state) {
  var params = Object.assign({}, oAuthParams);
  params.response_type = "code";
  params.state = state;
  params.redirect_uri = authCallbackURL;
  return authorizationURL + "?" + queryString.stringify(params) + buildScopesQueryParam()
}

function buildTokenRequest(authCode) {
  var params = Object.assign({}, oAuthParams);
  params.grant_type = "authorization_code";
  params.code = authCode;
  params.client_secret = clientSecret;
  params.redirect_uri = authCallbackURL;
  return tokenURL + "?" + queryString.stringify(params)
}

function buildRefreshTokenRequest(refreshToken) {
  var params = Object.assign({}, oAuthParams);
  params.grant_type = "refresh_token";
  params.refresh_token = refreshToken;
  params.client_secret = clientSecret;
  return tokenURL + "?" + queryString.stringify(params)
}

var binanceOAuthDance= {
  type: "OAuth",
  buildAuthRequest,
  buildTokenRequest,
  buildRefreshTokenRequest,
}
export default binanceOAuthDance;