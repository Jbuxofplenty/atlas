import { apiRequest, refreshToken } from 'oauth2/helpers';
import { dataActions, alertActions } from 'actions';
import { store, asyncForEach } from 'helpers';
import { usStocks } from 'components/MultiSelect/data';

const binance = "Binance";

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
    accessToken = accessTokens[binance];
    if(!accessToken) return;
  }
  console.log(accessToken)
  accessToken = await refreshToken(accessToken.refresh_token, binance);
  console.log(accessToken)
  if(!accessToken) return;
  await storeAccount();
  return;
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
  return;
  var accounts = await dataActions.getFinancialData("accounts");
  var accessTokens = await dataActions.getFinancialData('accessTokens');
  var accessToken = accessTokens[binance];
  var exchangeRates = await getExchangeRates(accessToken);
  var account = accounts[binance];
  account.exchangeRates = exchangeRates;
  var newFinancialData = await getTotalBalancePercentDifference(account);
  if(newFinancialData) await store.dispatch(dataActions.storeFinancialData(binance, "accounts", newFinancialData));
  return newFinancialData;
}

////////////////////////////////////////////////////////////////
/////////////////////////// Internal ///////////////////////////
////////////////////////////////////////////////////////////////

async function storeAccount() {
  var accounts = await dataActions.getFinancialData("accounts");
  if(!accounts || !accounts[binance]) {
    accounts = {};
    accounts[binance] = {};
  }
  var account = accounts[binance];
  account.displayName = binance;
  account.color = '#00C805';
  account.plaid = false;
  account.lastSynced = new Date().getTime();
  await dataActions.storeFinancialDataFirestore(binance, "accounts", account, true);
}

async function getExchangeRates(accessToken) {
  var response = await apiRequest('exchange-rates', binance, accessToken);
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

async function getWalletsTotalBalance(accessToken, exchangeRates) {
  await store.dispatch(alertActions.clear());
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[binance];
  var enter = true;
  var allWallets = [];
  var nextUri = 'accounts';
  var response;
  while(enter || (response && response.pagination && response.pagination.next_uri)) {
    if(!enter) nextUri = response.pagination.next_uri.slice(4);
    response = await apiRequest(nextUri, binance, accessToken);
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
  await store.dispatch(dataActions.storeFinancialData(binance, "accounts", financialData));
  await store.dispatch(alertActions.progressSuccess(`Pulled in ${wallets.length} wallets with a balance from Binance!`));
  return financialData;
}

async function getOrders(accessToken, walletsTotalBalance, minimal=true) {
  var wallets = walletsTotalBalance.wallets;
  if(!minimal) wallets = walletsTotalBalance.allWallets;
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
    var response = await apiRequest('accounts/' + walletId + '/buys ', binance, accessToken);
    if(!response || !response.data) return false;
    var buys = response.data;
    buys.forEach(buy => {
      orders.buys.push(buy);
    });
    response = await apiRequest('accounts/' + walletId + '/sells', binance, accessToken);
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
  await store.dispatch(dataActions.storeFinancialData(binance, "accounts", financialData));
  return financialData;
}

async function getFinnhubTickers(minimal=true, retrieveData=true) {
  var { stockData } = store.getState().data;
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[binance];
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
    for(var i in usStocks) {
      if(usStocks[i].value.includes(code)) {
        var staleOrNoData = true;
        if(stockData 
            && stockData[usStocks[i].value] 
            && stockData[usStocks[i].value]["candleStickPrice"] 
            && stockData[usStocks[i].value]["candleStickPrice"]['1D']) {
          staleOrNoData = false;
          // Check for stale data
          var timeArray = stockData[usStocks[i].value]["candleStickPrice"]['1D'].t;
          var now = new Date();
          var dayBefore = now.setDate(now.getDate() - 1);
          var lastDateInTimeArray = new Date(timeArray[timeArray.length-1]*1000);
          dayBefore = new Date(dayBefore);
          if(lastDateInTimeArray < dayBefore) staleOrNoData = true;
        }
        if(staleOrNoData) {
          var unique = true;
          for(var j in tickersToPull) { 
            if(tickersToPull[j][0].includes(usStocks[i].value) && timeScales[j] === '1D') {
              unique = false;
              break;
            }
          }
          if(unique) {
            var newTicker = [usStocks[i].value, usStocks[i].label, usStocks[i].color, usStocks[i].tickerType];
            tickersToPull.push(newTicker);
            timeScales.push('1D');
          }
        }
        finnhubTickers.array.push(usStocks[i]);
        finnhubTickers.map[code] = usStocks[i];
      }
    }
  })
  if(retrieveData) await store.dispatch(dataActions.retrieveBatchStockData(tickersToPull, 'candleStick', timeScales));
  return finnhubTickers;
}

async function revokeToken(token) {
  return true;
  // Currently issue with the revoke function, will contact binance
  // var accessToken = { token };
  // p(token);
  // var response = await apiRequest('https://api.binance.com/oauth/revoke', binance, accessToken);
  // if(!response) return false;
  // return response;
}

const binanceAPI = {
  pullAccountData: pullAccountData,
  getWalletsTotalBalance: getWalletsTotalBalance,
  revokeToken: revokeToken,
  getOrders: getOrders,
  pullConfig: pullConfig,
  getExchangeRates: getExchangeRates,
  getFinnhubTickers: getFinnhubTickers,
  getPercentDifference: getPercentDifference,
  apiBaseUrl: "https://api.binance.com/v2/",
  headers: {
    "CB-VERSION": "2020-08-23"
  }
}

export default binanceAPI;