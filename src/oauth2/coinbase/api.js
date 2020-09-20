import { apiRequest } from 'oauth2/helpers';
import { dataActions } from 'actions';
import { store, asyncForEach } from 'helpers';

const coin = "Coinbase";

async function getWalletsTotalBalance() {
  var response = await apiRequest('accounts', coin);
  if(!response || !response.data) return false;
  var wallets = response.data;
  var financialData = {
    wallets,
    totalBalance: 0
  };
  wallets.forEach(wallet => {
    financialData.totalBalance += parseFloat(wallet.balance.amount);
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
  })
  var financialData = {
    ...walletsTotalBalance,
  }
  financialData.orders = orders;
  await store.dispatch(dataActions.storeFinancialData(coin, "accounts", financialData));
  return financialData;
}

async function pullAccountData() {
  var success = true;
  var walletsTotalBalance = await getWalletsTotalBalance();
  if(!walletsTotalBalance) return false;
  success = await getOrders(walletsTotalBalance);
  var accounts = await dataActions.getFinancialData("accounts");
  var account = accounts[coin];
  account.displayName = coin;
  account.lastSynced = new Date().getTime();
  await store.dispatch(dataActions.storeFinancialDataFirestore(coin, "accounts", account));
  return success;
}

async function revokeToken(token) {
  return true;
  // Currently issue with the revoke function, will contact coinbase
  // var accessToken = { token };
  // console.log(token);
  // var response = await apiRequest('https://api.coinbase.com/oauth/revoke', coin, accessToken);
  // if(!response) return false;
  // return response;
}

const coinbaseAPI = {
  pullAccountData: pullAccountData,
  getWalletsTotalBalance: getWalletsTotalBalance,
  revokeToken: revokeToken,
  getOrders: getOrders,
  apiBaseUrl: "https://api.coinbase.com/v2/",
  headers: {
    "CB-VERSION": "2020-08-23"
  }
}

export default coinbaseAPI;