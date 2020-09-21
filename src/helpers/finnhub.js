const finnhub = require('finnhub');
const finnhubApiKey = finnhub.ApiClient.instance.authentications['api_key'];
const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
finnhubApiKey.apiKey = apiKey;
const finnhubClient = new finnhub.DefaultApi();

export {
  finnhubClient
};