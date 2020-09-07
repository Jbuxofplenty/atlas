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