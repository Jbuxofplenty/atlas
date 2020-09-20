import OAuthObject from './index';
import { dataActions } from 'actions';
import { store } from 'helpers';

// Function ensures API request will be made with a valid access token
export async function apiRequest(endpoint, institution, data) {
  const apiBaseUrl = OAuthObject[institution].apiBaseUrl;
  var url = endpoint.startsWith("https://") ? endpoint : apiBaseUrl + endpoint;
  const headers = OAuthObject[institution].headers;
  const method = data ? 'POST' : 'GET';
  var accessTokens = await dataActions.getFinancialData('accessTokens');
  var accessToken = accessTokens[institution];
  const now = new Date().getTime();
  const buffer = 200;
  var authHeader = 'Bearer ' + accessToken.access_token;
  // Assumes created_at field in seconds from UTC epoch
  if(now < parseFloat(accessToken.created_at*1000) + parseFloat(accessToken.expires_in) + buffer) {
    await refreshToken(accessToken.refresh_token, institution);
    accessTokens = await dataActions.getFinancialData('accessTokens');
    accessToken = accessTokens[institution];
    authHeader = 'Bearer ' + accessToken.access_token;
  }
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
        return apiRequest(endpoint, institution, data);
      }
      return responseJson;
    })
    .catch((error) => {
      console.log("Error in request from " + institution + " when retrieving data from " + apiBaseUrl + endpoint + "!")
      console.log(error)
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
        return apiRequest(endpoint, institution, data);
      }
      return responseJson;
    })
    .catch((error) => {
      console.log("Error in request from " + institution + " when retrieving data from " + apiBaseUrl + endpoint + "!")
      console.log(error)
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
    return responseJson;
  })
  .catch((error) => {
    console.log("Error in request from " + institution + " when trying to generate a new access token!")
    console.log(error)
    return false;
  });
  await store.dispatch(dataActions.storeFinancialDataFirestore(institution, "accessTokens", responseData))
}