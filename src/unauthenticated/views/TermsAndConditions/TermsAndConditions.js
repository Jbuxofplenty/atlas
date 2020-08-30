/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

import React from 'react';
import CommonTermsAndConditions from 'views/TermsAndConditions/TermsAndConditions';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import styles from "assets/jss/material-kit-react/views/privacyPage.js";

const useStyles = makeStyles(styles);

export default function TermsAndConditions(props) {
  const { ...rest } = props;

  const classes = useStyles();
  return (
    <div>
      <Header
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
        <CommonTermsAndConditions />
      </div>
      <Footer />
    </div>
  );
}
