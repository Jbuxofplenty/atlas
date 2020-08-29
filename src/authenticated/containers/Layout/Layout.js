import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import { alertActions } from '../../../actions';

// Material UI
import CircularProgress from '@material-ui/core/CircularProgress';

// Routes
import AuthenticatedRoutes from '../../routes';

const Footer = React.lazy(() => import('./Footer'));
const Header = React.lazy(() => import('./Header'));

class LayoutPage extends Component {
  render() {
    return (
      <Suspense fallback={<CircularProgress className="center-screen"/>}>
        <Header history={this.props.history} />
        <div className="app-body esans">
          <main className="main">
            <Container fluid>
              <Switch className="esans">
                {AuthenticatedRoutes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <route.component
                          {...props}
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `400px` }} />}
                        />
                      )} />
                  ) : (null);
                })}
                <Redirect from="/" to="/home" />
              </Switch>
            </Container>
          </main>
        </div>
        <Footer history={this.props.history} />
      </Suspense>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errorMessage: state.alert.message,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    errorVisible: (show) => dispatch(alertActions.visible(show)),
    error: (errorMessage) => dispatch(alertActions.error(errorMessage)),
  };
}

const Layout = connect(mapStateToProps, mapDispatchToProps)(LayoutPage);
export default Layout;
