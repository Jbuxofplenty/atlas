/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import React from 'react';
import CommonPrivacyPolicy from 'views/PrivacyPolicy/PrivacyPolicy';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import UnauthenticatedHeader from "containers/UnauthenticatedHeader/UnauthenticatedHeader.js";
import Footer from "containers/Footer/Footer.js";
import HeaderLinks from "containers/UnauthenticatedHeader/HeaderLinks.js";

import styles from "assets/jss/material-kit-react/views/privacyPage.js";

const useStyles = makeStyles(styles);

export default function PrivacyPolicy(props) {
  const { ...rest } = props;

  const classes = useStyles();
  return (
    <div>
      <UnauthenticatedHeader
        color="white"
        routes={[]}
        brand="Atlas One"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <div  className={classes.container}>
        <CommonPrivacyPolicy />
      </div>
      <Footer authenticated={false} />
    </div>
  );
}
