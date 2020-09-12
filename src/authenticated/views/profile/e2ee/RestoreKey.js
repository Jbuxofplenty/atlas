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

function RestoreKey(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const isInvalid =
      password === '';
      
  const restoreKey = () => {
    props.setComponent("restore-key");
    props.restoreKey(password);
  }

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Restore Private Key</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12}  md={6} lg={5} className={`${s.instructionContainer}`}>
            <div className={`${s.instructionText}`}>
              Retrieve backed up private key from the cloud.  Enter the correct
              password you used to backup your private key initially.
            </div>
          </GridItem>
          <GridItem xs={12} sm={12}  md={6} lg={7}>
            <GridContainer justify="center" className={`${s.gridContainer}`}>
              <GridItem xs={12} sm={12}  md={6} lg={8}>
                <AuthCustomInput
                  id="restore-password"
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
              <GridItem xs={12} sm={12} lg={4} className={`${s.instructionContainer}`}>
                <Button 
                  color="primary" 
                  size="lg" 
                  className="mb-lg-3"
                  onClick={()=> restoreKey()}
                  disabled={isInvalid}
                >
                  Restore key
                </Button>
              </GridItem>
              <GridItem xs={12} sm={12} lg={12} className={`${s.instructionContainer}`}>
                { props.alertVisible && props.alertType === "alert-pending" && props.alertComponent === "restore-key" && <i className="fas fa-spinner fa-spin" style={{fontSize: 20}}/> }
                { props.alertVisible && props.alertType === "alert-success" &&  props.alertComponent === "restore-key" && <div className="successMessage">{props.alertMessage}</div> }
                { props.alertVisible && props.alertType === "alert-error" && props.alertComponent === "restore-key" && <div className="errorMessage">{props.alertMessage}</div> }
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
    restoreKey: (keyPassword) => dispatch(eThreeActions.restoreKey(keyPassword)),
    visible: (show) => dispatch(alertActions.visible(show)),
    setComponent: (component) => dispatch(alertActions.component(component)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RestoreKey);
