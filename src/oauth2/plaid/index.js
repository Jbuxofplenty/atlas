import { p, apiBaseUrl } from 'helpers';
import plaidAPI from './api';
import Plaid from './Plaid';

async function createLinkToken() {
  return await fetch(apiBaseUrl() + 'plaid/createLinkToken/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  })
  .then((response) => response.json())
  .then((responseJson) => {
    p(responseJson);
    return responseJson
  })
  .catch((error) => {
    p("Error in request when trying to create a plaid link token!")
    p(error)
    return false;
  });
}

async function getAccessToken(publicToken) {
  return await fetch(apiBaseUrl() + 'plaid/getAccessToken/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicToken
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    p(responseJson);
    return responseJson
  })
  .catch((error) => {
    p("Error in request when trying to create a plaid link token!")
    p(error)
    return false;
  });
}

const plaidOAuthObject = {
  ...plaidAPI,
  accountComponent: Plaid,
};

export {
  createLinkToken,
  getAccessToken,
  plaidOAuthObject,
}