export function isDev() {
  return window.location.hostname === "localhost" || 
      window.location.hostname === process.env.REACT_APP_COMPUTER_NAME || 
      window.location.hostname === "127.0.0.1";
}

export function postMessageLocation() {
  if(isDev()) return 'http://127.0.0.1:3000'
  return process.env.REACT_APP_BASE_HOST_URL
}

export function apiBaseUrl() {
  if(isDev()) {
    return "http://localhost:5001/atlasone-45064/us-central1/v1/";
  }
  return process.env.REACT_APP_BASE_API_URL;
}

export function randomState() {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let array = new Uint8Array(40);
  window.crypto.getRandomValues(array);
  array = array.map(x => validChars.charCodeAt(x % validChars.length));
  const randomState = String.fromCharCode.apply(null, array);
  return randomState;
}

export function generateRandomId(uid) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var length = getRandomInt(50, 64);
  var randomId = '';
  for (var i = length; i > 0; --i) randomId += chars[Math.round(Math.random() * (chars.length - 1))];
  return randomId;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function p(text) {
  if(isDev()) {
    console.log(text);
  }
}

export function numberWithCommas(x) {
  return parseFloat(x).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeAll(str) {
  return str.split(' ').map(capitalize).join(' ');
}

export function randomHex() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function formattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + '/' + day + '/' + year;
}

export function finnhubFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return year + '-' + month + '-' + day;
}