import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { alertActions, userActions } from 'actions';

// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Modal from '@material-ui/core/Modal';

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import Lock from "@material-ui/icons/Lock";

// @font-awesome/icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';

// core components
import UnauthenticatedHeader from "containers/UnauthenticatedHeader/UnauthenticatedHeader.js";
import HeaderLinks from "containers/UnauthenticatedHeader/HeaderLinks.js";
import Footer from "containers/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import ReCaptcha from "components/ReCaptcha/ReCaptcha.js";
import TwoFactorAuthModal from 'components/TwoFactorAuthModal/TwoFactorAuthModal';
import Loader from 'components/Loader/Loader';


import { auth, firebase } from "../../../firebase";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";


// Twitter button for future
// import { faFacebook, faTwitter, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
// <Button
// justIcon
// href="#pablo"
// target="_blank"
// color="transparent"
// onClick={e => e.preventDefault()}
// >
// <FontAwesomeIcon icon={faTwitter} className={classes.socialIcons} style={{cursor: 'pointer'}} />
// </Button>

const useStyles = makeStyles(styles);

const SimpleButton = withStyles({
  label: {
    color: '#121858',
  },
})(Button);

function SignupLoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  // Component did mount
  useEffect(() => {
    props.error("");
    props.visible(false);
  // eslint-disable-next-line
  }, []);

  const classes = useStyles();
  const { ...rest } = props;
  const [human, setHuman] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState(null);

  useEffect(() => {
    if(!props.signUpPage) {
      if(props.loginError && props.errorVisible) {
        setEmailError(true);
        setPasswordError(true);
      }
      else {
        setEmailError(false);
        setPasswordError(false);
      }
    }
  }, [props.loginError, props.signUpPage, props.errorVisible]);

  useEffect(() => {
    setHuman(props.human);
  }, [props.human]);

  const isInvalid = props.signUpPage ?
      firstName === '' ||
      email === '' ||
      password === ''
      :
      email === '' ||
      password === '';

  const validate = (email, password) => {
    var errorMessage = "";
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      errorMessage = "Email formatted incorrectly!";
      props.error(errorMessage);
      props.loginFailure(true, errorMessage, {});
      setEmailError(true);
      return false;
    }
    if (password.length < 6) {
      errorMessage = "Password not at least 6 characters long!";
      props.error(errorMessage);
      props.loginFailure(true, errorMessage, {});
      setPasswordError(true);
      return false;
    }
    return true;
  }


  const submit = (e) => {
    e.preventDefault(); 
    props.error("");
    props.visible(false);
    props.logout();
    if(!human) {
      var errorMessage = "Please complete the captcha to prove you're a human!";
      props.error(errorMessage);
      props.loginFailure(true, errorMessage, {});
      return;
    }
    setEmailError(false);
    setPasswordError(false);
    if(!validate(email, password)) {
      return;
    }
    if(props.signUpPage) {
      props.register(email, firstName, password);
    }
    else {
      auth.signInWithEmailAndPassword(email, password)
        .then(user => {
          props.login(user);
        })
        .catch(e => {
          props.error(e.message);
          props.loginFailure(true, e.message, {});
        });
    }
  }

  const loginFacebook = (e) => {
    e.preventDefault(); 
    props.error("");
    props.visible(false);
    props.logout();
    
    var provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).then(async function(result) {
      props.facebookLogin(result);
    }).catch(function(error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        // The user is a multi-factor user. Second factor challenge is required.
        var resolver = error.resolver;
        if(resolver.hints.length > 0) {
          setResolver(resolver);
          handleOpen();
        }
        else {
          props.error(error.toString());
          props.loginFailure(true, error.toString(), {}, {});
        }
      }
      else {
        props.error(error.toString());
        props.loginFailure(true, error.toString(), {}, {});
      }
    });
  }

  const loginGoogle = (e) => {
    e.preventDefault(); 
    props.error("");
    props.visible(false);
    props.logout();
    
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(async function(result) {
      props.googleLogin(result);
    }).catch(function(error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        // The user is a multi-factor user. Second factor challenge is required.
        var resolver = error.resolver;
        if(resolver.hints.length > 0) {
          setResolver(resolver);
          handleOpen();
        }
        else {
          props.error(error.toString());
          props.loginFailure(true, error.toString(), {}, {});
        }
      }
      else {
        props.error(error.toString());
        props.loginFailure(true, error.toString(), {}, {});
      }
    });
  }

  // Modal
  const handleOpen = () => {
    if(open) return;
    props.visible(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <>
      { !open && props.isLoginPending ? <Loader /> :
        <div>
          <Modal
            open={open}
            onClose={handleClose}
          >
            <div>
              <TwoFactorAuthModal resolver={resolver} handleClose={handleClose} enroll={false} />
            </div>
          </Modal>
          <UnauthenticatedHeader
            absolute
            color="transparent"
            brand="Atlas One"
            rightLinks={<HeaderLinks />}
            {...rest}
          />
          <div
            className={classes.pageHeader}
            style={{
              backgroundImage: "url(" + image + ")",
              backgroundSize: "cover",
              backgroundPosition: "top center"
            }}
          >
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <Card className={classes[cardAnimaton]}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>{props.signUpPage ? "Signup" : "Login"} with Provider</h4>
                      <div className={classes.socialLine}>
                        <Button
                          justIcon
                          href=""
                          target="_blank"
                          color="transparent"
                          onClick={loginFacebook}
                        >
                          <FontAwesomeIcon icon={faFacebook} className={classes.socialIcons} style={{cursor: 'pointer'}} />
                        </Button>
                        <Button
                          justIcon
                          href=""
                          target="_blank"
                          color="transparent"
                          onClick={loginGoogle}
                        >
                          <FontAwesomeIcon icon={faGooglePlusG} className={classes.socialIcons} style={{cursor: 'pointer'}} />
                        </Button>
                      </div>
                    </CardHeader>
                    <p className={classes.divider}>Or Be Classical</p>
                    <CardBody>
                      <form className={classes.form} onSubmit={submit}>
                        {props.signUpPage &&
                          <CustomInput
                            labelText={"First Name"}
                            id="first"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: "text",
                              endAdornment: (
                                <InputAdornment position="end">
                                  <People className={classes.inputIconsColor} />
                                </InputAdornment>
                              )
                            }}
                          />
                        }
                      </form>
                      <form className={classes.form} onSubmit={submit}>
                        <CustomInput
                          labelText="Email..."
                          id="email"
                          value={email}
                          formControlProps={{
                            fullWidth: true
                          }}
                          error={emailError}
                          onChange={(e) => setEmail(e.target.value)}
                          inputProps={{
                            type: "email",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Email className={classes.inputIconsColor} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </form>
                      <form className={classes.form} onSubmit={submit}>
                        <CustomInput
                          labelText="Password"
                          id="pass"
                          value={password}
                          formControlProps={{
                            fullWidth: true
                          }}
                          error={passwordError}
                          onChange={(e) => setPassword(e.target.value)}
                          inputProps={{
                            type: "password",
                            endAdornment: (
                              <InputAdornment position="end">
                              <Lock className={classes.inputIconsColor} />
                              </InputAdornment>
                            ),
                            autoComplete: "off"
                          }}
                        />
                      </form>
                      <form className={classes.form} onSubmit={submit}>
                        <ReCaptcha show={!human} signUp={props.signUpPage} />
                      </form>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <SimpleButton disabled={isInvalid} simple color="primary" size="lg" onClick={submit}>
                        Get started
                      </SimpleButton>
                      { !open && props.isLoginSuccess  && <div className={classes.successMessage}>Success.</div> }
                      { !open && (props.loginError || props.errorVisible) && <div className={classes.errorMessage}>{props.errorMessage}</div> }
                    </CardFooter>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
            <Footer authenticated={false} whiteFont />
          </div>
        </div>
      }
    </>
  );
}


const mapStateToProps = (state) => {
  return {
    isLoginPending: state.user.isLoginPending,
    isLoginSuccess: state.user.isLoginSuccess,
    loginError: state.user.loginError,
    errorMessage: state.alert.message,
    errorVisible: state.alert.visible,
    signUp: state.user.signUp,
    human: state.user.human,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    visible: (show) => dispatch(alertActions.visible(show)),
    testReCaptcha: (value, signUp, latestAction) => dispatch(userActions.testReCaptcha(value, signUp, latestAction)),
    error: (errorMessage) => dispatch(alertActions.error(errorMessage)),
    loginFailure: (loginError, error, user, userData) => dispatch(userActions.loginFailure(loginError, error, user, userData)),
    logout: () => dispatch(userActions.logout()),
    register: (email, firstName, password)  => dispatch(userActions.register(email, firstName, password)),
    googleLogin: (result) => dispatch(userActions.googleLogin(result)),
    facebookLogin: (result) => dispatch(userActions.facebookLogin(result)),
    login: (user) => dispatch(userActions.login(user)),
  };
}

const Signup = connect(mapStateToProps, mapDispatchToProps)(SignupLoginPage);
export default Signup;
