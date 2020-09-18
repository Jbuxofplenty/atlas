import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// @material-ui
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import { firebase, auth } from '../../firebase';

import styles from "assets/jss/material-kit-react/components/twoFactorAuthModal.js";
import { alertActions, userActions } from "actions";

const useStyles = makeStyles(styles);

function TwoFactorAuthModal(props) {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const secretPhone = props.enroll ? `+1 (xxx) xxx-xx${props.phoneNumber.slice(-2)}` : props.resolver.hints[0].phoneNumber;
  setTimeout(function() {
    setCardAnimation("");
  }, 300);

  const interval = useRef(null);

  const isInvalid = verificationCode.length !== 6 || props.alertVisible;

  const classes = useStyles();

  const updateVerificationCode = (e) => {
    let vCode = e.target.value;
    vCode = vCode.substring(0, 6);
    vCode = vCode.replace(/\D/g,'');
    setVerificationCode(vCode);
  }

  const submit = async () => {
    props.visible(false);
    props.pending(true);
    // Ask user for the verification code.
    var cred = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    var multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);
    if(props.enroll) {
      var user = auth.currentUser;
      return user.multiFactor.enroll(multiFactorAssertion, "mfaDisplayName")
        .then(function() {
          props.setComponent("2fa");
          props.success("You've successfully enrolled in multi-factor authentication!");
        })
        .catch(e => {
          props.error(e.message);
        });
    }
    else {
      // Complete sign-in. This will also trigger the Auth state listeners.
      props.resolver.resolveSignIn(multiFactorAssertion)
      .then(function(userCredential) {
        // userCredential will also contain the user, additionalUserInfo, optional
        // credential (null for email/password) associated with the first factor sign-in.
        // For example, if the user signed in with Google as a first factor,
        // userCredential.additionalUserInfo will contain data related to Google provider that
        // the user signed in with.
        // user.credential contains the Google OAuth credential.
        // user.credential.accessToken contains the Google OAuth access token.
        // user.credential.idToken contains the Google OAuth ID token.
        if(userCredential.additionalUserInfo.providerId === "google.com") {
          console.log(props)
          props.googleLogin(userCredential, props.history);
        }
        else if(userCredential.additionalUserInfo.providerId === "facebook.com") {
          props.facebookLogin(userCredential, props.history);
        }
        else {
          props.login(userCredential, props.history)
        }
      })
      .catch(e => {
        props.error(e.message);
      });
    }
  }
  
  const startTwoFA = () => {
    props.setComponent("2fa-modal");
    var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'});
    if(props.enroll) {
      var user = auth.currentUser;
      var phoneNumber = props.phoneNumber.split('(').join('');
      phoneNumber = phoneNumber.split(')').join('-');
      if(user) {
        clearInterval(interval.current);
        user.multiFactor.getSession().then(function(multiFactorSession) {
          // Specify the phone number and pass the MFA session.
          var phoneInfoOptions = {
            phoneNumber,
            session: multiFactorSession
          };
          var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
          // Send SMS verification code.
          return phoneAuthProvider.verifyPhoneNumber(
              phoneInfoOptions, appVerifier);
        })
        .then(function(verificationId) {
          setVerificationId(verificationId);
        })
        .catch(e => {
          props.error(e.message);
        });
      }
    }
    else {
      clearInterval(interval.current);
      var phoneInfoOptions = {
        multiFactorHint: props.resolver.hints[0],
        session: props.resolver.session
      };
      var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
      // Send SMS verification code.
      return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, appVerifier)
        .then(function(verificationId) {
          setVerificationId(verificationId);
        })
        .catch(e => {
          props.visible(true);
          props.error(e.message);
        });
    }
  }


  useEffect(() => {
    interval.current = setInterval(function() {
      startTwoFA();
    }, 1000);
    props.visible(false);
    return () => clearInterval(interval.current);
  // eslint-disable-next-line
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    submit();
  }

  return (
    <div className="twofa-modal">
      <GridContainer justify="center"> 
        <GridItem xs={12}>
          <Card className={`${classes[cardAnimaton]} h-100`}>
            <form className={classes.form} onSubmit={onSubmit}>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4 className={classes.headerText}>Two Factor Authentication</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                    <div className={classes.accountTextContainer}>
                      <div className={classes.accountName}>
                        Enter the verification code generated by the phone ending in {secretPhone}.
                      </div>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} className={`${classes.accountContainer} mt-5`}>
                  <div className={classes.buttonContainer}>
                      <i className={`${classes.avatar} fa fa-mobile mr-3`}/>
                      <CustomInput
                        labelText="Verification Code"
                        id="verification-code"
                        value={verificationCode}
                        onChange={updateVerificationCode}
                        formControlProps={{
                          className: "twofa-input mx-2 align-self-center"
                        }}
                      />
                      <Button className="ml-3 h-50 align-self-center" disabled={isInvalid} color="primary" onClick={submit} >
                        Verify
                      </Button>
                    </div>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                    <div id="recaptcha-container" />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                    { props.alertVisible && props.alertType === "alert-pending" && <i className="fas fa-spinner fa-spin align-self-center" style={{fontSize: 20, color: "grey"}}/> }
                    { props.alertVisible && props.alertType === "alert-success" &&  <div className="successMessage">{props.alertMessage}</div> }
                    { props.alertVisible && props.alertType === "alert-error" && <div className="errorMessage">{props.alertMessage}</div> }
                  </GridItem>
                </GridContainer>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    twoFactorAuth: store.user.userData.twoFactorAuth,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}
const mapDispatchToProps = (dispatch, history) => {
  return {
    visible: (show) => dispatch(alertActions.visible(show)),
    pending: (pending) => dispatch(alertActions.pending(pending)),
    error: (message) => dispatch(alertActions.error(message)),
    success: (message) => dispatch(alertActions.success(message)),
    setComponent: (component) => dispatch(alertActions.component(component)),
    login: (user, history) => dispatch(userActions.login(user, history)), 
    googleLogin: (result, history) => dispatch(userActions.googleLogin(result, history)),
    facebookLogin: (result, history) => dispatch(userActions.facebookLogin(result, history)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TwoFactorAuthModal));
