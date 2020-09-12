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
import { userActions, alertActions } from "actions";

function UpdatePassword(props) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const isInvalid =
      newPassword === '';
      
  const updatePassword = () => {
    props.setComponent("update-pass");
    props.changePassword(newPassword);
  }

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Change Password</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12}  md={6} lg={5} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              You can set a new password here.  Note this password is associated with
              your login to the Atlas One website, it should be a different password
              than what you use to secure your private key for end-to-end encryption.
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            <GridContainer justify="center" className={`${s.gridContainer}`}>
              <GridItem xs={12} sm={12} md={6} lg={8}>
                <AuthCustomInput
                  id="atlas-new-password"
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
              <GridItem xs={12} sm={12} lg={4} className={`${s.instructionContainer}`}>
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
          </GridItem>
        </GridContainer>
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
    changePassword: (keyPassword) => dispatch(userActions.changePassword(keyPassword)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
