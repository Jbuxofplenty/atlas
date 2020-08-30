import React, { Component, Suspense } from 'react';
// import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { alertActions } from '../../../actions';

// Material UI
import CircularProgress from '@material-ui/core/CircularProgress';

// Routes
// import AuthenticatedRoutes from '../../routes';

// const Footer = React.lazy(() => import('./Footer'));
// const Header = React.lazy(() => import('./Header'));

class LayoutPage extends Component {
  render() {
    return (
      <Suspense fallback={<CircularProgress className="center-screen"/>}>
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
