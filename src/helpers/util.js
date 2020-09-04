export function isDev() {
  return window.location.hostname === "localhost" || 
      window.location.hostname === process.env.REACT_APP_COMPUTER_NAME || 
      window.location.hostname === "127.0.0.1";
}

export function apiBaseUrl() {
  if(isDev()) {
    return "http://localhost:5001/atlasone-45064/us-central1/v1/";
  }
  return process.env.REACT_APP_BASE_API_URL;
}