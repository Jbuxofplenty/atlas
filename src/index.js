import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import theme from './theme';

import { Provider } from 'react-redux';
import { store, persistor } from './helpers';

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<CircularProgress className="center-screen"/>}>
          <App />
        </Suspense>
      </PersistGate>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
