import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { isDev } from 'helpers';

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
var functions = fire.functions();
if (isDev()) {
  fire.functions().useFunctionsEmulator('http://localhost:5001') 
  // db.settings({
  //   host: "localhost:5002",
  //   ssl: false
  // });
}
export { 
  auth, 
  db,
  fire,
  functions,
  firebase,
};
