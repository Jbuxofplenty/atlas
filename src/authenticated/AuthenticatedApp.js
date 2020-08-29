import React, { Component, Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch,
  Redirect
} from 'react-router-dom';

// Material UI
import CircularProgress from '@material-ui/core/CircularProgress';

// Routes
import { Layout } from './containers';
import { CommonRoutes } from '../views';

class AuthenticatedApp extends Component {
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
              <Route path="/" name="Home" component={Layout} />
              <Redirect to="/404" />
            </Switch>
        </Router>
      </Suspense>
    );
  }
}

export default AuthenticatedApp;