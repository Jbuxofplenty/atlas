import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, user, dispatch, ...rest }) => {
    return (
      <Route {...rest} render={props => (
          user
              ? <Component {...props} dispatch={dispatch} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )} />
  )
}
export default  PrivateRoute;