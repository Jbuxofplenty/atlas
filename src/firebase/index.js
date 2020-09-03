import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};
   

var fire = firebase.initializeApp(config);
var db = fire.firestore();
var auth = fire.auth();
var apiBaseUrl = process.env.REACT_APP_BASE_API_URL;
if (window.location.hostname === "localhost" || 
    window.location.hostname === process.env.REACT_APP_COMPUTER_NAME || 
    window.location.hostname === "127.0.0.1") {
    db.settings({
        host: "localhost:5002",
        ssl: false
    });
    apiBaseUrl = "http://localhost:5001/atlasone-45064/us-central1/v1/";
}
export { 
    auth, 
    db,
    fire,
    firebase,
    apiBaseUrl,
};
