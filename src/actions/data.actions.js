import { dataConstants } from '../constants';
import { db, auth } from 'helpers/firebase';
import { eThreeActions, alertActions } from 'actions';
import { 
  store, 
  finnhubClient, 
  p, 
  losersUrl, 
  gainersUrl, 
  asyncForEach,
  finnhubFormattedDate,
} from 'helpers';
import OAuthObject from 'oauth2';
import { usStocks } from 'components/MultiSelect/data';

const financialDataTypeMap = {
  "accessTokens": {
    storeUpdateFunction: (encryptedAccessTokensKey, encryptedAccessTokens) => updateFinancialData(encryptedAccessTokensKey, encryptedAccessTokens)
  },
  "accounts": {
    storeUpdateFunction: (encryptedAccountsKey, encryptedAccounts) => updateAccounts(encryptedAccountsKey, encryptedAccounts)
  }
}

export const dataActions = {
  dataReset,
  getInstitutions,
  getFinancialDataFirestore,
  getFinancialData,
  storeFinancialDataFirestore,
  storeFinancialData,
  deleteAccount,
  financialDataTypeMap,
  retrieveBatchStockData,
  storeAllFinancialDataFirestore,
  getMovers,
  pullSymbolData,
  pullNewsData,
  getQuotes,
};

function dataReset() {
  return dispatch => {
    dispatch(dataResetSuccess());
  }
  function dataResetSuccess() { return { type: dataConstants.DATA_RESET } }
}

/////////////////////////////
//// User Financial Data ////
/////////////////////////////

async function storeAllFinancialDataFirestore() {
  var accounts = await getFinancialData('accounts');
  var accessTokens = await getFinancialData('accessTokens');
  await asyncForEach(Object.keys(accounts), async accountName => {
    await storeFinancialDataFirestore(accountName, 'accounts', accounts[accountName], false)
  })
  await asyncForEach(Object.keys(accessTokens), async accountName => {
    await storeFinancialDataFirestore(accountName, 'accessTokens', accessTokens[accountName], false)
  })
}

async function storeFinancialDataFirestore(institution, dataType, data, redux=true) {
  const { userData } = store.getState().user;
  var encryptedObject;
  var uid = auth.currentUser.uid;
  var password = await eThreeActions.cryptoPassword();
  var encryptedFinancialDataString = await eThreeActions.cryptoEncrypt(dataType, password);
  var financialData = await getFinancialDataFirestore(dataType, userData.e2ee);
  if(userData.e2ee) {
    financialData[institution] = data;
    encryptedObject = await eThreeActions.eThreeEncrypt(financialData);
  }
  else {
    financialData[institution] = data;
    encryptedObject = await eThreeActions.cryptoEncrypt(financialData, password);
  }
  var encryptedFinancialData = {
    [encryptedFinancialDataString]: encryptedObject
  };
  if(redux) await store.dispatch(financialDataTypeMap[dataType].storeUpdateFunction(encryptedFinancialDataString, encryptedObject));
  await db.collection("users").doc(uid).set({
    "financialData" : encryptedFinancialData
  }, { merge: true });
}

function storeFinancialData(institution, dataType, data) {
  return async (dispatch, getState) => {
    const { userData } = getState().user;
    var encryptedObject;
    var password = await eThreeActions.cryptoPassword();
    var encryptedFinancialDataString = await eThreeActions.cryptoEncrypt(dataType, password);
    var financialData = await getFinancialData(dataType, userData.e2ee);
    if(userData.e2ee) {
      financialData[institution] = data;
      encryptedObject = await eThreeActions.eThreeEncrypt(financialData);
    }
    else {
      financialData[institution] = data;
      encryptedObject = await eThreeActions.cryptoEncrypt(financialData, password);
    }
    dispatch(financialDataTypeMap[dataType].storeUpdateFunction(encryptedFinancialDataString, encryptedObject));
  }
}

async function getFinancialDataFirestore(dataType, e2ee) {
  var uid = auth.currentUser.uid;
  var password = await eThreeActions.cryptoPassword();
  var encryptedFinancialDataKey = await eThreeActions.cryptoEncrypt(dataType, password);
  return db.collection("users").doc(uid).get().then(async function(snapshot) {
    var allFinancialData = snapshot.data().financialData;
    var encryptedFinancialData = allFinancialData[encryptedFinancialDataKey];
    var unEncryptedFinancialData;
    if(!encryptedFinancialData) {
      encryptedFinancialData = {};
      return {};
    }
    else if(e2ee) {
      unEncryptedFinancialData = await eThreeActions.eThreeDecrypt(encryptedFinancialData).catch(error => {
        p(error);
        return {};
      });
      store.dispatch(financialDataTypeMap[dataType].storeUpdateFunction(encryptedFinancialDataKey, encryptedFinancialData));
      return unEncryptedFinancialData;
    }
    else {
      unEncryptedFinancialData = await eThreeActions.cryptoDecrypt(encryptedFinancialData, password);
      store.dispatch(financialDataTypeMap[dataType].storeUpdateFunction(encryptedFinancialDataKey, encryptedFinancialData));
      return unEncryptedFinancialData;
    }
  })
  .catch(error => {
    p(error)
  })
}

