const apiKey = process.env.REACT_APP_IEXCLOUD_SECRET_KEY;
const version = process.env.REACT_APP_IEXCLOUD_API_VERSION;

function gainersUrl() {
  return "https://cloud.iexapis.com/" + version + "/stock/market/list/gainers?token=" + apiKey;
}

function losersUrl() {
  return "https://cloud.iexapis.com/" + version + "/stock/market/list/losers?token=" + apiKey;
}

export {
  gainersUrl,
  losersUrl,
}