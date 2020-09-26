import React, { useState } from "react";
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

import styles from "assets/jss/material-kit-react/components/deleteAccountModal.js";

import { userActions } from 'actions';
import { auth } from "../../helpers/firebase";
import { isDev } from "helpers";

const useStyles = makeStyles(styles);

const SimpleButton = withStyles({
  label: {
    color: '#121858',
  },
})(Button);

function DeleteAccountModal(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const message = `Are you sure you would like to delete all of your information
      from this platform? This action is undoable and you will need to 
      create an account from scratch if you'd like to continue to use our
      platform.  If you're certain, type DELETEACCOUNT in the input box.`;
  const [input, setInput] = useState("");
  setTimeout(function() {
    setCardAnimation("");
  }, 300);

  const classes = useStyles();

  const isInvalid = input !== "DELETEACCOUNT" || (props.alertVisible && props.alertType === "alert-error");

  const deleteAccount = (e) => {
    e.preventDefault();
    if(input === "DELETEACCOUNT" || isDev()) {
      props.deleteAccount(auth.currentUser.uid);
    }
  }

  const updateInput = (e) => {
    setInput(e.target.value);
  }

  return (
    <div className="twofa-modal">
      <GridContainer justify="center"> 
        <GridItem xs={12}>
          <Card className={`${classes[cardAnimaton]} h-100`}>
            <form className={classes.form} onSubmit={deleteAccount}>
              <CardHeader color="primary" className={classes.cardHeader}>
                <h4 className={classes.headerText}>Delete Account</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                    <div className={classes.message}>{message}</div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                    <CustomInput
                      labelText="Delete Account?"
                      id=""
                      value={input}
                      onChange={updateInput}
                      formControlProps={{
                        className: "mx-2 align-self-center"
                      }}
                      error={props.alertVisible && props.alertType === "alert-error"}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter className={classes.cardFooter}>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} className={classes.accountContainer}>
                    <div className={classes.buttonContainer}>
                      <SimpleButton simple color="primary" size="lg" onClick={props.handleClose}>
                        Cancel
                      </SimpleButton>
                      <Button disabled={isInvalid} color={props.backedUp ? "primary" : "danger"} size="lg" onClick={deleteAccount}>
                        Delete Account
                      </Button>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} lg={12} className={`${classes.instructionContainer}`}>
                    { props.alertVisible && props.alertType === "alert-pending" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
                    { props.alertVisible && props.alertType === "alert-success" && <div className="successMessage">{props.alertMessage}</div> }
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
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    deleteAccount: (uid) => dispatch(userActions.deleteAccount(uid)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DeleteAccountModal));
