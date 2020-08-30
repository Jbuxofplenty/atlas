import React from 'react';
import './App.scss';

const AuthenticatedApp = React.lazy(() => import('./authenticated/AuthenticatedApp'))
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated/UnauthenticatedApp'))

function App() {
  const user = false;
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default App;
