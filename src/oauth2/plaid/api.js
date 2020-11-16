import { dataActions, alertActions } from 'actions';
import { p, apiBaseUrl, store, randomHex } from 'helpers';
import { usStocks } from 'components/MultiSelect/data';

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
  await storeAccount(institution, null, metaData);
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
  account = await getTotalBalancePercentDifference(account);
  account = await getOrders(account, accessToken);
  // account = await getInvestments(account, pullConfiguration.name, accessToken);
  // if(!walletsTotalBalance) return false;
  // var financialData = await getTotalBalancePercentDifference(walletsTotalBalance);
  // success = await getOrders(accessToken, financialData, pullConfiguration.minimal);
  await storeAccount(pullConfiguration, account);
  // return success;
}

////////////////////////////////////////////////////////////////
/////////////////////////// Internal ///////////////////////////
////////////////////////////////////////////////////////////////

async function storeAccount(institution, account=null, metaData=null) {
  var accounts = await dataActions.getFinancialData("accounts");
  if(!accounts) accounts = {};
  if(!account) {
    if(!accounts[institution.name]) {
      accounts[institution.name] = {};
      var tempAccount = accounts[institution.name];
      tempAccount.displayName = institution.name;
      tempAccount.institutionId = institution.institution_id;
      tempAccount.color = randomHex();
      tempAccount.plaid = true;
      tempAccount.finnhubTickerBalanceMap = {};
    }
    account = accounts[institution.name];
  }
  account.lastSynced = new Date().getTime();
  if(metaData) account.subAccounts = metaData.accounts;
  await dataActions.storeFinancialDataFirestore(institution.name, "accounts", account);
}

async function getTotalBalancePercentDifference(account) {
  var finnhubTickers = await getFinnhubTickers(account, true);
  if(!finnhubTickers) return null;
  var yesterdayTotalBalance = 0.;
  var { stockData } = store.getState().data;
  var dataAvailable = false;
  var finnhubTickerBalanceMap = account.finnhubTickerBalanceMap;
  if(!finnhubTickerBalanceMap) finnhubTickerBalanceMap = {};
  account.holdings.forEach(holding => {
    var code = holding.security_id;
    if(finnhubTickers.map[code] && stockData[finnhubTickers.map[code].value]
          && stockData[finnhubTickers.map[code].value]["candleStickPrice"]
          && stockData[finnhubTickers.map[code].value]["candleStickPrice"]['1D']) {
      finnhubTickerBalanceMap[finnhubTickers.map[code].value] = {
        amount: parseFloat(holding.institution_value),
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
          yesterdayTotalBalance += parseFloat(openPriceArray[i]) * parseFloat(holding.quantity);
          dataAvailable = true;
          break;
        }
      }
    }
    else {
      var security = null; 
      if(account.securities) {
        account.securities.forEach(tempSecurity => {
          if(tempSecurity.security_id === holding.security_id) security = tempSecurity;
        })
      }
      if(security) yesterdayTotalBalance += parseFloat(security.close_price) * parseFloat(holding.quantity);
      else yesterdayTotalBalance += parseFloat(holding.institution_value);
    }
  })
  if(!dataAvailable) {
    yesterdayTotalBalance = account.totalBalance;
  }
  var percentDifference = (account.totalBalance - yesterdayTotalBalance) / yesterdayTotalBalance * 100.;
  var newFinancialData = {
    ...account,
    percentDifference,
    finnhubTickerBalanceMap,
  }
  return newFinancialData;
}

async function getAccountsTotalBalance(accountName, accessToken) {
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
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[accountName];
  if(!investments || !account) return false;
  var balances = investments.accounts;
  account.balances = balances;
  var totalBalance = 0;
  var totalAvailableBalance = 0;
  account.finnhubTickerBalanceMap = {};
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
  account.holdings = investments.holdings;
  account.securities = investments.securities;
  await store.dispatch(dataActions.storeFinancialData(accountName, "accounts", account));
  await store.dispatch(alertActions.progressSuccess(`Pulled in ${balances.length} accounts with a balance from ${accountName}!`));
  return account;
}

async function getOrders(account, accessToken) {
  var startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 100);
  var endDate = new Date();
  var response = await fetch(apiBaseUrl() + 'plaid/getInvestmentTransactions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken,
      startDate,
      endDate,
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    p(responseJson);
    return responseJson
  })
  .catch((error) => {
    p("Error in request when trying to retrieve orders!")
    p(error)
    return false;
  });
  var transactions = response.investment_transactions;
  var orders = {
    buys: [],
    sells: [],
  }
  transactions.forEach(transaction => {
    var buySell = {};
    buySell.created_at = transaction.date;
    buySell.amount = {};
    var security = null; 
    if(account.securities) {
      account.securities.forEach(tempSecurity => {
        if(tempSecurity.security_id === transaction.security_id) security = tempSecurity;
      })
    }
    if(security) buySell.amount.currency = security.name;
    else buySell.amount.currency = transaction.name;
    var balanceAccount = null; 
    if(account.balances) {
      account.balances.forEach(tempBalance => {
        if(tempBalance.account_id === transaction.account_id) balanceAccount = tempBalance;
      })
    }
    if(balanceAccount) buySell.account= balanceAccount.name;
    else buySell.account = 'N/A';
    buySell.resource = transaction.type;
    buySell.total = {};
    buySell.total.amount = Math.abs(transaction.amount);
    buySell.unit_price = {};
    buySell.unit_price.amount = Math.abs(transaction.price);
    buySell.fee = {};
    buySell.fee.amount = transaction.fees;
    buySell.status = transaction.cancel_transaction_id ? 'cancelled' : 'completed';
    if(transaction.type === 'buy' || transaction.type === 'cash') {
      orders.buys.push(buySell);
    }
    if(transaction.type === 'sell' || transaction.type === 'fee') {
      orders.sells.push(buySell);
    }
  });

  var financialData = {
    ...account,
    orders,
    transactions,
  }
  return financialData;
}

async function getFinnhubTickers(account, retrieveData=true) {
  var finnhubTickers = {array: [], map: {}};
  var { stockData } = store.getState().data;
  var holdings = account.holdings;
  if(!holdings) return false;
  var securities = account.securities;
  if(!securities) return false;
  var tickersToPull = [];
  var timeScales = [];
  holdings.forEach(holding => {
    var security = null; 
    securities.forEach(tempSecurity => {
      if(tempSecurity.security_id === holding.security_id) security = tempSecurity;
    })
    if(!security) p('Error! Security ID did not match any of the stored securities.')
    var code = security.ticker_symbol;
    store.dispatch(alertActions.progressSuccess(`Trying to populate stock data associated with your ${security.name} holding!`));
    for(var i in usStocks) {
      if(usStocks[i].value === code) {
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
  apiBaseUrl: "https://api.plaid.com/v2/",
}

export default plaidAPI;