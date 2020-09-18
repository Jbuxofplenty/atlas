import { apiRequest } from 'oauth2/helpers';

const coin = "Coinbase";

async function getTotalBalance() {
  var response = await apiRequest('accounts', coin);
  console.log(response);
  // Parse out data to get total balance
  // Populate accounts object in financial data
  // Adjust Accounts.js to show connected accounts with balance data
  // Make refesh button to connect account again
  // Disconnect account
}

async function pullAccountData() {
  getTotalBalance();
}

const coinbaseAPI = {
  pullAccountData: pullAccountData,
  getTotalBalance: getTotalBalance,
  apiBaseUrl: "https://api.coinbase.com/v2/",
}

export default coinbaseAPI;