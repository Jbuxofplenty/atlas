import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const AuthenticatedRoutes = [
  { path: '/home', exact: true, name: 'Dashboard', component: Dashboard },
];

export default AuthenticatedRoutes;
