import React from 'react';

const LandingPage = React.lazy(() => import('./views/LandingPage/LandingPage'));
const LoginPage = React.lazy(() => import('./views/LoginPage/LoginPage'));
const TermsAndConditions = React.lazy(() => import('./views/TermsAndConditions/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./views/PrivacyPolicy/PrivacyPolicy'));
const SignupPage = React.lazy(() => import('./views/SignupPage/SignupPage'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const UnauthenticatedRoutes = [
  { path: '/', exact: true, name: 'Landing', component: LandingPage },
  { path: '/login', exact: true, name: 'Login', component: LoginPage },
  { path: '/terms-and-conditions', exact: true, name: 'Terms and Conditions', component: TermsAndConditions },
  { path: '/privacy-policy', exact: true, name: 'Privacy Policy', component: PrivacyPolicy },
  { path: '/signup', exact: true, name: 'Signup Page', component: SignupPage },
];

export default UnauthenticatedRoutes;