async function getFinancialData(type) {
  var { userData } = store.getState().user;
  var allFinancialData = store.getState().data;
  var password = await eThreeActions.cryptoPassword();
  if(password === '') return undefined;
  var encryptedFinancialDataKey = await eThreeActions.cryptoEncrypt(type, password);
  var encryptedFinancialData = allFinancialData[type][encryptedFinancialDataKey];
  var unEncryptedFinancialData;
  if(!encryptedFinancialData) {
    encryptedFinancialData = {};
    return {};
  }
  else if(userData.e2ee) {
    unEncryptedFinancialData = await eThreeActions.eThreeDecrypt(encryptedFinancialData).catch(error => {
      return {};
    });
    return unEncryptedFinancialData;
  }
  else {
    unEncryptedFinancialData = await eThreeActions.cryptoDecrypt(encryptedFinancialData, password);
    return unEncryptedFinancialData;
  }
}

function deleteAccount(institution, plaid=false) {
  return async (dispatch, getState) => {
    dispatch(alertActions.pending(true));
    const { userData } = getState().user;
    // Revoke the access token first
    var financialData = await getFinancialDataFirestore("accessTokens", userData.e2ee);
    var success = false;
    if(plaid) {
      success = await OAuthObject['Plaid'].revokeToken(financialData[institution].access_token);
    }
    else {
      success = await OAuthObject[institution].revokeToken(financialData[institution].access_token);
    }
    if(!success) {
      dispatch(alertActions.error("Unable to revoke your access token!"));
      return
    }
    var encryptedObject;
    var uid = auth.currentUser.uid;
    var password = await eThreeActions.cryptoPassword();
    const types = ["accessTokens", "accounts"];
    var encryptedFinancialData = {};
    await asyncForEach(types, async type => {
      var encryptedFinancialDataString = await eThreeActions.cryptoEncrypt(type, password);
      financialData = await getFinancialDataFirestore(type, userData.e2ee);
      if(userData.e2ee) {
        delete financialData[institution];
        encryptedObject = await eThreeActions.eThreeEncrypt(financialData);
      }
      else {
        delete financialData[institution];
        encryptedObject = await eThreeActions.cryptoEncrypt(financialData, password);
      }
      encryptedFinancialData[encryptedFinancialDataString] = encryptedObject;
      dispatch(financialDataTypeMap[type].storeUpdateFunction(encryptedFinancialDataString, encryptedObject));
    })
    await db.collection("users").doc(uid).update({
      "financialData" : encryptedFinancialData
    });
    dispatch(alertActions.success("Successfully deleted your account!  Click the button to reload this page."));
  }
}

function updateFinancialData(key, accessTokens) { 
  return { type: dataConstants.UPDATE_ACCESS_TOKENS, key, accessTokens } 
}

function updateAccounts(key, accounts) { 
  return { type: dataConstants.UPDATE_ACCOUNTS, key, accounts } 
}

/////////////////////////////
/////// Institutions ////////
/////////////////////////////

function getInstitutions() {
  return dispatch => {
    db.collection("institutions").get().then(function(querySnapshot) {
      var institutions = [];
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        institutions[doc.id] = doc.data();
      });
      dispatch(updateInstitutions(institutions));
    })
    .catch(error => {
      p(error)
      dispatch(updateInstitutions({}));
    })
  }
  function updateInstitutions(institutions) { return { type: dataConstants.UPDATE_INSTITUTIONS, institutions } }
}


/////////////////////////////
////// Financial Data ///////
/////////////////////////////

function pullNewsData(ticker) {
  return async dispatch => {
    var newsData = JSON.parse(JSON.stringify(store.getState().data.newsData));
    var promises = [];
    promises.push(new Promise(async function(resolve) {
      var startDate = new Date();
      startDate.setDate(startDate.getDate() - 3);
      var endDate = new Date();
      finnhubClient.companyNews(ticker, finnhubFormattedDate(startDate), finnhubFormattedDate(endDate), (error, data, response) => {
        if(!data && error.statusCode === 429) {
          dispatch(alertActions.error("We've hit our free-tier limit for our financial data provider!  It should open back up in another minute."))
          resolve();
        }
        if(data && data.s === 'no_data') {
          resolve();
        }
        newsData[ticker] = data;
        resolve();
      });
    }));
    await Promise.allSettled(promises);
    dispatch(updateNewsData(ticker, newsData[ticker]));
    return newsData[ticker];
  }
}

