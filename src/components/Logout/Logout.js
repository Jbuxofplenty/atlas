import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// @material-ui
import { makeStyles, withStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/components/logoutModal.js";

import { userActions, eThreeActions } from 'actions';
import { widgetActions } from "actions";

const useStyles = makeStyles(styles);

const SimpleButton = withStyles({
  label: {
    color: '#121858',
  },
})(Button);

function Logout(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  setTimeout(function() {
    setCardAnimation("");
  }, 300);

  const classes = useStyles();

  const isInvalid = message === "" ||
      (!props.backedUp && input !== "LOGOUT");

  const logout = async (e) => {
    e.preventDefault();
    if(input === "LOGOUT" || props.backedUp) {
      if(props.location.pathname === '/app/dashboard') {
        await widgetActions.updateFirebaseWidgets('dashboard');
      }
      props.logout();
    }
  }

  const updateInput = (e) => {
    setInput(e.target.value);
  }

  useEffect(() => {
    if(props.backedUp) {
      setMessage(`Looks like you've backed up your private key for 
          encryption to the cloud already.  Make sure you remember 
          the private key's password because logging out of this
          application will delete the private key from your device!
          If you cannot remember the private key's password, you
          will lose access to all your existing financial data and
          will need to start from scratch.`);
    }
    else {
      setMessage(`You do not have a back up for your private key, 
          which is used to encrypt/decrypt all of your financial
          data!  If you logout now, you will lose all access
          to your financial data on this platform! If you would
          like to delete your account fully from this platform,
          go to your profile and select delete account.  Enter
          LOGOUT in the text box if you would still like to 
          logout and reset all of your financial data.`);
    }
  // eslint-disable-next-line
  }, []);

  return (
    <div className="twofa-modal">
      <GridContainer justify="center"> 
        <GridItem xs={12}>
          <Card className={`${classes[cardAnimaton]} h-100`}>
            <form className={classes.form} onSubmit={logout}>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4 className={classes.headerText}>Logout</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                  <div className={classes.message}>{message}</div>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                  {!props.backedUp &&
                    <CustomInput
                      labelText="Logout?"
                      id=""
                      value={input}
                      onChange={updateInput}
                      formControlProps={{
                        className: "mx-2 align-self-center"
                      }}
                    />
                  }
                </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <div className={classes.buttonContainer}>
                  <SimpleButton simple color="primary" size="lg" onClick={props.handleClose}>
                    Cancel
                  </SimpleButton>
                  <Button disabled={isInvalid} color={props.backedUp ? "primary" : "danger"} size="lg" onClick={logout}>
                    Logout
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
    backedUp: store.eThree.backedUp,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    logout: () => dispatch(userActions.logout()),
    localKeyPresent: () => dispatch(eThreeActions.localKeyPresent()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout));
