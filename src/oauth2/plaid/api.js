import { apiRequest } from 'oauth2/helpers';
import { dataActions, alertActions } from 'actions';
import { p, apiBaseUrl, store, asyncForEach, randomHex } from 'helpers';
import { cryptoCurrencies } from 'components/MultiSelect/data';

const plaid = "Plaid";

// Invocations to pull account data should use an object like this
const pullConfig = {
  percentDifference: true,
  wallets: true,
  orders: true,
  minimal: true,
  name: '',
  institution_id: '',
}

////////////////////////////////////////////////////////////////
/////////////////////////// Public /////////////////////////////
////////////////////////////////////////////////////////////////

async function setupAccount(metaData, accessToken) {
  var institution = metaData.institution;
  await storeAccount(institution, metaData);
  await dataActions.storeFinancialDataFirestore(institution.name, "accessTokens", accessToken);
  var tempPullConfig = JSON.parse(JSON.stringify(pullConfig));
  tempPullConfig.minimal = true;
  tempPullConfig.name = institution.name;
  tempPullConfig.institution_id = institution.institution_id;
  await pullAccountData(tempPullConfig, accessToken.access_token);
}

async function pullAccountData(pullConfiguration=pullConfig, accessToken=null) {
  if(!accessToken) {
    var accessTokens = await dataActions.getFinancialData('accessTokens');
    if(!accessTokens) return;
    accessToken = accessTokens[pullConfiguration.name];
    if(!accessToken) return;
    accessToken = accessToken.access_token;
    if(!accessToken) return;
  }
  var account = await getAccountsTotalBalance(pullConfiguration.name, accessToken);
  // account = await getInvestments(account, pullConfiguration.name, accessToken);
  // if(!walletsTotalBalance) return false;
  // var financialData = await getTotalBalancePercentDifference(walletsTotalBalance);
  // success = await getOrders(accessToken, financialData, pullConfiguration.minimal);
  await storeAccount(pullConfiguration);
  // return success;
}

async function getPercentDifference(itemId) {
  var accounts = await dataActions.getFinancialData("accounts");
  var accessTokens = await dataActions.getFinancialData('accessTokens');
  var accessToken = accessTokens[plaid];
  var account = accounts[itemId];
  var newFinancialData = await getTotalBalancePercentDifference(account);
  if(newFinancialData) await store.dispatch(accessToken, dataActions.storeFinancialData(plaid, "accounts", newFinancialData));
  return newFinancialData;
}

////////////////////////////////////////////////////////////////
/////////////////////////// Internal ///////////////////////////
////////////////////////////////////////////////////////////////

async function storeAccount(institution, metaData=null) {
  var accounts = await dataActions.getFinancialData("accounts");
  if(!accounts) accounts = {};
  if(!accounts[institution.name]) {
    accounts[institution.name] = {};
    var tempAccount = accounts[institution.name];
    tempAccount.displayName = institution.name;
    tempAccount.institutionId = institution.institution_id;
    tempAccount.color = randomHex();
    tempAccount.plaid = true;
    tempAccount.finnhubTickerBalanceMap = {};
  }
  var account = accounts[institution.name];
  account.lastSynced = new Date().getTime();
  if(metaData) account.subAccounts = metaData.accounts;
  await dataActions.storeFinancialDataFirestore(institution.name, "accounts", account);
}

