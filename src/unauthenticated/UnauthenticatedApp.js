import React, { Component, Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch,
  Redirect
} from 'react-router-dom';

import Loader from 'components/Loader';

// Creative Tim
import "assets/scss/material-kit-react.scss?v=1.9.0";

// Routes
import UnauthenticatedRoutes from './routes';
import { CommonRoutes } from '../views';

class UnauthenticatedApp extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="center-screen" />}>
        <Router>
            <Switch>
              {CommonRoutes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={route.component} />
                ) : (null);
              })}
              {UnauthenticatedRoutes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={route.component} />
                ) : (null);
              })}
              <Redirect from="/home" to="/" />
              <Redirect to="/404" />
            </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default UnauthenticatedApp;
