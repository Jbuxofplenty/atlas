import React, { useState, useEffect } from "react";
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
import { auth } from 'helpers';

function BackupKey(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const isInvalid =
      password === '';

  const backupKey = () => {
    props.setComponent("backup-key");
    props.backupKey(password, auth.currentUser.uid);
  }

  useEffect(() => {
    props.visible(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3 className={`${s.header} mb-3`}>Backup Private Key</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12}  md={6} lg={5} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Because this framework uses end-to-end encryption, it places
              a larger burden on the user to manage encryption keys.
              Generating a backup password for your private key is critical
              because the key is located on your personal device. If you
              would like to use Atlas One on multiple devices, you will need
              to generate a backup password.  If you clear
              your cookies before making a backup password for your key, you 
              will need to sign into all of your accounts again and your
              encrypted financial data will need to be pulled from the servers!
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={7}>
            <GridContainer justify="center" className={`${s.gridContainer}`}>
              <GridItem xs={12} sm={12} md={6} lg={9}>
                <AuthCustomInput
                  id="backup-password"
                  labelText="Backup Password"
                  value={password}
                  white
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  inputProps={{
                    color: "secondary",
                    type: showPassword ? 'text' : 'password',
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          color="secondary"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} lg={3} className={`${s.instructionContainer}`}>
                <Button 
                  color="primary" 
                  size="lg" 
                  className="mb-lg-3 ml-lg-5"
                  onClick={()=> backupKey()}
                  disabled={isInvalid}
                >
                  Backup key
                </Button>
              </GridItem>
              <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
                { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "backup-key" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
                { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "backup-key" && <div className="successMessage">{props.alertMessage}</div> }
                { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "backup-key" && <div className="errorMessage">{props.alertMessage}</div> }
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
    backupKey: (keyPassword, uid) => dispatch(eThreeActions.backupKey(keyPassword, uid)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupKey);
