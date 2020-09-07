import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, user, ...rest }) => {
    console.log(user)
    return (
      <Route {...rest} render={props => (
          user
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )} />
  )
}
export default  PrivateRoute;