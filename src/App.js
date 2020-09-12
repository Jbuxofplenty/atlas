import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { 
  Route, 
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';

// Utilities
import Loader from 'components/Loader';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import { isEmpty } from 'lodash';

// Creative Tim
import "assets/scss/material-kit-react.scss?v=1.9.0";

// Routes
import UnauthenticatedRoutes from 'unauthenticated/routes';
import { CommonRoutes } from './views';

// Firebase
import { auth } from './firebase';
import { submitIssue } from './helpers';

const LayoutComponent = React.lazy(() => import('containers/Layout'))

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      user: props.user,
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged(function(user) {
      this.setState({user});
      if(user && isEmpty(this.props.user)) this.props.history.push('/app/dashboard')
      else if(!user && !isEmpty(this.props.user)) this.props.history.push('/login')
    }.bind(this));
    window.addEventListener("error", function (e) {
      submitIssue(e.error.message, e.error.stack, "bug", true);
    })
  }
  
  render() {
    return (
      <Suspense fallback={<Loader className="center-screen" />}>
        <ErrorBoundary>
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
            <Route path="/" exact render={() => <Redirect to="/app"/>}/>
            <PrivateRoute path="/app" dispatch={this.props.dispatch} user={this.state.user} component={LayoutComponent}/>
            <Redirect from="/home" to="/" />
            <Redirect to="/404" />
          </Switch>
        </ErrorBoundary>
      </Suspense>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.authentication.user,
  };
}

export default connect(mapStateToProps, null)(withRouter(App));
