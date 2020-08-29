import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
// configureStore.js

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native


const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const loggerMiddleware = createLogger();

const store = createStore(persistedReducer, applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
));
const persistor = persistStore(store)
export { store, persistor }
