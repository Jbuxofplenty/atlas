
// Common packages
const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const plaid = require('plaid');

var PLAID_CLIENT_ID = functions.config().plaid.client_id;
var PLAID_SECRET = functions.config().plaid.secret;
var PLAID_ENV = 'development';
var PLAID_COUNTRY_CODES = ['US']
var PLAID_REDIRECT_URI = 'http://127.0.0.1:3000/oauth-callback';


var plaidClient = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: {
    version: '2019-05-29',
  }
});

var createLinkToken = express();

createLinkToken.use(bodyParser.json()) // for parsing application/json
createLinkToken.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
createLinkToken.use(cors({ origin: true }));

createLinkToken.post('*', async (req, res) => {
  const config = {
    'client_id': PLAID_CLIENT_ID,
    'secret': PLAID_SECRET,
    'user': {
      'client_user_id': 'unique-user-id'
    },
    'client_name': "Plaid Quickstart",
    'products': ['investments'],
    'country_codes': PLAID_COUNTRY_CODES,
    'language': "en",
  }
  plaidClient.createLinkToken(config, function(err, createTokenResponse) {
    if (err != null) {
      console.log(err.toString());
      res.send(err.toString());
    }
    console.log(createTokenResponse)
    res.send(createTokenResponse);
  })
});

var getAccessToken = express();

getAccessToken.use(bodyParser.json()) // for parsing application/json
getAccessToken.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
getAccessToken.use(cors({ origin: true }));

getAccessToken.post('*', async (req, res) => {
  const publicToken = req.body.publicToken;
  const response = await plaidClient.exchangePublicToken(publicToken)
    .catch((err) => {
      console.log(err.toString());
      res.send(err.toString());
    })
  console.log(response)
  res.send(response);
});

var removeItem = express();

removeItem.use(bodyParser.json()) // for parsing application/json
removeItem.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
removeItem.use(cors({ origin: true }));

removeItem.post('*', async (req, res) => {
  const accessToken = req.body.accessToken;
  const response = await plaidClient.removeItem(accessToken)
    .catch((err) => {
      console.log(err.toString());
      res.send(err.toString());
    })
  console.log(response)
  res.send(response);
});

var getBalance = express();

getBalance.use(bodyParser.json()) // for parsing application/json
getBalance.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
getBalance.use(cors({ origin: true }));

getBalance.post('*', async (req, res) => {
  const accessToken = req.body.accessToken;
  const response = await plaidClient.getBalance(accessToken)
    .catch((err) => {
      console.log(err.toString());
      res.send(err.toString());
    })
  console.log(response)
  res.send(response);
});

var getHoldings = express();

getHoldings.use(bodyParser.json()) // for parsing application/json
getHoldings.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
getHoldings.use(cors({ origin: true }));

getHoldings.post('*', async (req, res) => {
  const accessToken = req.body.accessToken;
  const response = await plaidClient.getHoldings(accessToken)
    .catch((err) => {
      console.log(err.toString());
      res.send(err.toString());
    })
  console.log(response)
  res.send(response);
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

var getInvestmentTransactions = express();

getInvestmentTransactions.use(bodyParser.json()) // for parsing application/json
getInvestmentTransactions.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Automatically allow cross-origin requests
getInvestmentTransactions.use(cors({ origin: true }));

getInvestmentTransactions.post('*', async (req, res) => {
  const accessToken = req.body.accessToken;
  const startDate = formatDate(req.body.startDate);
  const endDate = formatDate(req.body.endDate);
  const response = await plaidClient.getInvestmentTransactions(accessToken, startDate, endDate, {
      count: 500,
      offset: 0,
    })
    .catch((err) => {
      console.log(err.toString());
      res.send(err.toString());
    })
  console.log(response)
  res.send(response);
});

module.exports = {
  createLinkToken,
  getAccessToken,
  removeItem,
  getBalance,
  getHoldings,
  getInvestmentTransactions,
};
