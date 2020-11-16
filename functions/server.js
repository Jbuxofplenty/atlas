// Common packages
const express = require('express');

// Common functions
const { 
  getDefault,
} = require('./util');

///////////////////////////////////////////////////////////////////
//////////////////////        AUTH          ///////////////////////
///////////////////////////////////////////////////////////////////

const { 
  checkRecaptcha,
} = require('./auth');

// Create an Express object and routes (in order)
const auth = express();
auth.use('/checkRecaptcha', checkRecaptcha);
auth.use(getDefault);

///////////////////////////////////////////////////////////////////
//////////////////////        GITHUB          /////////////////////
///////////////////////////////////////////////////////////////////

const { 
  submitIssue,
  whileYouWereAway,
} = require('./github');

// Create an Express object and routes (in order)
const github = express();
github.use('/submitIssue', submitIssue);
github.use('/whileYouWereAway', whileYouWereAway);
github.use(getDefault);

///////////////////////////////////////////////////////////////////
//////////////////////        PLAID          //////////////////////
///////////////////////////////////////////////////////////////////

const { 
  createLinkToken,
  getAccessToken,
  removeItem,
  getBalance,
  getHoldings,
  getInvestmentTransactions,
} = require('./plaid');

// Create an Express object and routes (in order)
const plaid = express();
plaid.use('/createLinkToken', createLinkToken);
plaid.use('/getAccessToken', getAccessToken);
plaid.use('/removeItem', removeItem);
plaid.use('/getBalance', getBalance);
plaid.use('/getHoldings', getHoldings);
plaid.use('/getInvestmentTransactions', getInvestmentTransactions);
plaid.use(getDefault);

///////////////////////////////////////////////////////////////////
//////////////////////        COINBASE          ///////////////////
///////////////////////////////////////////////////////////////////

const {
  getCryptoPrice,
} = require('./coinbase');

// Create an Express object and routes (in order)
const coinbase = express();
coinbase.use('/getCryptoPrice', getCryptoPrice);
coinbase.use(getDefault);

///////////////////////////////////////////////////////////////////
//////////////////////        VIRGIL          /////////////////////
///////////////////////////////////////////////////////////////////

const { 
  getVirgilJwt,
} = require('./virgil');

///////////////////////////////////////////////////////////////////
//////////////////////        VERSION          ////////////////////
///////////////////////////////////////////////////////////////////
const v1 = express();
v1.use('/auth', auth);
v1.use('/github', github);
v1.use('/coinbase', coinbase);
v1.use('/plaid', plaid);
v1.use(getDefault);


module.exports = {
  v1,
  getVirgilJwt,
  retrieveCryptoData,
};
