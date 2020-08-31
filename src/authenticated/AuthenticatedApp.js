import React, { Suspense } from 'react';

import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Routes
import { CommonRoutes } from '../views';

import Loader from 'components/Loader';

import 'assets/scss/theme.scss';
import LayoutComponent from 'containers/Layout';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

export default class AuthenticatedApp extends React.PureComponent {
  render() {
    return (
        <Suspense fallback={<Loader className="center-screen" size={40} />}>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <HashRouter>
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
                    <Route path="/" exact render={() => <Redirect to="/app"/>}/>
                    <Route path="/app" dispatch={this.props.dispatch} component={LayoutComponent}/>
                </Switch>
            </HashRouter>
        </Suspense>
    );
  }
}
