import React from 'react';
import './App.scss';

// Creative Tim
import "assets/scss/material-kit-react.scss?v=1.9.0";

const AuthenticatedApp = React.lazy(() => import('./authenticated/AuthenticatedApp'))
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated/UnauthenticatedApp'))

function App() {
  const user = false;
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default App;
