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

function UpdatePassword(props) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div>
      <h3 className={`${s.header} mb-3 mt-5`}>Change Password</h3>
      <div className="d-flex flex-column justify-content-center w-100">
        <div className={`${s.rounded}`}></div>
        <GridContainer justify="center" className={`${s.gridContainer}`}>
          <GridItem xs={12} sm={12} md={6} lg={4}>
            <AuthCustomInput
              id="atlas-old-password"
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
          <GridItem xs={12} sm={12} md={6} lg={4}>
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
          <GridItem xs={12} sm={12} lg={2} className={`${s.instructionContainer}`}>
            <Button 
              color="primary" 
              size="lg" 
              className="mb-lg-3 ml-lg-5"
            >
              Update Password
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}

function mapStateToProps(store) {
  return {
    email: store.authentication.user.email,
  };
}

export default connect(mapStateToProps)(UpdatePassword);
