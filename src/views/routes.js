import React from 'react';

const Page404 = React.lazy(() => import('../views/Page404'));
const Page500 = React.lazy(() => import('../views/Page500'));
const TermsAndConditions = React.lazy(() => import('../views/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('../views/PrivacyPolicy'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const CommonRoutes = [
  { path: '/404', exact: true, name: 'Page 404', component: Page404 },
  { path: '/500', exact: true, name: 'Page 500', component: Page500 },
  { path: '/terms-and-conditions', exact: true, name: 'Terms and Conditions', component: TermsAndConditions },
  { path: '/privacy-policy', exact: true, name: 'Privacy Policy', component: PrivacyPolicy },
];

export default CommonRoutes;
