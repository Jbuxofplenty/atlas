import React from 'react';
import Loader from 'components/Loader';
import queryString from 'query-string';

export default function OAuthCallback(props) {
  const parsed = queryString.parse(props.location.search);
  console.log(parsed);

  return (
    <Loader className="center-screen" />
  )
}