import OAuthObject from './index';
import { dataActions } from 'actions';
import { p } from 'helpers';

// Function ensures API request will be made with a valid access token
export async function apiRequest(endpoint, institution, accessToken=null, data=null) {
  const apiBaseUrl = OAuthObject[institution].apiBaseUrl;
  var url = endpoint.startsWith("https://") ? endpoint : apiBaseUrl + endpoint;
  const headers = OAuthObject[institution].headers;
  const method = data ? 'POST' : 'GET';
  if(!accessToken) {
    var accessTokens = await dataActions.getFinancialData('accessTokens');
    accessToken = accessTokens[institution];
    if(!accessToken) return false;
  }
  var authHeader = 'Bearer ' + accessToken.access_token;
  var responseData;
  if(method === 'GET') {
    responseData = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        ...headers,
      }
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      // Very specific to coinbase
      if(responseJson.errors && responseJson.errors[0].id === "expired_token") {
        await refreshToken(accessToken.refresh_token, institution);
        return apiRequest(endpoint, institution, accessToken, data);
      }
      if(responseJson.errors && responseJson.errors[0].id === "revoked_token") {
        p('need to handle revoked token in the future!')
      }
      return responseJson;
    })
    .catch((error) => {
      p("Error in request from " + institution + " when retrieving data from " + apiBaseUrl + endpoint + "!")
      p(error)
      return false;
    });
  }
  else {
    responseData = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      // Very specific to coinbase
      if(responseJson.errors && responseJson.errors[0].id === "expired_token") {
        await refreshToken(accessToken.refresh_token, institution);
        return apiRequest(endpoint, institution, accessToken, data);
      }
      return responseJson;
    })
    .catch((error) => {
      p("Error in request from " + institution + " when retrieving data from " + apiBaseUrl + endpoint + "!")
      p(error)
      return false;
    });
  }
  return responseData;
}

export async function refreshToken(refreshToken, institution) {
  const refreshTokenRequest = OAuthObject[institution].buildRefreshTokenRequest(refreshToken);
  var responseData = await fetch(refreshTokenRequest, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if(responseJson.error) {
      p(responseJson)
      return false;
    }
    return responseJson;
  })
  .catch((error) => {
    p("Error in request from " + institution + " when trying to generate a new access token!")
    p(error)
    return false;
  });
  if(responseData) await dataActions.storeFinancialDataFirestore(institution, "accessTokens", responseData, true)
  return responseData;
}