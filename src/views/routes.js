import React from 'react';

const Page404 = React.lazy(() => import('../views/Page404/Page404'));
const Page500 = React.lazy(() => import('../views/Page500/Page500'));
const OAuthCallback = React.lazy(() => import('../views/OAuthCallback/OAuthCallback'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const CommonRoutes = [
  { path: '/404', exact: true, name: 'Page 404', component: Page404 },
  { path: '/500', exact: true, name: 'Page 500', component: Page500 },
  { path: '/oauth-callback', exact: true, name: 'OAuth Callback', component: OAuthCallback },
];

export default CommonRoutes;
