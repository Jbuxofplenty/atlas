import React, { useState, useRef, useEffect } from "react";
import { connect } from 'react-redux';

// @material-ui
import { makeStyles } from "@material-ui/core/styles";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-kit-react/components/connect.js";

// OAuth
import OAuthObject from 'oauth2';
import { randomState, postMessageLocation } from 'helpers';

const useStyles = makeStyles(styles);

function Connect(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 300);
  setTimeout(function() {
    setMessageAnimation("cardShown");
  }, 300);

  const [messageAnimation, setMessageAnimation] = React.useState("cardHidden");

  const classes = useStyles();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [oAuth] = useState(OAuthObject[props.institution.displayName]);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState(`We'll have you login at ${props.institution.displayName} to authorize this application and bring you back here.`);

  const mounted = useRef(false);
  useEffect(() => {
      mounted.current = true;
      return () => { mounted.current = false; };
  }, []);

  let windowObjectReference = null;
  let previousUrl = null;

  const openSignInWindow = (url, name) => {
    // remove any existing event listeners
    window.removeEventListener('message', receiveMessage);

    // window features
    const strWindowFeatures =
      'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';

    if (windowObjectReference === null || windowObjectReference.closed) {
      /* if the pointer to the window object in memory does not exist
        or if such pointer exists but the window was closed */
      windowObjectReference = window.open(url, name, strWindowFeatures);
    } else if (previousUrl !== url) {
      /* if the resource to load is different,
        then we load it in the already opened secondary window and then
        we bring such window back on top/in front of its parent window. */
      windowObjectReference = window.open(url, name, strWindowFeatures);
      windowObjectReference.focus();
    } else {
      /* else the window reference must exist and the window
        is not closed; therefore, we can bring it back on top of any other
        window with the focus() method. There would be no need to re-create
        the window or to reload the referenced resource. */
      windowObjectReference.focus();
    }
    var popupTick = setInterval(function() {
      if (windowObjectReference.closed) {
        clearInterval(popupTick);
        if(mounted.current && authCode !== '') {
          setIsPending(false);
          setIsError(true);
          setMessage("Looks the connect popup was closed before authentication could be granted!");
        }
      }
    }, 1000);

    // add the listener for receiving a message from the popup
    window.addEventListener('message', event => receiveMessage(event), false);
    // assign the previous URL
    previousUrl = url;
  };

  const receiveMessage = event => {
    // Check to make sure modal wasn't closed
    if(mounted.current) {
      // Do we trust the sender of this message? (might be
      // different from what we originally opened, for example).
      if (event.origin !== postMessageLocation()) {
        return;
      }
      const { data } = event;
      // if we trust the sender and the source is our popup
      if (data.source === 'oauth-login-redirect') {
        const { code, state } = data;
        if(state === oAuth.state) {
          setAuthCode(code);
          fetch(oAuth.buildTokenRequest(code), {
            method: 'POST',
          }).then(response => response.json()).then(data => { 
            setIsPending(false);
            setIsSuccess(true);
            setMessage(`You successfully connected your ${props.institution.displayName} account!  We're pulling in all of your data now.`);
          }).catch(error => {
            setIsPending(false);
            setIsError(true);
            setMessage(error);
          });
        }
        else {
          setIsPending(false);
          setIsError(true);
          setMessage("State query parameter in request is not the same as the state returned in the response!");
        }
      }
    }
  };

  const oAuthFlow = async () => {
    setIsPending(true);
    if(oAuth.type === "OAuth") {
      oAuth.state = randomState();
      const authRequest = oAuth.buildAuthRequest(oAuth.state);
      openSignInWindow(authRequest, props.institution.displayName);
    }
  }

  const showMessageHTML = () => {
    if(isPending) {
      return (
        <div className={classes[messageAnimation]}>
          <hr className={classes.rounded} />
          <i className={`la la-refresh la-spin ${classes.message}`} />
        </div>
      )
    }
    else if(isError){
      return (
        <div className={classes[messageAnimation]}>
          <hr className={classes.rounded} />
          <div className={classes.errorMessage}>{message}</div> 
        </div>
      )
    }
    else if(isSuccess){
      return (
        <div className={classes[messageAnimation]}>
          <hr className={classes.rounded} />
          <VerifiedUserIcon className={classes.icon} />
          <div className={classes.message}>{message}</div> 
        </div>
      )
    }
    else {
      return (
        <div className={classes[messageAnimation]}>
          <hr className={classes.rounded} />
          <div className={classes.message}>{message}</div> 
        </div>
      )
    }
  }

  return (
    <div className="connect-modal">
      <GridContainer justify="center"> 
        <GridItem xs={12}>
          <Card className={`${classes[cardAnimaton]} h-100`}>
            <form className={classes.form}>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4 className={classes.headerText}>Connect</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                  <div className={classes.imageContainer}>
                    <img className={`${classes.avatar} rounded-circle thumb-sm float-left ml-2 mr-2`} alt="bs" src={props.institution.icon}/>
                  </div>
                  <div className={classes.accountTextContainer}>
                    <div className={classes.accountName}>
                      {props.institution.displayName}
                    </div>
                    <div className={classes.accountUrl}>
                      {props.institution.url}
                    </div>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  {showMessageHTML()}
                </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <div className={classes.buttonContainer}>
                  <Button simple color="primary" size="lg" onClick={props.handleClose}>
                    Cancel
                  </Button>
                  <Button disabled={isSuccess} color="primary" size="lg" onClick={oAuthFlow}>
                    Connect
                  </Button>
                </div>
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
    email: store.authentication.user.email,
  };
}

export default connect(mapStateToProps)(Connect);