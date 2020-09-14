import React from 'react';

const LandingPage = React.lazy(() => import('./views/LandingPage/LandingPage'));
const TermsAndConditions = React.lazy(() => import('./views/TermsAndConditions/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./views/PrivacyPolicy/PrivacyPolicy'));
const SignupLoginPage = React.lazy(() => import('./views/SignupLoginPage/SignupLoginPage'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const UnauthenticatedRoutes = [
  { path: '/', exact: true, name: 'Landing', component: LandingPage },
  { path: '/login', exact: true, name: 'Login', component: (props) => <SignupLoginPage {...props} signUpPage={false} /> },
  { path: '/terms-and-conditions', exact: true, name: 'Terms and Conditions', component: TermsAndConditions },
  { path: '/privacy-policy', exact: true, name: 'Privacy Policy', component: PrivacyPolicy },
  { path: '/signup', exact: true, name: 'Signup Page', component: (props) => <SignupLoginPage {...props} signUpPage={true} />  },
];

export default UnauthenticatedRoutes;
