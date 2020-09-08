import React, { useEffect } from 'react';
import Loader from 'components/Loader';
import queryString from 'query-string';
import { postMessageLocation } from 'helpers';

export default function OAuthCallback(props) {
  
  useEffect(() => {
    // get the URL parameters which will include the auth token
     var parsedData = queryString.parse(props.location.search);
     parsedData.source = "oauth-login-redirect";
     if (window.opener) {
       // send them to the opening window
       window.opener.postMessage(parsedData, postMessageLocation());
       // close the popup
       window.close();
     }
   });


  return (
    <Loader className="center-screen" />
  )
}