import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { db } from "../../../../firebase";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

// material-ui
import Button from "components/CustomButtons/Button.js";

import s from '../Profile.module.scss';
import { userActions, alertActions } from "actions";

function PersonalInformation(props) {
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);

  const updateNames = () => {
    db.collection("users").doc(props.user.uid).update({ firstName, lastName });
    var userData = {};
    Object.assign(userData, props.userData);
    userData["firstName"] = firstName;
    userData["lastName"] = lastName;
    props.updateUserData(userData);
  }

  const sendVerificationEmail = () => {
    props.clear();
    props.setComponent('personal');
    props.sendVerificationEmail();
  }

  useEffect(() => {
    props.clear();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>Personal Information</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} md={6}>
            <AuthCustomInput
              id="first-name"
              labelText="First Name"
              value={firstName}
              white
              onBlur={() => updateNames()}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              inputProps={{
                color: "secondary",
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <AuthCustomInput
              id="last-name"
              labelText="Last Name"
              value={lastName}
              white
              onBlur={() => updateNames()}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              inputProps={{
                color: "secondary",
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <AuthCustomInput
              id="email"
              labelText="Email"
              value={props.email}
              disabled
              fullWidth
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={2} className={s.instructionContainer}>
              {props.user.emailVerified ?
                <div className={s.instructionContainer}>
                  <i className="fa fa-check successMessage email-icon mr-3 mb-sm-4 mb-md-0"/>
                  <span className="ml-xs">Email Verified</span>
                </div>
                :
                <div className={s.instructionContainer}>
                  <i className="fa fa-ban errorMessage email-icon mr-3 mb-sm-4 mb-md-0"/>
                  <span className="ml-xs">Email not verified</span>
                </div>
              }
          </GridItem>
          {!props.user.emailVerified &&
            <GridItem xs={12} sm={12} md={6} lg={4} className={s.instructionContainer}>
              <Button 
                color="primary" 
                size="lg" 
                className="mb-lg-3 ml-lg-5"
                onClick={()=> sendVerificationEmail()}
              >
                Send Verification Email
              </Button>
            </GridItem>
          }
          <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
            { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "personal" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
            { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "personal" && <div className="successMessage">{props.alertMessage}</div> }
            { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "personal" && <div className="errorMessage">{props.alertMessage}</div> }
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    email: store.authentication.user.email,
    user: store.authentication.user,
    userData: store.authentication.userData,
    firstName: store.authentication.userData.firstName,
    lastName: store.authentication.userData.lastName,
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updateUserData: (userData) => dispatch(userActions.updateUserData(userData)),
    sendVerificationEmail: () => dispatch(userActions.sendVerificationEmail()),
    setComponent: (component) => dispatch(alertActions.component(component)),
    clear: () => dispatch(alertActions.clear()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalInformation);
