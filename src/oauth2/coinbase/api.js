import { apiRequest, refreshToken } from 'oauth2/helpers';
import { dataActions, alertActions } from 'actions';
import { store, asyncForEach } from 'helpers';
import { cryptoCurrencies } from 'components/MultiSelect/data';

const coin = "Coinbase";

// Invocations to pull account data should use an object like this
const pullConfig = {
  percentDifference: true,
  wallets: true,
  orders: true,
  minimal: true,
}

////////////////////////////////////////////////////////////////
/////////////////////////// Public /////////////////////////////
////////////////////////////////////////////////////////////////

async function pullAccountData(pullConfiguration=pullConfig, accessToken=null) {
  if(!accessToken) {
    var accessTokens = await dataActions.getFinancialData('accessTokens');
    if(!accessTokens) return;
    accessToken = accessTokens[coin];
    if(!accessToken) return;
  }
  accessToken = await refreshToken(accessToken.refresh_token, coin);
  await storeAccount();
  var success = true;
  var exchangeRates = await getExchangeRates(accessToken);
  var walletsTotalBalance = await getWalletsTotalBalance(accessToken, exchangeRates);
  if(!walletsTotalBalance) return false;
  var financialData = await getTotalBalancePercentDifference(walletsTotalBalance);
  success = await getOrders(accessToken, financialData, pullConfiguration.minimal);
  await storeAccount();
  return success;
}

async function getPercentDifference() {
  var accounts = await dataActions.getFinancialData("accounts");
  var accessTokens = await dataActions.getFinancialData('accessTokens');
  var accessToken = accessTokens[coin];
  var exchangeRates = await getExchangeRates(accessToken);
  var account = accounts[coin];
  account.exchangeRates = exchangeRates;
  var newFinancialData = await getTotalBalancePercentDifference(account);
  if(newFinancialData) await store.dispatch(dataActions.storeFinancialData(coin, "accounts", newFinancialData));
  return newFinancialData;
}

////////////////////////////////////////////////////////////////
/////////////////////////// Internal ///////////////////////////
////////////////////////////////////////////////////////////////

async function storeAccount() {
  var accounts = await dataActions.getFinancialData("accounts");
  if(!accounts || !accounts[coin]) {
    accounts = {};
    accounts[coin] = {};
  }
  var account = accounts[coin];
  account.displayName = coin;
  account.lastSynced = new Date().getTime();
  await dataActions.storeFinancialDataFirestore(coin, "accounts", account);
}

async function getExchangeRates(accessToken) {
  var response = await apiRequest('exchange-rates', coin, accessToken);
  if(!response || !response.data) return false;
  return response.data.rates;
}

async function getTotalBalancePercentDifference(financialData) {
  var finnhubTickers = await getFinnhubTickers(financialData, true);
  if(!finnhubTickers) return null;
  var exchangeRates = financialData.exchangeRates;
  if(!exchangeRates) return null;
  var yesterdayTotalBalance = 0.;
  var { stockData } = store.getState().data;
  var dataAvailable = false;
  financialData.wallets.forEach(wallet => {
    var code = wallet.currency.code;
    if(finnhubTickers.map[code] && stockData[finnhubTickers.map[code].value]
          && stockData[finnhubTickers.map[code].value]["candleStickPrice"]
          && stockData[finnhubTickers.map[code].value]["candleStickPrice"]['1D']) {
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
  }
  return newFinancialData;
}

async function getWalletsTotalBalance(accessToken, exchangeRates) {
  await store.dispatch(alertActions.clear());
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[coin];
  var enter = true;
  var allWallets = [];
  var nextUri = 'accounts';
  var response;
  while(enter || (response && response.pagination && response.pagination.next_uri)) {
    if(!enter) nextUri = response.pagination.next_uri.slice(4);
    response = await apiRequest(nextUri, coin, accessToken);
    if(!response || !response.data) return false;
    allWallets = allWallets.concat(response.data);
    enter = false;
  }
  var wallets = [];
  allWallets.forEach(wallet => {
    if(parseFloat(wallet.balance.amount) > 0) wallets.push(wallet);
  })
  var financialData = {
    ...account,
    allWallets,
    wallets,
    totalBalance: 0,
    exchangeRates,
  };
  wallets.forEach(wallet => {
    financialData.totalBalance += parseFloat(wallet.balance.amount) / parseFloat(exchangeRates[wallet.currency.code]);
  })
  await store.dispatch(dataActions.storeFinancialData(coin, "accounts", financialData));
  await store.dispatch(alertActions.progressSuccess(`Pulled in ${wallets.length} wallets with a balance from Coinbase!`));
  return financialData;
}

async function getOrders(accessToken, walletsTotalBalance, minimal=true) {
  var wallets = walletsTotalBalance.wallets;
  if(!minimal) wallets = walletsTotalBalance.allWallets;
  var orders = {
    buys: [],
    sells: [],
  }
  var i = 1;
  await asyncForEach(wallets, async wallet => {
    var walletId = wallet.id;
    var response = await apiRequest('accounts/' + walletId + '/buys ', coin, accessToken);
    if(!response || !response.data) return false;
    var buys = response.data;
    buys.forEach(buy => {
      orders.buys.push(buy);
    });
    response = await apiRequest('accounts/' + walletId + '/sells', coin, accessToken);
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
  await store.dispatch(dataActions.storeFinancialData(coin, "accounts", financialData));
  return financialData;
}

async function getFinnhubTickers(minimal=true) {
  var { stockData } = store.getState().data;
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[coin];
  var wallets = account.wallets;
  if(!wallets) return false;
  var tickersToPull = [];
  var timeScales = [];
  if(!minimal) {
    wallets = account.allWallets;
  }
  var finnhubTickers = {array: [], map: {}};
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
  await store.dispatch(dataActions.retrieveBatchStockData(tickersToPull, 'candleStick', timeScales));
  return finnhubTickers;
}

async function revokeToken(token) {
  return true;
  // Currently issue with the revoke function, will contact coinbase
  // var accessToken = { token };
  // p(token);
  // var response = await apiRequest('https://api.coinbase.com/oauth/revoke', coin, accessToken);
  // if(!response) return false;
  // return response;
}

const coinbaseAPI = {
  pullAccountData: pullAccountData,
  getWalletsTotalBalance: getWalletsTotalBalance,
  revokeToken: revokeToken,
  getOrders: getOrders,
  pullConfig: pullConfig,
  getExchangeRates: getExchangeRates,
  getFinnhubTickers: getFinnhubTickers,
  getPercentDifference: getPercentDifference,
  apiBaseUrl: "https://api.coinbase.com/v2/",
  headers: {
    "CB-VERSION": "2020-08-23"
  }
}

export default coinbaseAPI;