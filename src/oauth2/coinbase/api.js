import { apiRequest } from 'oauth2/helpers';
import { dataActions, alertActions } from 'actions';
import { store, asyncForEach, p } from 'helpers';

const coin = "Coinbase";

async function getExchangeRates() {
  var response = await apiRequest('exchange-rates', coin);
  if(!response || !response.data) return false;
  return response.data.rates;
}

async function getWalletsTotalBalance(exchangeRates) {
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[coin];
  var enter = true;
  var wallets = [];
  var nextUri = 'accounts';
  var response;
  while(enter || (response && response.pagination && response.pagination.next_uri)) {
    if(!enter) nextUri = response.pagination.next_uri.slice(4);
    response = await apiRequest(nextUri, coin);
    if(!response || !response.data) return false;
    wallets = wallets.concat(response.data);
    enter = false;
  }
  var financialData = {
    ...account,
    wallets,
    totalBalance: 0
  };
  wallets.forEach(wallet => {
    financialData.totalBalance += parseFloat(wallet.balance.amount) / parseFloat(exchangeRates[wallet.currency.code]);
  })
  await store.dispatch(dataActions.storeFinancialData(coin, "accounts", financialData));
  return financialData;
}

async function getOrders(walletsTotalBalance) {
  var wallets = walletsTotalBalance.wallets;
  var orders = {
    buys: [],
    sells: [],
  }
  var i = 1;
  await asyncForEach(wallets, async wallet => {
    var walletId = wallet.id;
    var response = await apiRequest('accounts/' + walletId + '/buys ', coin);
    if(!response || !response.data) return false;
    var buys = response.data;
    buys.forEach(buy => {
      orders.buys.push(buy);
    })
    response = await apiRequest('accounts/' + walletId + '/sells', coin);
    if(!response || !response.data) return false;
    var sells = response.data;
    sells.forEach(sell => {
      orders.sells.push(sell);
    })
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

async function storeAccount() {
  var accounts = await dataActions.getFinancialData("accounts");
  if(!accounts || !accounts[coin]) {
    accounts = {};
    accounts[coin] = {};
  }
  var account = accounts[coin];
  account.displayName = coin;
  account.lastSynced = new Date().getTime();
  await store.dispatch(dataActions.storeFinancialDataFirestore(coin, "accounts", account));
}

async function pullAccountData() {
  await storeAccount();
  var success = true;
  var exchangeRates = await getExchangeRates();
  var walletsTotalBalance = await getWalletsTotalBalance(exchangeRates);
  if(!walletsTotalBalance) return false;
  success = await getOrders(walletsTotalBalance);
  await storeAccount();
  return success;
}

async function connectAccount() {
  await storeAccount();
  var success = true;
  var exchangeRates = await getExchangeRates();
  var walletsTotalBalance = await getWalletsTotalBalance(exchangeRates);
  if(!walletsTotalBalance) return false;
  await storeAccount();
  return success;
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
  getExchangeRates: getExchangeRates,
  connectAccount: connectAccount,
  apiBaseUrl: "https://api.coinbase.com/v2/",
  headers: {
    "CB-VERSION": "2020-08-23"
  }
}

export default coinbaseAPI;