async function getTotalBalancePercentDifference(financialData) {
  var finnhubTickers = await getFinnhubTickers(financialData, true);
  if(!finnhubTickers) return null;
  var exchangeRates = financialData.exchangeRates;
  if(!exchangeRates) return null;
  var yesterdayTotalBalance = 0.;
  var { stockData } = store.getState().data;
  var dataAvailable = false;
  var finnhubTickerBalanceMap = {};
  financialData.wallets.forEach(wallet => {
    var code = wallet.currency.code;
    if(finnhubTickers.map[code] && stockData[finnhubTickers.map[code].value]
          && stockData[finnhubTickers.map[code].value]["candleStickPrice"]
          && stockData[finnhubTickers.map[code].value]["candleStickPrice"]['1D']) {
      finnhubTickerBalanceMap[finnhubTickers.map[code].value] = {
        amount: parseFloat(wallet.balance.amount),
        color: finnhubTickers.map[code].color,
        name: code,
      };
      var timeArray = stockData[finnhubTickers.map[code].value]["candleStickPrice"]['1D'].t;
      var openPriceArray = stockData[finnhubTickers.map[code].value]["candleStickPrice"]['1D'].o;
      var now = new Date();
      var dayBefore = now.setDate(now.getDate() - 1);
      for(var i in timeArray) {
        var currentDate = new Date(timeArray[i]*1000);
        dayBefore = new Date(dayBefore);
        if(currentDate >= dayBefore) {
          yesterdayTotalBalance += parseFloat(openPriceArray[i]) * parseFloat(wallet.balance.amount);
          dataAvailable = true;
          break;
        }
      }
    }
    else {
      yesterdayTotalBalance += parseFloat(wallet.balance.amount) / parseFloat(exchangeRates[code])
    }
  })
  if(!dataAvailable) {
    yesterdayTotalBalance = financialData.totalBalance;
  }
  var percentDifference = (financialData.totalBalance - yesterdayTotalBalance) / yesterdayTotalBalance * 100.;
  var newFinancialData = {
    ...financialData,
    percentDifference,
    finnhubTickerBalanceMap,
  }
  return newFinancialData;
}

async function getAccountsTotalBalance(accountName, accessToken) {
  await store.dispatch(alertActions.clear());
  var balances = await fetch(apiBaseUrl() + 'plaid/getBalance/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    p(responseJson);
    return responseJson
  })
  .catch((error) => {
    p("Error in request when trying to retrieve balances!")
    p(error)
    return false;
  });
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[accountName];
  if(!balances || !account) return false;
  balances = balances.accounts;
  account.balances = balances;
  var totalBalance = 0;
  var totalAvailableBalance = 0;
  balances.forEach(balanceAccount => {
    var accountType = balanceAccount.type;
    if(accountType === 'depository') {
      account.finnhubTickerBalanceMap[balanceAccount.name] = {
        amount: parseFloat(balanceAccount.balances.current),
        color: randomHex,
        name: balanceAccount.name,
      };
      totalBalance += balanceAccount.balances.current;
      if(balanceAccount.balances.available) totalAvailableBalance += balanceAccount.balances.available;
    }
    else if(accountType === 'credit') {
      totalBalance -= balanceAccount.balances.current;
    }
    else if(accountType === 'loan') {
      totalBalance -= balanceAccount.balances.current;
    }
    else if(accountType === 'investment') {
      account.finnhubTickerBalanceMap[balanceAccount.name] = {
        amount: parseFloat(balanceAccount.balances.current),
        color: randomHex,
        name: balanceAccount.name,
      };
      totalBalance += balanceAccount.balances.current;
    }
  })
  account.totalAvailableBalance = totalAvailableBalance;
  account.totalBalance = totalBalance;
  await store.dispatch(dataActions.storeFinancialData(accountName, "accounts", account));
  await store.dispatch(alertActions.progressSuccess(`Pulled in ${balances.length} accounts with a balance from ${accountName}!`));
  return account;
}

async function getInvestments(account, accountName, accessToken) {
  await store.dispatch(alertActions.clear());
  var investments = await fetch(apiBaseUrl() + 'plaid/getHoldings/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    p(responseJson);
    return responseJson
  })
  .catch((error) => {
    p("Error in request when trying to retrieve balances!")
    p(error)
    return false;
  });
  if(!investments || !account) return false;
  return;
  await store.dispatch(dataActions.storeFinancialData(accountName, "accounts", account));
  await store.dispatch(alertActions.progressSuccess(`Pulled in ${investments.length} holdings with a balance from ${accountName}!`));
  return account;
}