function updateNewsData(ticker, newsData) {
  return dispatch => {
    dispatch(newsDataSuccess(ticker, newsData));
  }
  function newsDataSuccess(ticker, newsData) { return { type: dataConstants.UPDATE_NEWS_DATA, ticker, newsData } }
}

function getQuotes(tickers) {
  return async dispatch => {
    var symbolData = JSON.parse(JSON.stringify(store.getState().data.symbolData));
    var promises = [];
    tickers.forEach(ticker => {
      promises.push(new Promise(async function(resolve) {
        finnhubClient.quote(ticker, (error, data, response) => {
          if(!data && error.statusCode === 429) {
            dispatch(alertActions.error("We've hit our free-tier limit for our financial data provider!  It should open back up in another minute."))
            resolve();
          }
          if(data && data.s === 'no_data') {
            resolve();
          }
          var percentChange = (data.c - data.pc) / data.pc;
          if(isNaN(percentChange)) percentChange = 0.;
          if(!symbolData[ticker]) symbolData[ticker] = {};
          symbolData[ticker].quote = {
            ...data,
            percentChange,
          }
          dispatch(updateSymbolData(ticker, symbolData[ticker]));
          resolve();
        });
      }));
    })
    await Promise.allSettled(promises);
    return symbolData;
  }
}

function pullSymbolData(ticker) {
  return async dispatch => {
    var symbolData = JSON.parse(JSON.stringify(store.getState().data.symbolData));
    if(symbolData[ticker]) {
      dispatch(updateSymbolData(ticker, symbolData[ticker]));
      return symbolData[ticker];
    }
    var promises = [];
    symbolData[ticker] = {};
    var companyData = symbolData[ticker];
    promises.push(new Promise(async function(resolve) {
      finnhubClient.companyBasicFinancials(ticker, "all", (error, data, response) => {
        if(!data && error.statusCode === 429) {
          dispatch(alertActions.error("We've hit our free-tier limit for our financial data provider!  It should open back up in another minute."))
          resolve();
        }
        if(data && data.s === 'no_data') {
          resolve();
        }
        companyData.financialMetrics = data.metric;
        resolve();
      });
    }));
    promises.push(new Promise(async function(resolve) {
      finnhubClient.companyProfile2({'symbol': ticker}, (error, data, response) => {
        if(!data && error.statusCode === 429) {
          dispatch(alertActions.error("We've hit our free-tier limit for our financial data provider!  It should open back up in another minute."))
          resolve();
        }
        if(data && data.s === 'no_data') {
          resolve();
        }
        companyData.profile = {
          ...data,
        }
        resolve();
      });
    }));
    promises.push(new Promise(async function(resolve) {
      finnhubClient.quote(ticker, (error, data, response) => {
        if(!data && error.statusCode === 429) {
          dispatch(alertActions.error("We've hit our free-tier limit for our financial data provider!  It should open back up in another minute."))
          resolve();
        }
        if(data && data.s === 'no_data') {
          resolve();
        }
        var percentChange = (data.c - data.pc) / data.pc;
        if(isNaN(percentChange)) percentChange = 0.;
        companyData.quote = {
          ...data,
          percentChange,
        }
        resolve();
      });
    }));
    await Promise.allSettled(promises);
    dispatch(updateSymbolData(ticker, companyData));
    return companyData;
  }
}

function updateSymbolData(ticker, symbolData) {
  return dispatch => {
    dispatch(symbolDataSuccess(ticker, symbolData));
  }
  function symbolDataSuccess(ticker, symbolData) { return { type: dataConstants.UPDATE_SYMBOL_DATA, ticker, symbolData } }
}

const finnhubTypes = {
  "candleStick": {
    "1D": "5",
    "1W": "30",
    "1M": "60",
    "YTD": "D",
    "6M": "D",
    "1Y": "D",
  }
}

function timeScaleForDate(timeScale) {
  var tempDate = new Date();
  if(timeScale === '1D') {
    tempDate.setDate(tempDate.getDate() - 1);
  }
  if(timeScale === '1W') {
    tempDate.setDate(tempDate.getDate() - 7);
  }
  if(timeScale === '1M') {
    tempDate.setMonth(tempDate.getMonth() - 1);
  }
  if(timeScale === 'YTD') {
    tempDate = new Date(new Date().getFullYear(), 0, 1);
  }
  if(timeScale === '6M') {
    tempDate.setMonth(tempDate.getMonth() - 6);
  }
  if(timeScale === '1Y') {
    tempDate.setMonth(tempDate.getMonth() - 12);
  }
  return tempDate.getTime();
}

