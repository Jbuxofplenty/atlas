import React, { Component, Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch,
  Redirect
} from 'react-router-dom';

// Creative Tim
import "assets/scss/material-kit-react.scss?v=1.9.0";

// Material UI
import CircularProgress from '@material-ui/core/CircularProgress';

// Routes
import UnauthenticatedRoutes from './routes';
import { CommonRoutes } from '../views';

class UnauthenticatedApp extends Component {
  render() {
    return (
      <Suspense fallback={<CircularProgress className="center-screen"/>}>
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
