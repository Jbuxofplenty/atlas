import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

const LandingPage = React.lazy(() => import('unauthenticated/views/LandingPage/LandingPage'));

function AuthSwitch(props) {
  const history = useHistory();
  if(props.user) history.push('/app/dashboard')
  else history.push('/landing-page')

  return (
    null
  );
}

export default AuthSwitch;