function retrieveBatchStockData(tickers, dataType, timeScales) {
  return async dispatch => {
    var stockData = JSON.parse(JSON.stringify(store.getState().data.stockData));
    let promises = [];
    var i = 0;
    await asyncForEach(tickers, async _ => {
      var ticker = tickers[i][0];
      var tickerType = tickers[i][3];
      var timeScale = timeScales[i];
      var timeEnd = new Date().getTime();
      var timeStart = timeScaleForDate(timeScale);
      if(!stockData[ticker]) {
        stockData[ticker] = {};
      }
      promises.push(new Promise(async function(resolve) {
        if(tickerType === 'crypto' && dataType === 'candleStick') cryptoCandles(ticker, finnhubTypes, timeStart, timeEnd, dataType, timeScale, stockData, dispatch, resolve);
        else if(dataType === 'candleStick') stockCandles(ticker, finnhubTypes, timeStart, timeEnd, dataType, timeScale, stockData, dispatch, resolve);
        else resolve();
      }));
      i+=1;
    })
    await Promise.allSettled(promises);
    return stockData;
  }
}

function updateStockData(ticker, data, dataType, timeScale) { return { type: dataConstants.UPDATE_STOCK_DATA, ticker, data, dataType, timeScale } }

function stockCandles(ticker, finnhubTypes, timeStart, timeEnd, dataType, timeScale, stockData, dispatch, resolve) {
  // Finnhub expects seconds since UTC epoch rather than milliseconds
  finnhubClient.stockCandles(
    ticker, 
    finnhubTypes[dataType][timeScale], 
    parseInt(timeStart.toString().slice(0, -3)), 
    parseInt(timeEnd.toString().slice(0, -3)), 
    {},
    (error, data, response) => handleFinnhubResponse(error, data, response, ticker, dataType, timeScale, stockData, dispatch, resolve));
}

function cryptoCandles(ticker, finnhubTypes, timeStart, timeEnd, dataType, timeScale, stockData, dispatch, resolve) {
  // Finnhub expects seconds since UTC epoch rather than milliseconds
  finnhubClient.cryptoCandles(
    ticker, 
    finnhubTypes[dataType][timeScale], 
    parseInt(timeStart.toString().slice(0, -3)), 
    parseInt(timeEnd.toString().slice(0, -3)), 
    (error, data, response) => handleFinnhubResponse(error, data, response, ticker, dataType, timeScale, stockData, dispatch, resolve));
}

function handleFinnhubResponse(error, data, response, ticker, dataType, timeScale, stockData, dispatch, resolve) {
  p(error, data, response)
  if(!data && error.statusCode === 429) {
    dispatch(alertActions.error("We've hit our free-tier limit for our financial data provider!  It should open back up in another minute."))
    resolve();
  }
  if(data && data.s === 'no_data') {
    resolve();
  }
  else if(data && data.o && data.v) {
    if(!stockData[ticker][dataType+"Price"]) {
      stockData[ticker][dataType+"Price"] = {};
      stockData[ticker][dataType+"Percent"] = {};
    }
    stockData[ticker][dataType+"Price"][timeScale] = data;
    dispatch(updateStockData(ticker, data, dataType+"Price", timeScale));
    var percentData = computePercent(data);
    stockData[ticker][dataType+"Percent"][timeScale] = percentData;
  }
  p(response, data, dataType+"Price", timeScale)
  dispatch(updateStockData(ticker, percentData, dataType+"Percent", timeScale));
  resolve();
}

function computePercent(data) {
  var firstPrice = data.o[0];
  var firstVolume = data.v[0];
  var percentData = {};
  percentData.t = data.t;
  percentData.v = data.v;
  percentData.o = data.o.map(datum => {
    return (datum - firstPrice) / firstPrice * 100.;
  })
  percentData.c = data.c.map(datum => {
    return (datum - firstPrice) / firstPrice * 100.;
  })
  percentData.h = data.h.map(datum => {
    return (datum - firstPrice) / firstPrice * 100.;
  })
  percentData.l = data.l.map(datum => {
    return (datum - firstPrice) / firstPrice * 100.;
  })
  percentData.v = data.v.map(datum => {
    return (datum - firstVolume) / firstVolume * 100.;
  })
  return percentData;
}


/////////////////////////////
///////// IEX Cloud /////////
/////////////////////////////

async function getMovers(moverType) {
  let apiUrl = gainersUrl();
  if(moverType === 'losers') apiUrl = losersUrl();
  var responseData = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then((response) => response.json())
  .then(async (responseJson) => {
    return responseJson;
  })
  .catch((error) => {
    p("Error in request from IEXCloud when retrieving data for " + moverType + "!")
    p(error)
    return false;
  });
  var tickers = [];
  responseData.forEach(mover => {
    usStocks.forEach(stock => {
      if(stock.value === mover.symbol) tickers.push(stock);
    })
  })
  return tickers;
}