async function getOrders(accessToken, walletsTotalBalance, minimal=true) {
  var wallets = walletsTotalBalance.wallets;
  if(!minimal) wallets = walletsTotalBalance.allAccounts;
  var orders = walletsTotalBalance.orders;
  var i, j;
  if(!orders || !minimal) {
    orders = {
      buys: [],
      sells: [],
    }
  }
  else {
    i = orders.buys.length;
    while (i--) {
      for(j in wallets) {
        if (orders.buys[i].amount.currency === wallets[j].balance.currency) { 
          orders.buys.splice(i, 1);
          break;
        } 
      }
    }
    i = orders.sells.length
    while (i--) {
      for(j in wallets) {
        if (orders.sells[i].amount.currency === wallets[j].balance.currency) { 
          orders.sells.splice(i, 1);
          break;
        } 
      }
    }
  }
  i = 1;
  await asyncForEach(wallets, async wallet => {
    var walletId = wallet.id;
    var response = await apiRequest('accounts/' + walletId + '/buys ', plaid, accessToken);
    if(!response || !response.data) return false;
    var buys = response.data;
    buys.forEach(buy => {
      orders.buys.push(buy);
    });
    response = await apiRequest('accounts/' + walletId + '/sells', plaid, accessToken);
    if(!response || !response.data) return false;
    var sells = response.data;
    sells.forEach(sell => {
      orders.sells.push(sell);
    });
    await store.dispatch(alertActions.clear());
    await store.dispatch(alertActions.progressSuccess(`Pulled in order data for your ${wallet.name} (${i}/${wallets.length})!`));
    i += 1;
  })
  var financialData = {
    ...walletsTotalBalance,
  }
  financialData.orders = orders;
  await store.dispatch(dataActions.storeFinancialData(plaid, "accounts", financialData));
  return financialData;
}

async function getFinnhubTickers(minimal=true, retrieveData=true) {
  var finnhubTickers = {array: [], map: {}};
  return finnhubTickers;
  var { stockData } = store.getState().data;
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[plaid];
  var wallets = account.wallets;
  if(!wallets) return false;
  var tickersToPull = [];
  var timeScales = [];
  if(!minimal) {
    wallets = account.allAccounts;
  }
  wallets.forEach(wallet => {
    var code = wallet.currency.code;
    for(var i in cryptoCurrencies) {
      if(cryptoCurrencies[i].value.includes(code)) {
        var staleOrNoData = true;
        if(stockData 
            && stockData[cryptoCurrencies[i].value] 
            && stockData[cryptoCurrencies[i].value]["candleStickPrice"] 
            && stockData[cryptoCurrencies[i].value]["candleStickPrice"]['1D']) {
          staleOrNoData = false;
          // Check for stale data
          var timeArray = stockData[cryptoCurrencies[i].value]["candleStickPrice"]['1D'].t;
          var now = new Date();
          var dayBefore = now.setDate(now.getDate() - 1);
          var lastDateInTimeArray = new Date(timeArray[timeArray.length-1]*1000);
          dayBefore = new Date(dayBefore);
          if(lastDateInTimeArray < dayBefore) staleOrNoData = true;
        }
        if(staleOrNoData) {
          var unique = true;
          for(var j in tickersToPull) { 
            if(tickersToPull[j][0].includes(cryptoCurrencies[i].value) && timeScales[j] === '1D') {
              unique = false;
              break;
            }
          }
          if(unique) {
            var newTicker = [cryptoCurrencies[i].value, cryptoCurrencies[i].label, cryptoCurrencies[i].color, cryptoCurrencies[i].tickerType];
            tickersToPull.push(newTicker);
            timeScales.push('1D');
          }
        }
        finnhubTickers.array.push(cryptoCurrencies[i]);
        finnhubTickers.map[code] = cryptoCurrencies[i];
      }
    }
  })
  if(retrieveData) await store.dispatch(dataActions.retrieveBatchStockData(tickersToPull, 'candleStick', timeScales));
  return finnhubTickers;
}

async function revokeToken(accessToken) {
  return await fetch(apiBaseUrl() + 'plaid/removeItem/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    p(responseJson);
    return responseJson
  })
  .catch((error) => {
    p("Error in request when trying to remove a plaid item!")
    p(error)
    return false;
  });
}

const plaidAPI = {
  setupAccount: setupAccount,
  pullAccountData: pullAccountData,
  getAccountsTotalBalance: getAccountsTotalBalance,
  revokeToken: revokeToken,
  getOrders: getOrders,
  pullConfig: pullConfig,
  getFinnhubTickers: getFinnhubTickers,
  getPercentDifference: getPercentDifference,
  apiBaseUrl: "https://api.plaid.com/v2/",
}

export default plaidAPI;