import React, { useState } from "react";
import { connect } from 'react-redux';

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import AuthCustomInput from "components/AuthCustomInput/AuthCustomInput.js";

// material-ui
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from "components/CustomButtons/Button.js";

import s from '../Profile.module.scss';
import { eThreeActions, alertActions } from "actions";

function UpdatePassword(props) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const isInvalid =
      newPassword === '' ||
      oldPassword === '';

  const updatePassword = (e) => {
    if(e) e.preventDefault();
    props.setComponent("update-pass");
    props.updatePassword(oldPassword, newPassword);
  }

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Update Private Key Password</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <form onSubmit={updatePassword} className={`${s.gridContainer}`}>
          <GridContainer justify="center" className={`${s.internalGridContainer}`}>
            <GridItem xs={12} sm={12} md={6} lg={4} className={`ml-3 ml-md-0`}>
              <AuthCustomInput
                id="e2ee-old-password"
                labelText="Old Password"
                value={oldPassword}
                white
                onChange={(e) => setOldPassword(e.target.value)}
                fullWidth
                inputProps={{
                  color: "secondary",
                  type: showOldPassword ? 'text' : 'password',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onChange={() => setShowOldPassword(!showOldPassword)}
                        color="secondary"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={6} lg={4} className={`ml-3 ml-md-0`}>
              <AuthCustomInput
                id="e2ee-new-password"
                labelText="New Password"
                value={newPassword}
                white
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                inputProps={{
                  color: "secondary",
                  type: showNewPassword ? 'text' : 'password',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onChange={() => setShowNewPassword(!showNewPassword)}
                        color="secondary"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} lg={2} className={`${s.instructionContainer}`}>
              <Button 
                color="primary" 
                size="lg" 
                className="mb-lg-3 ml-lg-5"
                onClick={()=> updatePassword()}
                disabled={isInvalid}
              >
                Update Password
              </Button>
            </GridItem>
            <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
              { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "update-pass" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
              { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "update-pass" && <div className="successMessage">{props.alertMessage}</div> }
              { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "update-pass" && <div className="errorMessage">{props.alertMessage}</div> }
            </GridItem>
          </GridContainer>
        </form>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    alertType: store.alert.type,
    alertMessage: store.alert.message,
    alertVisible: store.alert.visible,
    alertComponent: store.alert.component,
  };
}

const mapDispatchToProps = (dispatch, history) => {
  return {
    updatePassword: (oldPassword, newPassword) => dispatch(eThreeActions.updatePassword(oldPassword, newPassword)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
