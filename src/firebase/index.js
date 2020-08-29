import { devConfig } from './config';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var fire = firebase.initializeApp(devConfig);
export default fire;
